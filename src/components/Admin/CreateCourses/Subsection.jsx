import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Video, FileText, Pencil, Save, CircleX } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { clearSubSectionState, createSubSection } from "@/redux/api/createSubSection";
import PropTypes from "prop-types";

function Subsection({ onSubSectionCancle }) {
  const dispatch = useDispatch();
  const { sectionId } = useSelector((state) => state.courseBuilder);
  const { data, status } = useSelector((state) => state.createSubSection);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
  });

  useEffect(() => {
    if (status === 200) {
      toast.success("Subsection Saved!");
      onSubSectionCancle()
      dispatch(clearSubSectionState())
    }

  }, [data, status, dispatch]);  // ✅ Add dependencies to prevent infinite loops

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sectionId) {
      dispatch(createSubSection({ ...formData, sectionId: sectionId }));
    }

    setFormData({ title: "", description: "", videoUrl: "" });
  };

  return (
    <Card className="max-w-lg mx-auto shadow-lg border rounded-2xl p-5">
      <CardHeader>
        <CardTitle className="  text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Pencil size={20} />
            Create Subsection
            <Button size='icon' className="ml-auto" onClick={() => onSubSectionCancle()}><CircleX /></Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input
              className="pl-10 py-3 rounded-lg border transition-all"
              type="text"
              name="title"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative">
            <Pencil className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Textarea
              className="pl-10 py-3 rounded-lg border transition-all"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative">
            <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input
              className="pl-10 py-3 rounded-lg border transition-all"
              type="url"
              name="videoUrl"
              placeholder="Enter video URL"
              value={formData.videoUrl}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-all">
            <Save size={16} /> Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
Subsection.propTypes = {
  onSubSectionCancle: PropTypes.func, // Ensure it's a function and required
};


export default Subsection;
