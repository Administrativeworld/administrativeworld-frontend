// src/components/Admin/Coupons/CouponCard.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import EditCoupons from "./EditCoupons";

const API = import.meta.env.VITE_BASE_URL;

const CouponCard = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/coupon/getallcoupons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setCoupons(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch coupons");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = (codeName) => {
    setCoupons((prev) => prev.filter((c) => c.codeName !== codeName));
  };

  const handleUpdate = (updatedCoupon) => {
    setCoupons((prev) =>
      prev.map((c) => (c.codeName === updatedCoupon.codeName ? updatedCoupon : c))
    );
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading coupons...</p>;
  }

  if (!Array.isArray(coupons) || coupons.length === 0) {
    return <p className="text-center text-gray-500">No coupons available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {coupons.map((coupon) => (
        <EditCoupons
          key={coupon.codeName}
          coupon={coupon}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
};

export default CouponCard;
