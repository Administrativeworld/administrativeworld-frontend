import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { resetProfileState, updateProfile } from "@/redux/api/updateProfileSlice";
import { uploadProfilePicture } from "@/redux/api/displayPicture";
import toast from "react-hot-toast";
import PrimarySpinner from "../Loaders/PrimarySpinner";
import { useNavigate } from "react-router-dom";

export default function EditProfileDialog({ user, open, setOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: profileLoading, status } = useSelector((state) => state.updateProfile);
  const { loading: imageUploading, imageUrl } = useSelector((state) => state.displayPicture);
  const [imagePreview, setImagePreview] = useState(user?.image || "");
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
    contactNumber: user?.contactNumber || "",
    about: user?.additionalDetails?.about || "",
    gender: user?.additionalDetails?.gender || "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      dispatch(uploadProfilePicture({ file: file, publicId: user.image_public_id }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric chars
    if (value.length > 2 && value.length <= 4) value = `${value.slice(0, 2)}.${value.slice(2)}`;
    else if (value.length > 4) value = `${value.slice(0, 2)}.${value.slice(2, 4)}.${value.slice(4, 8)}`;
    setFormData((prev) => ({ ...prev, dateOfBirth: value.slice(0, 10) }));
  };

  const handleGenderChange = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleSave = () => {
    const updatedData = { ...formData, image: imageUrl || imagePreview };
    if (JSON.stringify(updatedData) !== JSON.stringify(user)) {
      dispatch(updateProfile(updatedData));
    } else {
      toast.info("No changes made");
    }
  };

  useEffect(() => {
    if (status === 200) {
      toast.dismiss();
      toast.success("Profile Updated");
      navigate("/home/user");
      setOpen(false);
      dispatch(resetProfileState());
    }
  }, [status, navigate, dispatch, setOpen]);

  useEffect(() => {
    if (imageUrl) setImagePreview(imageUrl);
  }, [imageUrl]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24 border-2 border-gray-200">
              <AvatarImage src={imagePreview} />
              <AvatarFallback className="bg-gray-100">
                {formData.firstName?.[0]}{formData.lastName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="profile-image"
                onChange={handleImageChange}
              />
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => document.getElementById("profile-image").click()}
                disabled={imageUploading}
              >
                {imageUploading ? "Uploading..." : "Change Photo"}
              </Button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Email</label>
              <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} disabled />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Date of Birth (DD.MM.YYYY)</label>
              <Input name="dateOfBirth" type="text" placeholder="DD.MM.YYYY" value={formData.dateOfBirth} onChange={handleDateChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Number</label>
              <Input name="contactNumber" type="tel" placeholder="Contact Number" value={formData.contactNumber} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select value={formData.gender} onValueChange={handleGenderChange}>
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">About</label>
              <Textarea name="about" placeholder="Tell us about yourself" value={formData.about} onChange={handleInputChange} className="w-full min-h-[100px]" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={profileLoading}>{profileLoading ? <PrimarySpinner /> : "Save Changes"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

EditProfileDialog.propTypes = {
  user: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
