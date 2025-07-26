import React, { useState } from 'react';
import { useCategory } from '@/context/CategoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, FolderIcon, FolderOpenIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Categories = () => {
  const { state, addCategory, updateCategory, deleteCategory, getParentCategories, getSubcategories } = useCategory();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'flat' | 'hierarchy'>('flat');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    parentCategoryId: 'none',
  });

  const filteredCategories = state.categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    const categoryData = {
      ...formData,
      parentCategoryId: formData.parentCategoryId === "none" ? undefined : formData.parentCategoryId || undefined,
    };

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        ...categoryData,
      });
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } else {
      addCategory(categoryData);
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      parentCategoryId: 'none',
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      parentCategoryId: category.parentCategoryId || 'none',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const subcategories = getSubcategories(id);
    if (subcategories.length > 0) {
      toast({
        title: "Error",
        description: "Cannot delete category with subcategories",
        variant: "destructive",
      });
      return;
    }
    
    deleteCategory(id);
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
  };

  const renderHierarchicalView = () => {
    const renderCategory = (category: any, level = 0) => {
      const subcategories = getSubcategories(category.id);
      return (
        <React.Fragment key={category.id}>
          <TableRow>
            <TableCell>
              <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
                {subcategories.length > 0 ? (
                  <FolderOpenIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                ) : (
                  <FolderIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                )}
                {category.name}
              </div>
            </TableCell>
            <TableCell>{category.description || '-'}</TableCell>
            <TableCell>
              {level > 0 && (
                <Badge variant="secondary">
                  Level {level + 1}
                </Badge>
              )}
            </TableCell>
            <TableCell>{category.createdAt.toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(category)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(category.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          {subcategories.map(subcategory => renderCategory(subcategory, level + 1))}
        </React.Fragment>
      );
    };

    return getParentCategories().map(category => renderCategory(category));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'flat' ? 'default' : 'outline'}
            onClick={() => setViewMode('flat')}
          >
            Flat View
          </Button>
          <Button
            variant={viewMode === 'hierarchy' ? 'default' : 'outline'}
            onClick={() => setViewMode('hierarchy')}
          >
            Hierarchy View
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="parentCategory">Parent Category</Label>
                  <Select
                    value={formData.parentCategoryId}
                    onValueChange={(value) => setFormData({ ...formData, parentCategoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Parent (Root Category)</SelectItem>
                      {getParentCategories()
                        .filter(cat => cat.id !== editingCategory?.id)
                        .map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingCategory ? 'Update' : 'Add'} Category
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {viewMode === 'hierarchy' 
                ? renderHierarchicalView()
                : filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description || '-'}</TableCell>
                      <TableCell>
                        {category.parentCategoryId ? (
                          <Badge variant="secondary">Subcategory</Badge>
                        ) : (
                          <Badge variant="default">Root Category</Badge>
                        )}
                      </TableCell>
                      <TableCell>{category.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(category)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(category.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;