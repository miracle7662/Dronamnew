import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MenuItem, createMenuItem } from '@/services/menuService';

const MenuAdd: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [menuForm, setMenuForm] = useState<Partial<MenuItem>>({
    menu_name: '',
    description: '',
    food_type: '',
    categories_id: 0,
    preparation_time: 0,
    status: 'active',
    variants: [],
    addons: []
  });

  // Handle form input changes
  const handleInputChange = (field: keyof MenuItem, value: any) => {
    setMenuForm((prev: Partial<MenuItem>) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await createMenuItem(menuForm as MenuItem);
      setSuccess('Menu item created successfully!');
      
      // Reset form
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
      
    } catch (err) {
      setError('Failed to create menu item. Please try again.');
      console.error('Error creating menu item:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/apps/Menu');
  };

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
          <Typography variant="h4">Add New Menu Item</Typography>
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

      {/* Form */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={3}>
              {/* Menu Name */}
              <TextField
                fullWidth
                label="Menu Name"
                value={menuForm.menu_name}
                onChange={(e) => handleInputChange('menu_name', e.target.value)}
                required
                disabled={loading}
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={menuForm.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={loading}
              />

              {/* Food Type */}
              <TextField
                fullWidth
                label="Food Type"
                value={menuForm.food_type}
                onChange={(e) => handleInputChange('food_type', e.target.value)}
                required
                disabled={loading}
              />

              {/* Category ID */}
              <TextField
                fullWidth
                label="Category ID"
                type="number"
                value={menuForm.categories_id}
                onChange={(e) => handleInputChange('categories_id', parseInt(e.target.value))}
                required
                disabled={loading}
              />

              {/* Preparation Time */}
              <TextField
                fullWidth
                label="Preparation Time (minutes)"
                type="number"
                value={menuForm.preparation_time}
                onChange={(e) => handleInputChange('preparation_time', parseInt(e.target.value))}
                required
                disabled={loading}
              />

              {/* Status */}
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={menuForm.status}
                  label="Status"
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <MuiMenuItem value="active">Active</MuiMenuItem>
                  <MuiMenuItem value="inactive">Inactive</MuiMenuItem>
                </Select>
              </FormControl>

              {/* Submit Button */}
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Menu Item'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MenuAdd;
