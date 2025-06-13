import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function CouponForm() {
  const [form, setForm] = useState({
    codeName: "",
    couponType: "",
    discountType: "",
    discountValue: "",
    maxUsageLimit: 1,
    expirationDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Validation (optional but recommended)
    if (
      !form.codeName ||
      !form.couponType ||
      !form.discountType ||
      !form.discountValue ||
      !form.expirationDate
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Prepare data with correct types
    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
      maxUsageLimit: Number(form.maxUsageLimit),
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/coupon/createcouponcode`,
        payload,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Coupon created successfully!");
        setForm({
          codeName: "",
          couponType: "",
          discountType: "",
          discountValue: "",
          maxUsageLimit: 1,
          expirationDate: "",
        });
      }
    } catch (error) {
      toast.error("Failed to create coupon");
      console.error("Coupon creation error:", error?.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <h2 className="text-2xl font-bold">Create New Coupon</h2>

      <div className="space-y-4">
        <div>
          <Label>Coupon Code</Label>
          <Input
            name="codeName"
            value={form.codeName}
            onChange={handleChange}
            placeholder="e.g., SUMMER20"
          />
        </div>

        <div>
          <Label>Coupon Type</Label>
          <select
            name="couponType"
            value={form.couponType}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-transparent"
          >
            <option value="">Select Type</option>
            <option value="Material">Material</option>
            <option value="Universal">Universal</option>
          </select>
        </div>

        <div>
          <Label>Discount Type</Label>
          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-transparent"
          >
            <option value="">Select Discount Type</option>
            <option value="PercentOff">PercentOff</option>
            <option value="RupeesOff">RupeesOff</option>
          </select>
        </div>

        <div>
          <Label>Discount Value</Label>
          <Input
            name="discountValue"
            type="number"
            value={form.discountValue}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Max Usage Limit</Label>
          <Input
            name="maxUsageLimit"
            type="number"
            value={form.maxUsageLimit}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Expiration Date</Label>
          <Input
            name="expirationDate"
            type="date"
            value={form.expirationDate}
            onChange={handleChange}
          />
        </div>

        <Button onClick={handleSubmit}>Create Coupon</Button>
      </div>
    </div>
  );
}
