import React, { useState, useEffect } from 'react';
import makeData, { type Person } from './makeData';
import { 
  getAllMenuItems, 
  getMenuItemById, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  type MenuItem 
} from '../../../services/menuService';

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllMenuItems();
      setMenuItems(data);
    } catch (err) {
      setError('Failed to fetch menu items');
      console.error('Error fetching menu items:', err);
      const mockData = makeData(10);
      setMenuItems(mockData.map(item => ({
        menu_id: parseInt(item.userId),
        menu_name: item.ItemName,
        description: `Description for ${item.ItemName}`,
        food_type: 'Veg',
        categories_id: 1,
        preparation_time: 15,
        status: item.status,
        variants: [{ variant_type: 'Regular', rate: item.price }],
        addons: []
      })));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (itemData: MenuItem) => {
    try {
      setError(null);
      const result = await createMenuItem(itemData);
      setMenuItems(prev => [...prev, { ...itemData, menu_id: result.menu_id }]);
      setShowForm(false);
      setIsCreating(false);
    } catch (err) {
      setError('Failed to create menu item');
      console.error('Error creating menu item:', err);
    }
  };

  const handleUpdateItem = async (id: number, itemData: MenuItem) => {
    try {
      setError(null);
      await updateMenuItem(id, itemData);
      setMenuItems(prev => prev.map(item => 
        item.menu_id === id ? { ...itemData, menu_id: id } : item
      ));
      setEditingItem(null);
      setShowForm(false);
    } catch (err) {
      setError('Failed to update menu item');
      console.error('Error updating menu item:', err);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      setError(null);
      await deleteMenuItem(id);
      setMenuItems(prev => prev.filter(item => item.menu_id !== id));
    } catch (err) {
      setError('Failed to delete menu item');
      console.error('Error deleting menu item:', err);
    }
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setIsCreating(false);
    setShowForm(true);
  };

  const handleCreateClick = () => {
    setEditingItem(null);
    setIsCreating(true);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsCreating(false);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading menu items...</div>;
  }

  return (
    <div className="menu-container">
      <h1>Menu Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="menu-actions">
        <button 
          className="btn btn-primary" 
          onClick={handleCreateClick}
        >
          Add New Menu Item
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={fetchMenuItems}
        >
          Refresh
        </button>
      </div>

      {showForm && (
        <MenuForm
          item={editingItem}
          isCreating={isCreating}
          onSubmit={isCreating ? handleCreateItem : (data) => handleUpdateItem(editingItem!.menu_id!, data)}
          onCancel={handleCancel}
        />
      )}

      <div className="menu-list">
        <h2>Menu Items</h2>
        {menuItems.length === 0 ? (
          <p>No menu items found.</p>
        ) : (
          <table className="menu-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map(item => (
                <tr key={item.menu_id}>
                  <td>{item.menu_id}</td>
                  <td>{item.menu_name}</td>
                  <td>{item.description}</td>
                  <td>{item.food_type}</td>
                  <td>${item.variants[0]?.rate || 0}</td>
                  <td>{item.status}</td>
                  <td>
                    <button 
                      className="btn btn-edit"
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-delete"
                      onClick={() => handleDeleteItem(item.menu_id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

interface MenuFormProps {
  item: MenuItem | null;
  isCreating: boolean;
  onSubmit: (data: MenuItem) => void;
  onCancel: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({ item, isCreating, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<MenuItem>(item || {
    menu_name: '',
    description: '',
    food_type: 'Veg',
    categories_id: 1,
    preparation_time: 15,
    status: 'Active',
    variants: [{ variant_type: 'Regular', rate: 0 }],
    addons: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: MenuItem) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVariantChange = (index: number, field: string, value: string | number) => {
    setFormData((prev: MenuItem) => ({
      ...prev,
      variants: prev.variants.map((variant: any, i: number) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  return (
    <div className="menu-form">
      <h3>{isCreating ? 'Create New Menu Item' : 'Edit Menu Item'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Menu Name:</label>
          <input
            type="text"
            name="menu_name"
            value={formData.menu_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Food Type:</label>
          <select
            name="food_type"
            value={formData.food_type}
            onChange={handleChange}
          >
            <option value="Veg">Vegetarian</option>
            <option value="Non-Veg">Non-Vegetarian</option>
          </select>
        </div>

        <div className="form-group">
          <label>Preparation Time (minutes):</label>
          <input
            type="number"
            name="preparation_time"
            value={formData.preparation_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <h4>Variants</h4>
        {formData.variants.map((variant: any, index: number) => (
          <div key={index} className="variant-group">
            <div className="form-group">
              <label>Variant Type:</label>
              <input
                type="text"
                value={variant.variant_type}
                onChange={(e) => handleVariantChange(index, 'variant_type', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Rate:</label>
              <input
                type="number"
                step="0.01"
                value={variant.rate}
                onChange={(e) => handleVariantChange(index, 'rate', parseFloat(e.target.value))}
                required
              />
            </div>
          </div>
        ))}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isCreating ? 'Create' : 'Update'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Menu;
