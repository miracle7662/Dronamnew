import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 

interface MenuItem {
  menu_id?: number;
  Modal, 
  Form, 
  Input, 
  Select, 
  Row, 
  Col, 
  Card, 
  message, 
  Space, 
  Popconfirm,
  Tag,
  Divider
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { MenuItem, getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../../../services/menuService';
import { AddonItem, getAllAddons } from '../../../services/addonsService';

const { Option } = Select;

const MenuMaster: React.FC = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [addons, setAddons] = useState<AddonItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [form] = Form.useForm();

  // Form lists for dynamic fields
  const [variantFields, setVariantFields] = useState([{ key: Date.now(), variant_type: '', rate: '' }]);
  const [addonFields, setAddonFields] = useState([{ key: Date.now(), addon_id: undefined, rate: '' }]);

  // Fetch menus and addons
  const fetchMenus = async () => {
    setLoading(true);
    try {
      const menuData = await getAllMenuItems();
      setMenus(menuData);
    } catch (error) {
      message.error('Failed to fetch menus');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddons = async () => {
    try {
      const addonData = await getAllAddons();
      setAddons(addonData);
    } catch (error) {
      message.error('Failed to fetch addons');
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchAddons();
  }, []);

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      // Prepare menu data
      const menuData: MenuItem = {
        menu_name: values.menu_name,
        description: values.description,
        food_type: values.food_type,
        categories_id: values.categories_id,
        preparation_time: values.preparation_time,
        status: values.status,
        created_by_id: 1, // This should come from auth context
        variants: variantFields.filter(field => field.variant_type && field.rate).map(field => ({
          variant_type: field.variant_type,
          rate: parseFloat(field.rate)
        })),
        addons: addonFields.filter(field => field.addon_id).map(field => ({
          addon_id: field.addon_id
        }))
      };

      if (editingMenu) {
        // Update existing menu
        await updateMenuItem(editingMenu.menu_id!, menuData);
        message.success('Menu updated successfully');
      } else {
        // Create new menu
        await createMenuItem(menuData);
        message.success('Menu created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      setVariantFields([{ key: Date.now(), variant_type: '', rate: '' }]);
      setAddonFields([{ key: Date.now(), addon_id: undefined, rate: '' }]);
      setEditingMenu(null);
      fetchMenus();
    } catch (error) {
      message.error(editingMenu ? 'Failed to update menu' : 'Failed to create menu');
    }
  };

  // Handle edit menu
  const handleEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    form.setFieldsValue({
      menu_name: menu.menu_name,
      description: menu.description,
      food_type: menu.food_type,
      categories_id: menu.categories_id,
      preparation_time: menu.preparation_time,
      status: menu.status
    });

    // Set variant fields
    if (menu.variants && menu.variants.length > 0) {
      const variantData = menu.variants.map((variant, index) => ({
        key: index,
        variant_type: variant.variant_type,
        rate: variant.rate?.toString() || ''
      }));
      setVariantFields(variantData);
    } else {
      setVariantFields([{ key: Date.now(), variant_type: '', rate: '' }]);
    }

    // Set addon fields
    if (menu.addons && menu.addons.length > 0) {
      const addonData = menu.addons.map((addon, index) => ({
        key: index,
        addon_id: addon.addon_id,
        rate: ''
      }));
      setAddonFields(addonData);
    } else {
      setAddonFields([{ key: Date.now(), addon_id: undefined, rate: '' }]);
    }

    setModalVisible(true);
  };

  // Handle delete menu
  const handleDelete = async (menuId: number) => {
    try {
      await deleteMenuItem(menuId);
      message.success('Menu deleted successfully');
      fetchMenus();
    } catch (error) {
      message.error('Failed to delete menu');
    }
  };

  // Handle variant fields
  const addVariantField = () => {
    setVariantFields([...variantFields, { key: Date.now(), variant_type: '', rate: '' }]);
  };

  const removeVariantField = (key: number) => {
    setVariantFields(variantFields.filter(field => field.key !== key));
  };

  const handleVariantChange = (key: number, field: string, value: string) => {
    setVariantFields(variantFields.map(item => 
      item.key === key ? { ...item, [field]: value } : item
    ));
  };

  // Handle addon fields
  const addAddonField = () => {
    setAddonFields([...addonFields, { key: Date.now(), addon_id: undefined, rate: '' }]);
  };

  const removeAddonField = (key: number) => {
    setAddonFields(addonFields.filter(field => field.key !== key));
  };

  const handleAddonChange = (key: number, field: string, value: any) => {
    setAddonFields(addonFields.map(item => 
      item.key === key ? { ...item, [field]: value } : item
    ));
  };

  // Reset form
  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setEditingMenu(null);
    setVariantFields([{ key: Date.now(), variant_type: '', rate: '' }]);
    setAddonFields([{ key: Date.now(), addon_id: undefined, rate: '' }]);
  };

  // Columns for menu table
  const columns = [
    {
      title: 'Menu Name',
      dataIndex: 'menu_name',
      key: 'menu_name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Food Type',
      dataIndex: 'food_type',
      key: 'food_type',
      render: (food_type: string) => (
        <Tag color={food_type === 'veg' ? 'green' : 'red'}>
          {food_type.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Category ID',
      dataIndex: 'categories_id',
      key: 'categories_id',
    },
    {
      title: 'Prep Time (min)',
      dataIndex: 'preparation_time',
      key: 'preparation_time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'blue' : 'red'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Variants',
      key: 'variants',
      render: (_: any, record: MenuItem) => (
        <div>
          {record.variants && record.variants.map((variant, index) => (
            <div key={index}>
              {variant.variant_type}: ₹{variant.rate}
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Addons',
      key: 'addons',
      render: (_: any, record: MenuItem) => (
        <div>
          {record.addons && record.addons.map((addon, index) => {
            const addonData = addons.find(a => a.addon_id === addon.addon_id);
            return (
              <div key={index}>
                {addonData ? addonData.addon_name : `Addon ${addon.addon_id}`}
              </div>
            );
          })}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: MenuItem) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this menu?"
            onConfirm={() => handleDelete(record.menu_id!)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <h2>Menu Management</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setModalVisible(true)}
        >
          Add New Menu
        </Button>
      </Row>

      <Card>
        <Table 
          dataSource={menus} 
          columns={columns} 
          loading={loading}
          rowKey="menu_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingMenu ? "Edit Menu" : "Add New Menu"}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="menu_name"
                label="Menu Name"
                rules={[{ required: true, message: 'Please enter menu name' }]}
              >
                <Input placeholder="Enter menu name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="food_type"
                label="Food Type"
                rules={[{ required: true, message: 'Please select food type' }]}
              >
                <Select placeholder="Select food type">
                  <Option value="veg">Vegetarian</Option>
                  <Option value="nonveg">Non-Vegetarian</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea placeholder="Enter description" rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categories_id"
                label="Category ID"
                rules={[{ required: true, message: 'Please enter category ID' }]}
              >
                <Input type="number" placeholder="Enter category ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="preparation_time"
                label="Preparation Time (minutes)"
                rules={[{ required: true, message: 'Please enter preparation time' }]}
              >
                <Input type="number" placeholder="Enter preparation time" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Divider>Menu Variants</Divider>
          {variantFields.map((field, index) => (
            <Row gutter={16} key={field.key} style={{ marginBottom: 8 }}>
              <Col span={10}>
                <Input
                  placeholder="Variant type (e.g., Half, Full)"
                  value={field.variant_type}
                  onChange={(e) => handleVariantChange(field.key, 'variant_type', e.target.value)}
                />
              </Col>
              <Col span={10}>
                <Input
                  placeholder="Rate"
                  type="number"
                  value={field.rate}
                  onChange={(e) => handleVariantChange(field.key, 'rate', e.target.value)}
                />
              </Col>
              <Col span={4}>
                {variantFields.length > 1 && (
                  <Button 
                    type="link" 
                    danger 
                    onClick={() => removeVariantField(field.key)}
                  >
                    Remove
                  </Button>
                )}
              </Col>
            </Row>
          ))}
          <Button 
            type="dashed" 
            onClick={addVariantField} 
            style={{ width: '100%', marginBottom: 16 }}
          >
            <PlusOutlined /> Add Variant
          </Button>

          <Divider>Menu Addons</Divider>
          {addonFields.map((field, index) => (
            <Row gutter={16} key={field.key} style={{ marginBottom: 8 }}>
              <Col span={10}>
                <Select
                  placeholder="Select addon"
                  value={field.addon_id}
                  onChange={(value) => handleAddonChange(field.key, 'addon_id', value)}
                  style={{ width: '100%' }}
                >
                  {addons.map(addon => (
                    <Option key={addon.addon_id} value={addon.addon_id}>
                      {addon.addon_name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={10}>
                <Input
                  placeholder="Rate"
                  type="number"
                  value={field.rate}
                  onChange={(e) => handleAddonChange(field.key, 'rate', e.target.value)}
                />
              </Col>
              <Col span={4}>
                {addonFields.length > 1 && (
                  <Button 
                    type="link" 
                    danger 
                    onClick={() => removeAddonField(field.key)}
                  >
                    Remove
                  </Button>
                )}
              </Col>
            </Row>
          ))}
          <Button 
            type="dashed" 
            onClick={addAddonField} 
            style={{ width: '100%', marginBottom: 16 }}
          >
            <PlusOutlined /> Add Addon
          </Button>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {editingMenu ? "Update Menu" : "Create Menu"}
              </Button>
              <Button icon={<CloseOutlined />} onClick={handleModalCancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuMaster;
// Since we don't have antd installed, let's create a simpler implementation
