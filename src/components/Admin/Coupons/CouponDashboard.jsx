// admin/CouponDashboard.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CouponDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">🎟️ Coupon Hub</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Create Coupon</h3>
            <p>Create and publish new discount coupons for users.</p>
            <Button onClick={() => navigate("/admin/coupon/create")}>Start Creating →</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Manage Coupons</h3>
            <p>View or update all your existing coupons.</p>
            <Button variant="secondary" onClick={() => navigate("/admin/coupon/manage")}>
              View Coupons →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
