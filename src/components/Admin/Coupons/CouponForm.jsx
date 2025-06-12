
// admin/CouponForm.jsx
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/components/ui/use-toast";
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
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/coupon/createcouponcode`, form,{ withCredentials: true  });
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
      console.error(error); 
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <h2 className="text-2xl font-bold">Create New Coupon</h2>

      <div className="space-y-4">
        <div>
          <Label>Coupon Code</Label>
          <Input name="codeName" value={form.codeName} onChange={handleChange} placeholder="e.g., SUMMER20" />
        </div>

        <div className="">
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
          <Input name="discountValue" type="number" value={form.discountValue} onChange={handleChange} />
        </div>

        <div>
          <Label>Max Usage Limit</Label>
          <Input name="maxUsageLimit" type="number" value={form.maxUsageLimit} onChange={handleChange} />
        </div>

        <div>
          <Label>Expiration Date</Label>
          <Input name="expirationDate" type="date" value={form.expirationDate} onChange={handleChange} />
        </div>

        <Button onClick={handleSubmit}>Create Coupon</Button>
      </div>
    </div>
  );
}
