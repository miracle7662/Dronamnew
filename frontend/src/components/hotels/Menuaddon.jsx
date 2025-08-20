import React, { useState, useEffect } from 'react';
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
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const Menuaddon = () => {
  const [menuAddons, setMenuAddons] = useState([]);
  const [menus, setMenus] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [menuAddonsRes, menusRes, addonsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/menuaddons`),
        axios.get(`${API_BASE_URL}/api/menumaster`),
        axios.get(`${API_BASE_URL}/api/addons`)
      ]);
      
      setMenuAddons(menuAddonsRes.data);
      setMenus(menusRes.data);
      setAddons(addonsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (menuAddon = null) => {
    if (menuAddon) {
      setEditingId(menuAddon.menuaddon_id);
      setSelectedMenu(menuAddon.menu_id);
      // For editing, we need to fetch current addons for this menu
      fetchAddonsForMenu(menuAddon.menu_id);
    } else {
      setEditingId(null);
      setSelectedMenu('');
      setSelectedAddons([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMenu('');
    setSelectedAddons([]);
    setEditingId(null);
  };

  const fetchAddonsForMenu = async (menuId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/menuaddons/menu/${menuId}`);
      const addonIds = response.data.map(item => item.addon_id);
      setSelectedAddons(addonIds);
    } catch (err) {
      console.error('Error fetching addons for menu:', err);
    }
  };

  const handleMenuChange = (event) => {
    const menuId = event.target.value;
    setSelectedMenu(menuId);
    if (menuId) {
      fetchAddonsForMenu(menuId);
    } else {
      setSelectedAddons([]);
    }
  };

  const handleAddonToggle = (addonId) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedMenu || selectedAddons.length === 0) {
      setError('Please select a menu and at least one addon');
      return;
    }

    try {
      const payload = {
        menu_id: parseInt(selectedMenu),
        addon_ids: selectedAddons
      };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/menuaddons/${editingId}`, payload);
      } else {
        await axios.post(`${API_BASE_URL}/api/menuaddons`, payload);
      }

      await fetchData();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save menu addon');
      console.error('Error saving menu addon:', err);
    }
  };

  const handleDelete = async (menuaddonId) => {
    if (window.confirm('Are you sure you want to delete this menu addon?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/menuaddons/${menuaddonId}`);
        await fetchData();
      } catch (err) {
        setError('Failed to delete menu addon');
        console.error('Error deleting menu addon:', err);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Group menu addons by menu for better display
  const groupedMenuAddons = menuAddons.reduce((acc, item) => {
    const menuId = item.menu_id;
    if (!acc[menuId]) {
      acc[menuId] = {
        menu_id: menuId,
        menu_name: item.menu_name,
        addons: []
      };
    }
    acc[menuId].addons.push({
      addon_id: item.addon_id,
      addon_name: item.addon_name,
      addon_price: item.addon_price,
      menuaddon_id: item.menuaddon_id
    });
    return acc;
  }, {});

  const groupedData = Object.values(groupedMenuAddons);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Menu Addons Management
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Manage Menu Addons</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Menu Addon
        </Button>
      </Box>

      <Grid container spacing={3}>
        {groupedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((group) => (
          <Grid item xs={12} md={6} lg={4} key={group.menu_id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {group.menu_name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Menu ID: {group.menu_id}
                </Typography>
                
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Addons:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {group.addons.map((addon) => (
                      <Chip
                        key={addon.addon_id}
                        label={`${addon.addon_name} - ₹${addon.addon_price}`}
                        variant="outlined"
                        size="small"
                        onDelete={() => handleDelete(addon.menuaddon_id)}
                      />
                    ))}
                  </Box>
                </Box>

                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog({ menu_id: group.menu_id })}
                  >
                    Edit Addons
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={groupedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog for adding/editing menu addons */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Menu Addons' : 'Add Menu Addons'}
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Menu</InputLabel>
              <Select
                value={selectedMenu}
                onChange={handleMenuChange}
                label="Select Menu"
              >
                <MenuItem value="">
                  <em>Select a menu</em>
                </MenuItem>
                {menus.map((menu) => (
                  <MenuItem key={menu.menu_id} value={menu.menu_id}>
                    {menu.menu_name} - ₹{menu.menu_price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedMenu && (
              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  Select Addons:
                </Typography>
                <FormGroup>
                  <Grid container spacing={2}>
                    {addons.map((addon) => (
                      <Grid item xs={12} sm={6} md={4} key={addon.addon_id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedAddons.includes(addon.addon_id)}
                              onChange={() => handleAddonToggle(addon.addon_id)}
                            />
                          }
                          label={`${addon.addon_name} - ₹${addon.addon_price}`}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!selectedMenu || selectedAddons.length === 0}
          >
            {editingId ? 'Update' : 'Add'} Menu Addons
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Menuaddon;
