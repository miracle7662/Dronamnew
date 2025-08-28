import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MenuItem, getAllMenuItems, updateMenuItem } from '@/services/menuService';

const AddonDetails: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog states
  const [addonDialogOpen, setAddonDialogOpen] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);

  // Sample addon data (replace with actual addon data from API)
  const availableAddons = [
    { id: 1, name: 'Extra Cheese' },
    { id: 2, name: 'Spicy Sauce' },
    { id: 3, name: 'Extra Toppings' },
    { id: 4, name: 'Garlic Bread' },
    { id: 5, name: 'Side Salad' }
  ];

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

  // Handle menu item selection
  const handleMenuItemSelect = (item: MenuItem) => {
    setSelectedMenuItem(item);
    // Initialize selected addons from the menu item's current addons
    const currentAddonIds = item.addons?.map(addon => addon.addon_id) || [];
    setSelectedAddons(currentAddonIds);
  };

  // Addon selection handling
  const handleAddonSelection = (addonId: number) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  // Save addon changes
  const handleSaveAddons = async () => {
    if (!selectedMenuItem?.menu_id) return;
    
    try {
      const updatedAddons = selectedAddons.map(addon_id => ({ addon_id }));
      const updatedMenuItem = {
        ...selectedMenuItem,
        addons: updatedAddons
      };
      
      await updateMenuItem(selectedMenuItem.menu_id, updatedMenuItem);
      setSuccess('Addons updated successfully!');
      setAddonDialogOpen(false);
      fetchMenuItems();
    } catch (err) {
      setError('Failed to update addons');
      console.error('Error updating addons:', err);
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
          <Typography variant="h4">Addon Management</Typography>
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
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {menuItems.map((item) => (
                  <Card 
                    key={item.menu_id}
                    sx={{ 
                      mb: 1, 
                      cursor: 'pointer',
                      backgroundColor: selectedMenuItem?.menu_id === item.menu_id ? 'action.selected' : 'background.paper'
                    }}
                    onClick={() => handleMenuItemSelect(item)}
                  >
                    <CardContent sx={{ py: 1 }}>
                      <Typography variant="subtitle2">{item.menu_name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.food_type}
                      </Typography>
                      {item.addons && item.addons.length > 0 && (
                        <Typography variant="caption" color="primary">
                          {item.addons.length} addon(s) configured
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Addons Section */}
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
                      {selectedMenuItem.addons.map((addon, index) => {
                        const addonInfo = availableAddons.find(a => a.id === addon.addon_id);
                        return (
                          <Chip
                            key={index}
                            label={addonInfo?.name || `Addon #${addon.addon_id}`}
                            sx={{ m: 0.5 }}
                            onDelete={() => {
                              setSelectedAddons(prev => prev.filter(id => id !== addon.addon_id));
                            }}
                          />
                        );
                      })}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No addons selected
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Select a menu item to manage addons
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Addon Dialog */}
      <Dialog open={addonDialogOpen} onClose={() => setAddonDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Addons</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select the addons you want to associate with "{selectedMenuItem?.menu_name}"
          </Typography>
          <Box>
            {availableAddons.map((addon) => (
              <Chip
                key={addon.id}
                label={addon.name}
                variant={selectedAddons.includes(addon.id) ? 'filled' : 'outlined'}
                onClick={() => handleAddonSelection(addon.id)}
                sx={{ m: 0.5 }}
              />
            ))}
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
    </Box>
  );
};

export default AddonDetails;
