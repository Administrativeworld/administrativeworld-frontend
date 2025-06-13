// src/components/Admin/Coupons/EditCoupons.jsx

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const API = import.meta.env.VITE_BASE_URL;

const EditCoupons = ({ coupon, onDelete, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...coupon });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API}/coupon/${coupon.codeName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },withCredentials: true,
      });

      toast.success("Deleted");
      onDelete(coupon.codeName);
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(`${API}/coupon/${coupon.codeName}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },withCredentials: true,
      });

      toast.success("Updated");
      setEditing(false);
      onUpdate(res.data?.data);
    } catch {
      toast.error("Update failed");
    }
  };

  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(`${API}/coupon/${coupon.codeName}/toggle-status`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Status toggled");
      onUpdate(res.data?.data);
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-purple-700">
          {coupon.codeName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {editing ? (
          <>
            <div className="space-y-1">
              <Label>Discount Type</Label>
              <Input
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label>Discount Value</Label>
              <Input
                name="discountValue"
                type="number"
                value={form.discountValue}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label>Max Usage Limit</Label>
              <Input
                name="maxUsageLimit"
                type="number"
                value={form.maxUsageLimit}
                onChange={handleChange}
              />
            </div>
            <Button onClick={handleUpdate}>Save</Button>
          </>
        ) : (
          <>
            <p>
              Type: <strong>{coupon.couponType}</strong>
            </p>
            <p>
              Discount: <strong>{coupon.discountValue}</strong> (
              {coupon.discountType})
            </p>
            <p>
              Status:{" "}
              <span
                className={
                  coupon.isActive ? "text-green-600" : "text-red-500"
                }
              >
                {coupon.isActive ? "Active" : "Inactive"}
              </span>
            </p>
            <p>
              Expires:{" "}
              {coupon.expirationDate
                ? new Date(coupon.expirationDate).toLocaleDateString()
                : "No expiry"}
            </p>
            <div className="flex items-center gap-2">
              <Switch
                checked={coupon.isActive}
                onCheckedChange={handleToggleStatus}
              />
              <span>{coupon.isActive ? "Active" : "Inactive"}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="secondary" onClick={() => setEditing(true)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EditCoupons;
