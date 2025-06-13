import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Video, FileText, Edit3, Save, CircleX, Pencil, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";
import PrimarySpinner from "../../Loaders/PrimarySpinner";
import {
  addSubSectionToSection,
  updateSubSectionInSection,
  fetchSections
} from "@/redux/api/courseBuilderSlice";

function EditSubsection({ onSubSectionCancel, subsectionData, isEditMode = false }) {
  const dispatch = useDispatch();
  const { sectionId, courseId } = useSelector((state) => state.courseBuilder);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subsectionData && isEditMode) {
      setFormData({
        title: subsectionData.title || "",
        description: subsectionData.description || "",
        videoUrl: subsectionData.videoUrl || "",
      });
    } else {
      // Reset form for create mode
      setFormData({
        title: "",
        description: "",
        videoUrl: "",
      });
    }
  }, [subsectionData, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (isEditMode && !subsectionData?._id) {
      toast.error("Subsection ID is missing");
      return;
    }

    if (!sectionId) {
      toast.error("Section ID is missing");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        // Update existing subsection
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/courses/updateSubSection`,
          {
            title: formData.title,
            description: formData.description,
            videoUrl: formData.videoUrl,
            subSectionId: subsectionData._id,
            sectionId: sectionId,
          },
          { withCredentials: true }
        );

        if (response.status === 200) {
          toast.success("Subsection updated successfully!");
          dispatch(fetchSections(courseId));
          // Update the Redux store with the updated subsection data
          dispatch(updateSubSectionInSection({
            sectionId: sectionId,
            subSectionId: subsectionData._id,
            subSectionData: {
              ...subsectionData,
              title: formData.title,
              description: formData.description,
              videoUrl: formData.videoUrl,
            }
          }));

          onSubSectionCancel();
        }
      } else {
        // Create new subsection
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/courses/addSubSection`,
          {
            ...formData,
            sectionId: sectionId,
          },
          { withCredentials: true }
        );

        if (response.status === 200) {
          toast.success("Subsection created successfully!");
          dispatch(fetchSections(courseId));
          // Get the new subsection data from response or create a temporary one
          const newSubSectionData = response.data.data || {
            _id: response.data.subSectionId || Date.now().toString(),
            title: formData.title,
            description: formData.description,
            videoUrl: formData.videoUrl,
            sectionId: sectionId,
          };

          // Add the new subsection to the Redux store
          dispatch(addSubSectionToSection({
            sectionId: sectionId,
            subSectionData: newSubSectionData
          }));

          onSubSectionCancel();
        }
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} subsection:`, error);
      toast.error(
        error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} subsection`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode && subsectionData) {
      setFormData({
        title: subsectionData?.title || "",
        description: subsectionData?.description || "",
        videoUrl: subsectionData?.videoUrl || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        videoUrl: "",
      });
    }
    onSubSectionCancel();
  };

  return (
    <Card className="max-w-lg mx-auto shadow-lg border rounded-2xl p-5">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <Edit3 size={20} />
            {isEditMode ? "Edit Subsection" : "Add Subsection"}
            <Button size="icon" className="ml-auto" onClick={handleCancel}>
              <CircleX />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FileText
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={18}
            />
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
            <Pencil className="absolute left-3 top-3 text-gray-500" size={18} />
            <Textarea
              className="pl-10 py-3 rounded-lg border transition-all min-h-[100px] resize-none"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative">
            <Video
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={18}
            />
            <Input
              className="pl-10 py-3 rounded-lg border transition-all"
              type="url"
              name="videoUrl"
              placeholder="Enter video URL (optional)"
              value={formData.videoUrl}
              onChange={handleChange}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
          >
            {loading ? (
              <>
                {isEditMode ? "Updating" : "Creating"} <PrimarySpinner />
              </>
            ) : (
              <>
                {isEditMode ? <Save size={16} /> : <Plus size={16} />}
                {isEditMode ? "Update Subsection" : "Create Subsection"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

EditSubsection.propTypes = {
  onSubSectionCancel: PropTypes.func.isRequired,
  subsectionData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    videoUrl: PropTypes.string,
  }),
  isEditMode: PropTypes.bool,
};

export default EditSubsection;