import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { MenuItem as MenuItemType, getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '@/services/menuService';

const Menu: React.FC = () => {
  // State management
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog states
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const [addonDialogOpen, setAddonDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form states
  const [menuForm, setMenuForm] = useState<Partial<MenuItemType>>({
    menu_name: '',
    description: '',
    food_type: '',
    categories_id: 0,
    preparation_time: 0,
    status: 'active',
    variants: [],
    addons: []
  });

  const [variantForm, setVariantForm] = useState({
    variant_type: '',
    rate: 0
  });

  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);

  // Fetch all menu items
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const data = await getAllMenuItems();
      setMenuItems(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch menu items');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Menu item operations
  const handleCreateMenuItem = async () => {
    try {
      const response = await createMenuItem(menuForm as MenuItemType);
      setSuccess('Menu item created successfully');
      setMenuDialogOpen(false);
      setMenuForm({
        menu_name: '',
        description: '',
        food_type: '',
        categories_id: 0,
        preparation_time: 0,
        status: 'active',
        variants: [],
        addons: []
      });
      fetchMenuItems();
    } catch (err) {
      setError('Failed to create menu item');
    }
  };

  const handleUpdateMenuItem = async () => {
    if (!selectedMenuItem?.menu_id) return;
    
    try {
      await updateMenuItem(selectedMenuItem.menu_id, menuForm as MenuItemType);
      setSuccess('Menu item updated successfully');
      setMenuDialogOpen(false);
      fetchMenuItems();
    } catch (err) {
      setError('Failed to update menu item');
    }
  };

  const handleDeleteMenuItem = async () => {
    if (!selectedMenuItem?.menu_id) return;
    
    try {
      await deleteMenuItem(selectedMenuItem.menu_id);
      setSuccess('Menu item deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedMenuItem(null);
      fetchMenuItems();
    } catch (err) {
      setError('Failed to delete menu item');
    }
  };

  // Variant operations
  const handleAddVariant = () => {
    if (!selectedMenuItem) return;
    
    const updatedVariants = [...(selectedMenuItem.variants || []), variantForm];
    setSelectedMenuItem({
      ...selectedMenuItem,
      variants: updatedVariants
    });
    setVariantForm({ variant_type: '', rate: 0 });
    setVariantDialogOpen(false);
  };

  const handleRemoveVariant = (index: number) => {
    if (!selectedMenuItem) return;
    
    const updatedVariants = selectedMenuItem.variants.filter((_, i) => i !== index);
    setSelectedMenuItem({
      ...selectedMenuItem,
      variants: updatedVariants
    });
  };

  // Addon operations
  const handleAddonSelection = (addonId: number) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleSaveAddons = () => {
    if (!selectedMenuItem) return;
    
    const updatedAddons = selectedAddons.map(addon_id => ({ addon_id }));
    setSelectedMenuItem({
      ...selectedMenuItem,
      addons: updatedAddons
    });
    setAddonDialogOpen(false);
  };

  // Dialog handlers
  const openMenuDialog = (item?: MenuItemType) => {
    if (item) {
      setMenuForm(item);
      setSelectedMenuItem(item);
    } else {
      setMenuForm({
        menu_name: '',
        description: '',
        food_type: '',
        categories_id: 0,
        preparation_time: 0,
        status: 'active',
        variants: [],
        addons: []
      });
      setSelectedMenuItem(null);
    }
    setMenuDialogOpen(true);
  };

  const openDeleteDialog = (item: MenuItemType) => {
    setSelectedMenuItem(item);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Menu Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openMenuDialog()}
        >
          Add Menu Item
        </Button>
      </Box>

      {/* Notifications */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>

      {/* Main content with flex layout instead of Grid */}
      <Box display="flex" gap={3} flexWrap="wrap">
        {/* Menumaster Section */}
        <Box flex="1" minWidth="300px">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Menu Items
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {menuItems.map((item) => (
                      <TableRow
                        key={item.menu_id}
                        selected={selectedMenuItem?.menu_id === item.menu_id}
                        onClick={() => setSelectedMenuItem(item)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{item.menu_name}</TableCell>
                        <TableCell>{item.food_type}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openMenuDialog(item);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteDialog(item);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Menudetails Section */}
        <Box flex="1" minWidth="300px">
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Variants {selectedMenuItem && `- ${selectedMenuItem.menu_name}`}
                </Typography>
                {selectedMenuItem && (
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setVariantDialogOpen(true)}
                  >
                    Add Variant
                  </Button>
                )}
              </Box>
              
              {selectedMenuItem ? (
                <Box>
                  {selectedMenuItem.variants?.length > 0 ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Variant Type</TableCell>
                            <TableCell>Rate</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedMenuItem.variants.map((variant, index) => (
                            <TableRow key={index}>
                              <TableCell>{variant.variant_type}</TableCell>
                              <TableCell>₹{variant.rate}</TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveVariant(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No variants added yet
                    </Typography>
                  )}
                  
                  {selectedMenuItem.variants?.length > 0 && (
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={() => openMenuDialog(selectedMenuItem)}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Select a menu item to view variants
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Menuaddon Section */}
        <Box flex="1" minWidth="300px">
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Addons {selectedMenuItem && `- ${selectedMenuItem.menu_name}`}
                </Typography>
                {selectedMenuItem && (
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setAddonDialogOpen(true)}
                  >
                    Manage Addons
                  </Button>
                )}
              </Box>
              
              {selectedMenuItem ? (
                <Box>
                  {selectedMenuItem.addons?.length > 0 ? (
                    <Box>
                      {selectedMenuItem.addons.map((addon, index) => (
                        <Chip
                          key={index}
                          label={`Addon #${addon.addon_id}`}
                          sx={{ m: 0.5 }}
                          onDelete={() => {
                            setSelectedAddons(prev => prev.filter(id => id !== addon.addon_id));
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No addons selected
                    </Typography>
                  )}
                  
                  {selectedMenuItem.addons?.length > 0 && (
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={() => openMenuDialog(selectedMenuItem)}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Select a menu item to view addons
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Menu Item Dialog */}
      <Dialog open={menuDialogOpen} onClose={() => setMenuDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedMenuItem ? 'Edit Menu Item' : 'Create Menu Item'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexWrap="wrap" gap={2} sx={{ mt: 1 }}>
            <Box width="100%">
              <TextField
                fullWidth
                label="Menu Name"
                value={menuForm.menu_name}
                onChange={(e) => setMenuForm({ ...menuForm, menu_name: e.target.value })}
              />
            </Box>
            <Box width="100%">
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={menuForm.description}
                onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
              />
            </Box>
            <Box width="48%">
              <TextField
                fullWidth
                label="Food Type"
                value={menuForm.food_type}
                onChange={(e) => setMenuForm({ ...menuForm, food_type: e.target.value })}
              />
            </Box>
            <Box width="48%">
              <TextField
                fullWidth
                label="Category ID"
                type="number"
                value={menuForm.categories_id}
                onChange={(e) => setMenuForm({ ...menuForm, categories_id: parseInt(e.target.value) })}
              />
            </Box>
            <Box width="48%">
              <TextField
                fullWidth
                label="Preparation Time (minutes)"
                type="number"
                value={menuForm.preparation_time}
                onChange={(e) => setMenuForm({ ...menuForm, preparation_time: parseInt(e.target.value) })}
              />
            </Box>
            <Box width="48%">
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={menuForm.status}
                  label="Status"
                  onChange={(e) => setMenuForm({ ...menuForm, status: e.target.value })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMenuDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={selectedMenuItem ? handleUpdateMenuItem : handleCreateMenuItem}
            variant="contained"
          >
            {selectedMenuItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Variant Dialog */}
      <Dialog open={variantDialogOpen} onClose={() => setVariantDialogOpen(false)}>
        <DialogTitle>Add Variant</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Variant Type"
              value={variantForm.variant_type}
              onChange={(e) => setVariantForm({ ...variantForm, variant_type: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Rate"
              type="number"
              value={variantForm.rate}
              onChange={(e) => setVariantForm({ ...variantForm, rate: parseFloat(e.target.value) })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVariantDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddVariant} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Addon Dialog */}
      <Dialog open={addonDialogOpen} onClose={() => setAddonDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Addons</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select the addons you want to associate with this menu item
          </Typography>
          <Box>
            <Chip
              label="Extra Cheese"
              variant={selectedAddons.includes(1) ? 'filled' : 'outlined'}
              onClick={() => handleAddonSelection(1)}
              sx={{ m: 0.5 }}
            />
            <Chip
              label="Spicy Sauce"
              variant={selectedAddons.includes(2) ? 'filled' : 'outlined'}
              onClick={() => handleAddonSelection(2)}
              sx={{ m: 0.5 }}
            />
            <Chip
              label="Extra Toppings"
              variant={selectedAddons.includes(3) ? 'filled' : 'outlined'}
              onClick={() => handleAddonSelection(3)}
              sx={{ m: 0.5 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddonDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveAddons} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedMenuItem?.menu_name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteMenuItem} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Menu;
