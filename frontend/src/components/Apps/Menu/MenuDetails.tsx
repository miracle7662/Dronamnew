import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
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
  TextField,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MenuItem, getAllMenuItems, updateMenuItem } from '@/services/menuService';

const MenuDetails: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog states
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const [variantForm, setVariantForm] = useState({
    variant_type: '',
    rate: 0
  });

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

  // Variant operations
  const handleAddVariant = () => {
    if (!selectedMenuItem) return;
    
    const updatedVariants = [...(selectedMenuItem.variants || []), variantForm];
    const updatedMenuItem = {
      ...selectedMenuItem,
      variants: updatedVariants
    };
    
    setSelectedMenuItem(updatedMenuItem);
    setVariantForm({ variant_type: '', rate: 0 });
    setVariantDialogOpen(false);
  };

  const handleRemoveVariant = (index: number) => {
    if (!selectedMenuItem) return;
    
    const updatedVariants = selectedMenuItem.variants.filter((_, i) => i !== index);
    const updatedMenuItem = {
      ...selectedMenuItem,
      variants: updatedVariants
    };
    
    setSelectedMenuItem(updatedMenuItem);
  };

  const handleSaveChanges = async () => {
    if (!selectedMenuItem?.menu_id) return;
    
    try {
      await updateMenuItem(selectedMenuItem.menu_id, selectedMenuItem);
      setSuccess('Menu details updated successfully!');
      fetchMenuItems();
    } catch (err) {
      setError('Failed to update menu details');
      console.error('Error updating menu details:', err);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/apps/Menu');
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
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to Menu
          </Button>
          <Typography variant="h4">Menu Details Management</Typography>
        </Box>
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

      {/* Main content */}
      <Box display="flex" gap={3} flexWrap="wrap">
        {/* Menu Items List */}
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
                              setSelectedMenuItem(item);
                            }}
                          >
                            <EditIcon />
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

        {/* Variants Section */}
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
                        onClick={handleSaveChanges}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Select a menu item to manage variants
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

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
    </Box>
  );
};

export default MenuDetails;
