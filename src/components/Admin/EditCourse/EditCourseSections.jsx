import { ArrowRight, CircleX, Pen, Plus, PlusSquare, Edit3, Trash2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import toast from "react-hot-toast"
import PrimarySpinner from "../../Loaders/PrimarySpinner"
import Subsection from "./EditSubsection"
import {
  nextStep,
  setSectionId,
  setSection,
  setSections,
  fetchSections,
  updateSection,
  removeSection,
  clearErrors
} from "@/redux/api/courseBuilderSlice"

function EditCourseSections() {
  const dispatch = useDispatch();
  const {
    courseId,
    sections,
    subSection,
    isEditMode,
    loading,
    error
  } = useSelector(state => state.courseBuilder);

  // Component state
  const [sectionData, setSectionData] = useState({ sectionName: "" });
  const [popup, setPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [subSectionPopup, setSubSectionPopup] = useState(false);
  const [editingSubsection, setEditingSubsection] = useState(null);
  const [isSubsectionEditMode, setIsSubsectionEditMode] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Toggle subsection popup
  const subSectionPopupToggle = () => {
    setSubSectionPopup(!subSectionPopup);
    if (!subSectionPopup) {
      // Reset subsection edit state when closing
      setEditingSubsection(null);
      setIsSubsectionEditMode(false);
    }
  };

  // Handle edit subsection
  const handleEditSubsection = (subsection, sectionId) => {
    dispatch(setSectionId(sectionId));
    setEditingSubsection(subsection);
    setIsSubsectionEditMode(true);
    setSubSectionPopup(true);
  };

  // Handle add new subsection
  const handleAddSubsection = (sectionId) => {
    dispatch(setSectionId(sectionId));
    setEditingSubsection(null);
    setIsSubsectionEditMode(false);
    setSubSectionPopup(true);
  };

  // Delete subsection
  const handleDeleteSubsection = async (subsectionId, sectionId) => {
    if (window.confirm("Are you sure you want to delete this subsection? This action cannot be undone.")) {
      try {
        setActionLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/courses/deleteSubSection`, {
          subSectionId: subsectionId,
          sectionId: sectionId
        },
          {

            withCredentials: true
          }
        );

        if (response.status === 200) {
          toast.success("Subsection deleted successfully");
          // Refresh sections to update the UI
          dispatch(fetchSections(courseId));
        }
      } catch (error) {
        console.error("Error deleting subsection:", error);
        toast.error(error.response?.data?.message || "Failed to delete subsection");
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Load sections when component mounts or courseId changes
  useEffect(() => {
    if (courseId && (!sections || sections.length === 0)) {
      dispatch(fetchSections(courseId));
    }
  }, [courseId, dispatch]);

  // Update sectionData with courseId
  useEffect(() => {
    if (courseId) {
      setSectionData(prev => ({ ...prev, courseId: courseId }));
    }
  }, [courseId]);

  // Handle loading state changes
  useEffect(() => {
    if (error.sections) {
      toast.error(error.sections);
      dispatch(clearErrors());
    }
  }, [error.sections, dispatch]);

  // Create new section
  const handleCreateSection = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!sectionData.sectionName.trim()) {
      toast.error("Please enter section name");
      return;
    }

    try {
      setActionLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/courses/addSection`,
        {
          sectionName: sectionData.sectionName,
          courseId: courseId
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Section created successfully");

        // Add new section to Redux store using the enhanced slice
        const newSection = response.data.data || {
          _id: response.data.sectionId || Date.now().toString(),
          sectionName: sectionData.sectionName,
          subSection: [],
          courseId: courseId
        };

        dispatch(setSection(newSection));

        // Reset form
        setPopup(false);
        setSectionData({ sectionName: "", courseId: courseId });
      }
    } catch (error) {
      console.error("Error creating section:", error);
      toast.error(error.response?.data?.message || "Failed to create section");
    } finally {
      setActionLoading(false);
    }
  };

  // Update existing section
  const handleUpdateSection = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!sectionData.sectionName.trim()) {
      toast.error("Please enter section name");
      return;
    }

    if (!editingSectionId) {
      toast.error("Section ID is missing");
      return;
    }

    try {
      setActionLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/courses/updateSection`,
        {
          sectionName: sectionData.sectionName,
          sectionId: editingSectionId,
          courseId: courseId
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Section updated successfully");

        // Update section in Redux store using the correct action
        dispatch(updateSection({
          _id: editingSectionId,
          sectionName: sectionData.sectionName
        }));

        // Reset form
        setEditPopup(false);
        setEditingSectionId(null);
        setSectionData({ sectionName: "", courseId: courseId });
      }
    } catch (error) {
      console.error("Error updating section:", error);
      toast.error(error.response?.data?.message || "Failed to update section");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle edit section
  const handleEditSection = (section) => {
    setEditingSectionId(section._id);
    setSectionData({ sectionName: section.sectionName, courseId: courseId });
    setEditPopup(true);
  };

  // Delete section
  const handleDeleteSection = async (sectionId) => {
    if (window.confirm("Are you sure you want to delete this section? This action cannot be undone.")) {
      try {
        setActionLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/courses/deleteSection`,
          { sectionId: sectionId, courseId: courseId },
          { withCredentials: true }
        );

        if (response.status === 200) {
          toast.success("Section deleted successfully");

          // Remove section from Redux store
          dispatch(removeSection(sectionId));
        }
      } catch (error) {
        console.error("Error deleting section:", error);
        toast.error(error.response?.data?.message || "Failed to delete section");
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditPopup(false);
    setEditingSectionId(null);
    setSectionData({ sectionName: "", courseId: courseId });
  };

  // Cancel create
  const cancelCreate = () => {
    setPopup(false);
    setSectionData({ sectionName: "", courseId: courseId });
  };

  // Show loading spinner while fetching sections
  if (loading.sections) {
    return (
      <div className="flex justify-center items-center py-10">
        <PrimarySpinner />
        <span className="ml-2">Loading sections...</span>
      </div>
    );
  }

  return (
    <div className="">
      <div className="text-center text-2xl font-medium p-5">
        {isEditMode ? "Edit Course Content" : "Create Course Content"}
      </div>

      {subSectionPopup ? (
        <Subsection
          onSubSectionCancel={subSectionPopupToggle}
          subsectionData={editingSubsection}
          isEditMode={isSubsectionEditMode}
        />
      ) : (
        <>
          {/* Create/Edit Section Form */}
          {(popup || editPopup) ? (
            <Card className="max-w-md mx-auto shadow-lg border">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold">
                  {editPopup ? "Edit Section" : "Add Section"}
                  <Button
                    size="icon"
                    onClick={editPopup ? cancelEdit : cancelCreate}
                    className="ml-auto"
                    variant="ghost"
                  >
                    <CircleX />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={editPopup ? handleUpdateSection : handleCreateSection}>
                  <div className="relative">
                    <Pen className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
                    <Input
                      className="pl-10 py-3 rounded-lg border transition-all"
                      type="text"
                      placeholder="Enter section name"
                      value={sectionData.sectionName || ""}
                      onChange={(e) => {
                        setSectionData(prev => ({ ...prev, sectionName: e.target.value }));
                      }}
                      required
                    />
                  </div>

                  {actionLoading ? (
                    <Button disabled className="w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-all">
                      {editPopup ? "Updating" : "Creating"} <PrimarySpinner />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                    >
                      {editPopup ? "Update" : "Create"} <Plus size={16} />
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Sections List */}
              {sections && sections.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {sections.map((item) => (
                    <AccordionItem key={item._id || item.value} value={item._id || item.value}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span>{item.sectionName}</span>
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditSection(item)}
                              className="h-8 w-8 p-0 hover:bg-blue-100"
                              title="Edit section"
                            >
                              <Edit3 size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteSection(item._id)}
                              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-500"
                              title="Delete section"
                              disabled={actionLoading}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <div className="w-full border-b"></div>

                      <AccordionContent className="mt-2 pl-5">
                        {/* Display subsections from Redux store */}
                        {subSection && subSection.length > 0 &&
                          subSection
                            .filter((subItem) => subItem._id === item._id)
                            .map((subItem, index) => (
                              <div key={`redux-${index}`} className="flex flex-col">
                                {subItem.subSection && subItem.subSection.map((subItemSection, subIndex) => (
                                  <div key={`redux-sub-${subIndex}`} className="border-b p-2 flex items-center justify-between w-full mb-2">
                                    <div className="flex items-center gap-3">
                                      <Pen size={16} />
                                      <span>{subItemSection.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEditSubsection(subItemSection, item._id)}
                                        className="h-7 w-7 p-0 hover:bg-blue-100"
                                        title="Edit subsection"
                                      >
                                        <Edit3 size={12} />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeleteSubsection(subItemSection._id, item._id)}
                                        className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-500"
                                        title="Delete subsection"
                                        disabled={actionLoading}
                                      >
                                        <Trash2 size={12} />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))
                        }

                        {/* Also display subsections from section data if available */}
                        {item.subSection && item.subSection.length > 0 && (
                          <div className="flex flex-col">
                            {item.subSection.map((subItemSection, subIndex) => (
                              <div key={`section-sub-${subIndex}`} className="border-b p-2 flex items-center justify-between w-full mb-2">
                                <div className="flex items-center gap-3">
                                  <Pen size={16} />
                                  <span>{subItemSection.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditSubsection(subItemSection, item._id)}
                                    className="h-7 w-7 p-0 hover:bg-blue-100"
                                    title="Edit subsection"
                                  >
                                    <Edit3 size={12} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteSubsection(subItemSection._id, item._id)}
                                    className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-500"
                                    title="Delete subsection"
                                    disabled={actionLoading}
                                  >
                                    <Trash2 size={12} />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Show message if no subsections */}
                        {(!subSection || subSection.filter(sub => sub._id === item._id).length === 0) &&
                          (!item.subSection || item.subSection.length === 0) && (
                            <div className="text-gray-500 text-sm py-2">
                              No subsections added yet
                            </div>
                          )}

                        <div className="w-full mt-4 justify-end flex">
                          <Button
                            onClick={() => handleAddSubsection(item._id)}
                            variant="outline"
                          >
                            Add Subsection <PlusSquare />
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No sections found</p>
                  <p className="text-sm">Click "Add Section" to create your first section</p>
                </div>
              )}

              {/* Add Section Button */}
              <div className="py-5 items-end">
                <div className="ml-auto w-fit">
                  <Button onClick={() => setPopup(true)}>
                    Add Section <Plus />
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Next Step Button */}
      {sections && sections.length > 0 && (
        <div className="mt-6">
          <Button
            onClick={() => dispatch(nextStep())}
            className="w-full"
          >
            Next <ArrowRight />
          </Button>
        </div>
      )}

      {/* Error Display */}
      {error.sections && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          Error: {error.sections}
        </div>
      )}
    </div>
  );
}

export default EditCourseSections;