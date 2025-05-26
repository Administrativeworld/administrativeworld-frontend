import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Badge } from "../ui/badge";
import { Loader2, Plus, Trash2, Edit, Slash } from "lucide-react";
import { getCategory, clearCategoryState } from "../../redux/api/getCategorySlice";
import toast from "react-hot-toast";
import axios from "axios";

function Categories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux state
  const { loading, categories, error } = useSelector((state) => state.getCategory);

  // Local state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  // Edit category state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryDescription, setEditCategoryDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  // Breadcrumb logic
  const basePath = "/admin/";
  const pathSegments = location.pathname.replace(basePath, "").split("/").filter(Boolean);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);


  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsCreating(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/courses/createCategory`,
        {
          name: newCategoryName.trim(),
          description: newCategoryDescription.trim()
        },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Category created successfully!");
        setNewCategoryName("");
        setNewCategoryDescription("");
        setIsCreateDialogOpen(false);
        // Refresh categories list
        dispatch(getCategory());
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    } finally {
      setIsCreating(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    setDeletingId(categoryId);
    console.log(categoryId)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/courses/deleteCategory`, { categoryId: categoryId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Category deleted successfully!");
        // Refresh categories list
        dispatch(getCategory());
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };
  // Open edit dialog with category data
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name || "");
    setEditCategoryDescription(category.description || "");
    setIsEditDialogOpen(true);
  };

  // Update category
  const handleUpdateCategory = async () => {
    if (!editCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/courses/updateCategory`,
        {
          categoryId: editingCategory._id || editingCategory.id,
          newName: editCategoryName.trim(),
          description: editCategoryDescription.trim()
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Category updated successfully!");
        setEditCategoryName("");
        setEditCategoryDescription("");
        setEditingCategory(null);
        setIsEditDialogOpen(false);
        // Refresh categories list
        dispatch(getCategory());
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update category");
    } finally {
      setIsUpdating(false);
    }
  };

  // Close edit dialog and reset state
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingCategory(null);
    setEditCategoryName("");
    setEditCategoryDescription("");
  };
  return (
    <div>
      {/* Breadcrumb */}
      <div className="p-2 mb-3">
        <Breadcrumb>
          <BreadcrumbList className="flex items-center space-x-1">
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate(basePath)} className="cursor-pointer text-blue-500 hover:underline">
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathSegments.map((segment, index) => {
              const pathTo = `${basePath}${pathSegments.slice(0, index + 1).join("/")}`;
              const isLast = index === pathSegments.length - 1;

              return (
                <div key={pathTo} className="flex items-center space-x-1">
                  <Slash size={10} />
                  <BreadcrumbItem>
                    {!isLast ? (
                      <BreadcrumbLink onClick={() => navigate(pathTo)} className="cursor-pointer text-blue-500 hover:underline">
                        {segment.charAt(0).toUpperCase() + segment.slice(1)}
                      </BreadcrumbLink>
                    ) : (
                      <span className="text-gray-500">{segment.charAt(0).toUpperCase() + segment.slice(1)}</span>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className=" mt-1">Manage course categories</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Create Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new category for organizing courses.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="categoryName" className="text-sm font-medium">
                    Category Name *
                  </label>
                  <Input
                    id="categoryName"
                    placeholder="Enter category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="categoryDescription" className="text-sm font-medium">
                    Description
                  </label>
                  <Input
                    id="categoryDescription"
                    placeholder="Enter category description (optional)"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory} disabled={isCreating}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Edit Category Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>
                  Update the category information.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="editCategoryName" className="text-sm font-medium">
                    Category Name *
                  </label>
                  <Input
                    id="editCategoryName"
                    placeholder="Enter category name"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="editCategoryDescription" className="text-sm font-medium">
                    Description
                  </label>
                  <Input
                    id="editCategoryDescription"
                    placeholder="Enter category description (optional)"
                    value={editCategoryDescription}
                    onChange={(e) => setEditCategoryDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleCloseEditDialog}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateCategory()} disabled={isUpdating}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium  mb-2">No categories found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first category.</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Create Category
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories?.map((category) => (
              <Card key={category._id || category.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      {category.description && (
                        <CardDescription className="mt-1">
                          {category.description}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {category.courseCount || 0} courses
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Created: {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                        <Edit size={14} className="mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={deletingId === (category._id || category.id)}
                          >
                            {deletingId === (category._id || category.id) ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} className="mr-1" />
                            )}
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"? This action cannot be undone.
                              {category.courseCount > 0 && (
                                <span className="block mt-2 text-amber-600 font-medium">
                                  Warning: This category has {category.courseCount} associated courses.
                                </span>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCategory(category._id || category.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Outlet />
    </div>
  );
}

export default Categories;