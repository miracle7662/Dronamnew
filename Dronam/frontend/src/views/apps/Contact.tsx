// import { useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import { PieChart, Pie, Cell } from 'recharts';
// import { ShoppingCart, Users, CreditCard, Tag, Package,  Clock, FileText, Truck, X } from 'lucide-react';

// export default function SalesDashboard() {
//   const [dateRange, setDateRange] = useState('Daily');

//   // Sample data for charts
//   const barData = [
//     { name: '1', value: 12000 },
//     { name: '2', value: 19000 },
//     { name: '3', value: 10000 },
//     { name: '4', value: 22000 },
//     { name: '5', value: 15000 },
//     { name: '6', value: 18000 },
//     { name: '7', value: 24000 },
//     { name: '8', value: 16000 },
//     { name: '9', value: 12000 },
//     { name: '10', value: 19000 },
//     { name: '11', value: 14000 },
//     { name: '12', value: 25000 },
//     { name: '13', value: 17000 },
//     { name: '14', value: 22000 },
//     { name: '15', value: 20000 },
//   ];

//   const pieData = [
//     { name: 'Online Sales', value: 1420252, color: '#FFD700' },
//     { name: 'Digital Sales', value: 60300, color: '#0080FF' }
//   ];

//   return (
//     <div className="bg-gray-100 p-4 min-h-screen">
//       <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//         <div className="text-xl font-bold mb-4 text-gray-700">Sales Dashboard</div>
        
//         {/* Top Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white border rounded-lg p-4 shadow-sm">
//             <p className="text-sm text-gray-500">Today's Sales</p>
//             <p className="text-lg font-bold">Rs 8,400</p>
//           </div>
          
//           <div className="bg-white border rounded-lg p-4 shadow-sm">
//             <p className="text-sm text-gray-500">Total Sales</p>
//             <p className="text-lg font-bold">Rs 1420252.00 (3459)</p>
//           </div>
          
//           <div className="bg-white border rounded-lg p-4 shadow-sm">
//             <p className="text-sm text-gray-500">This Month</p>
//             <p className="text-lg font-bold">Rs 60300.00 (134)</p>
//           </div>
          
//           <div className="bg-white border rounded-lg p-4 shadow-sm">
//             <p className="text-sm text-gray-500">IP Address</p>
//             <p className="text-lg font-bold">192.168.29.9</p>
//           </div>
//         </div>
        
//         {/* Middle Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="col-span-2">
//             {/* Stats cards grid */}
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
//               <div className="bg-white border rounded-lg p-3 shadow-sm flex flex-col items-center">
//                 <div className="bg-gray-200 p-2 rounded-full mb-2">
//                   <ShoppingCart size={20} className="text-gray-700" />
//                 </div>
//                 <p className="text-xs text-gray-500">Online Sales</p>
//                 <p className="text-sm font-bold">Rs 1420252.00</p>
//                 <p className="text-xs text-gray-500">(3459)</p>
//               </div>
              
//               <div className="bg-white border rounded-lg p-3 shadow-sm flex flex-col items-center">
//                 <div className="bg-gray-200 p-2 rounded-full mb-2">
//                   <CreditCard size={20} className="text-gray-700" />
//                 </div>
//                 <p className="text-xs text-gray-500">Digital Sales</p>
//                 <p className="text-sm font-bold">Rs 0.00</p>
//                 <p className="text-xs text-gray-500">(0)</p>
//               </div>
              
//               <div className="bg-white border rounded-lg p-3 shadow-sm flex flex-col items-center">
//                 <div className="bg-gray-200 p-2 rounded-full mb-2">
//                   <Tag size={20} className="text-gray-700" />
//                 </div>
//                 <p className="text-xs text-gray-500">Total Discount</p>
//                 <p className="text-sm font-bold">Rs 23275.50</p>
//               </div>
              
//               <div className="bg-white border rounded-lg p-3 shadow-sm flex flex-col items-center">
//                 <div className="bg-gray-200 p-2 rounded-full mb-2">
//                   <Users size={20} className="text-gray-700" />
//                 </div>
//                 <p className="text-xs text-gray-500">Dine In</p>
//                 <p className="text-sm font-bold">Rs 1088684.00</p>
//                 <p className="text-xs text-gray-500">(2247)</p>
//               </div>
              
//               <div className="bg-white border rounded-lg p-3 shadow-sm flex flex-col items-center">
//                 <div className="bg-gray-200 p-2 rounded-full mb-2">
//                   <Clock size={20} className="text-gray-700" />
//                 </div>
//                 <p className="text-xs text-gray-500">Quick Bill</p>
//                 <p className="text-sm font-bold">Rs 220.00</p>
//                 <p className="text-xs text-gray-500">(1)</p>
//               </div>
              
//               <div className="bg-white border rounded-lg p-3 shadow-sm flex flex-col items-center">
//                 <div className="bg-gray-200 p-2 rounded-full mb-2">
//                   <Package size={20} className="text-gray-700" />
//                 </div>
//                 <p className="text-xs text-gray-500">Pickup</p>
//                 <p className="text-sm font-bold">Rs 14751.00</p>
//                 <p className="text-xs text-gray-500">(53)</p>
//               </div>
              
//               <div className="bg-white border rounded-lg p-3 shadow-sm flex flex-col items-center">
//                 <div className="bg-gray-200 p-2 rounded-full mb-2">
//                   <Truck size={20} className="text-gray-700" />
//                 </div>
//                 <p className="text-xs text-gray-500">Delivery</p>
//                 <p className="text-sm font-bold">Rs 25681.00</p>
//                 <p className="text-xs text-gray-500">(67)</p>
//               </div>
              
//               <div className="bg-white border rounded-lg p-3 shadow-sm flex flex-col items-center">
//                 <div className="bg-gray-200 p-2 rounded-full mb-2">
//                   <X size={20} className="text-gray-700" />
//                 </div>
//                 <p className="text-xs text-gray-500">Cancelled Bill</p>
//                 <p className="text-sm font-bold">Rs 3400.00</p>
//                 <p className="text-xs text-gray-500">(14)</p>
//               </div>
              
//               <div className="bg-white border rounded-lg p-3 shadow-sm flex flex-col items-center">
//                 <div className="bg-gray-200 p-2 rounded-full mb-2">
//                   <FileText size={20} className="text-gray-700" />
//                 </div>
//                 <p className="text-xs text-gray-500">Free Bill</p>
//                 <p className="text-sm font-bold">Rs 0.00</p>
//                 <p className="text-xs text-gray-500">(0)</p>
//               </div>
//             </div>
            
//             {/* Date Range Filter */}
//             <div className="flex mb-4 gap-2">
//               <div className="text-xs text-gray-500 flex items-center">07 Mar 2025 - 07 May 2025</div>
//               <button 
//                 className={`text-xs px-3 py-1 rounded ${dateRange === 'Daily' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//                 onClick={() => setDateRange('Daily')}
//               >
//                 Daily
//               </button>
//               <button 
//                 className={`text-xs px-3 py-1 rounded ${dateRange === 'Weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//                 onClick={() => setDateRange('Weekly')}
//               >
//                 Weekly
//               </button>
//               <button 
//                 className={`text-xs px-3 py-1 rounded ${dateRange === 'Monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//                 onClick={() => setDateRange('Monthly')}
//               >
//                 Monthly
//               </button>
//             </div>
            
//             {/* Legend */}
//             <div className="flex gap-4 mb-4">
//               <div className="flex items-center gap-1">
//                 <div className="w-3 h-3 bg-red-500"></div>
//                 <span className="text-xs text-gray-500">Online</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <div className="w-3 h-3 bg-yellow-500"></div>
//                 <span className="text-xs text-gray-500">Dine In</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <div className="w-3 h-3 bg-blue-500"></div>
//                 <span className="text-xs text-gray-500">Digital</span>
//               </div>
//             </div>
            
//             {/* Semi Circle Chart */}
//             <div className="h-64 mb-4">
//               <div className="h-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={pieData}
//                       cx="50%"
//                       cy="80%"
//                       startAngle={180}
//                       endAngle={0}
//                       innerRadius={60}
//                       outerRadius={80}
//                       paddingAngle={5}
//                       dataKey="value"
//                     >
//                       {pieData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
          
//           {/* Bar Chart */}
//           <div className="h-96">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={barData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="value" fill="#FF4560" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Swal from 'sweetalert2'
import { toast } from 'react-hot-toast'
import { Preloader } from '@/components/Misc/Preloader'
import { Button, Card, Stack, Pagination, Table } from 'react-bootstrap'
import {
  ContactSearchBar,
  ContactSidebar,
} from '@/components/Apps/Contact'
import TitleHelmet from '@/components/Common/TitleHelmet'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table'

// Define group data type
interface GroupItem {
  id: string
  srNo: number
  name: string
  type: string
  alls: boolean
  starred: boolean
  label?: string | { name: string; value: string; gradient: string }
}

interface Category {
  name: string
  value: string
  icon: string
  badge?: number
  badgeClassName?: string
}

interface Label {
  name: string
  value: string
  gradient: string
}

// Sample group data (15 items)
const initialGroupItems: GroupItem[] = [
  {
    id: '1',
    srNo: 1,
    name: 'Administrators',
    type: 'System',
    alls: true,
    starred: false,
    label: { name: 'System', value: 'system', gradient: 'success' },
  },
  {
    id: '2',
    srNo: 2,
    name: 'Managers',
    type: 'Custom',
    alls: true,
    starred: false,
    label: { name: 'Custom', value: 'custom', gradient: 'primary' },
  },
  {
    id: '3',
    srNo: 3,
    name: 'Users',
    type: 'System',
    alls: true,
    starred: false,
    label: { name: 'System', value: 'system', gradient: 'success' },
  },
  {
    id: '4',
    srNo: 4,
    name: 'Guests',
    type: 'Temporary',
    alls: true,
    starred: false,
    label: { name: 'Temporary', value: 'temporary', gradient: 'warning' },
  },
  {
    id: '5',
    srNo: 5,
    name: 'Developers',
    type: 'Custom',
    alls: true,
    starred: false,
    label: { name: 'Custom', value: 'custom', gradient: 'primary' },
  },
  {
    id: '6',
    srNo: 6,
    name: 'Support',
    type: 'Temporary',
    alls: true,
    starred: false,
    label: { name: 'Temporary', value: 'temporary', gradient: 'warning' },
  },
  {
    id: '7',
    srNo: 7,
    name: 'Editors',
    type: 'Custom',
    alls: true,
    starred: false,
    label: { name: 'Custom', value: 'custom', gradient: 'primary' },
  },
  {
    id: '8',
    srNo: 8,
    name: 'Viewers',
    type: 'System',
    alls: true,
    starred: false,
    label: { name: 'System', value: 'system', gradient: 'success' },
  },
  {
    id: '9',
    srNo: 9,
    name: 'Auditors',
    type: 'Temporary',
    alls: true,
    starred: false,
    label: { name: 'Temporary', value: 'temporary', gradient: 'warning' },
  },
  {
    id: '10',
    srNo: 10,
    name: 'Subscribers',
    type: 'System',
    alls: true,
    starred: false,
    label: { name: 'System', value: 'system', gradient: 'success' },
  },
  {
    id: '11',
    srNo: 11,
    name: 'Moderators',
    type: 'Custom',
    alls: true,
    starred: false,
    label: { name: 'Custom', value: 'custom', gradient: 'primary' },
  },
  {
    id: '12',
    srNo: 12,
    name: 'Analysts',
    type: 'Custom',
    alls: true,
    starred: false,
    label: { name: 'Custom', value: 'custom', gradient: 'primary' },
  },
  {
    id: '13',
    srNo: 13,
    name: 'Contributors',
    type: 'Temporary',
    alls: true,
    starred: false,
    label: { name: 'Temporary', value: 'temporary', gradient: 'warning' },
  },
  {
    id: '14',
    srNo: 14,
    name: 'Reviewers',
    type: 'System',
    alls: true,
    starred: false,
    label: { name: 'System', value: 'system', gradient: 'success' },
  },
  {
    id: '15',
    srNo: 15,
    name: 'Approvers',
    type: 'System',
    alls: true,
    starred: false,
    label: { name: 'System', value: 'system', gradient: 'success' },
  },
]

// AddGroupModal component
const AddGroupModal: React.FC<{
  show: boolean
  onHide: () => void
  onAddGroup: (groupData: Omit<GroupItem, 'id' | 'alls' | 'starred' | 'label' | 'srNo'>) => void
}> = ({ show, onHide, onAddGroup }) => {
  const [name, setName] = useState<string>('')
  const [type, setType] = useState<string>('Custom')

  if (!show) return null

  const handleAdd = () => {
    onAddGroup({
      name,
      type,
    })
    setName('')
    setType('Custom')
    onHide()
  }

  return (
    <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="modal-content" style={{ background: 'white', padding: '20px', maxWidth: '500px', margin: '100px auto', borderRadius: '8px' }}>
        <h3>Add New Group</h3>
        <input
          type="text"
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group name (e.g., Administrators)"
        />
        <select
          className="form-control mb-3"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="System">System</option>
          <option value="Custom">Custom</option>
          <option value="Temporary">Temporary</option>
        </select>
        <div className="d-flex justify-content-end">
          <button className="btn btn-outline-secondary me-2" onClick={onHide}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

// EditGroupModal component
const EditGroupModal: React.FC<{
  show: boolean
  onHide: () => void
  group: GroupItem | null
  onEditGroup: (id: string, updatedData: Omit<GroupItem, 'id' | 'alls' | 'starred' | 'label' | 'srNo'>) => void
}> = ({ show, onHide, group, onEditGroup }) => {
  const [name, setName] = useState<string>(group?.name || '')
  const [type, setType] = useState<string>(group?.type || 'Custom')

  useEffect(() => {
    if (group) {
      setName(group.name)
      setType(group.type)
    }
  }, [group])

  if (!show || !group) return null

  const handleEdit = () => {
    onEditGroup(group.id, {
      name,
      type,
    })
    onHide()
  }

  return (
    <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="modal-content" style={{ background: 'white', padding: '20px', maxWidth: '500px', margin: '100px auto', borderRadius: '8px' }}>
        <h3>Edit Group</h3>
        <input
          type="text"
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group name"
        />
        <select
          className="form-control mb-3"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="System">System</option>
          <option value="Custom">Custom</option>
          <option value="Temporary">Temporary</option>
        </select>
        <div className="d-flex justify-content-end">
          <button className="btn btn-outline-secondary me-2" onClick={onHide}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleEdit}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// Debounce utility function
const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

const GroupMaster: React.FC = () => {
  const [groupItems, setGroupItems] = useState<GroupItem[]>(initialGroupItems)
  const [selectedCategory, setSelectedCategory] = useState<string>('alls')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredGroups, setFilteredGroups] = useState<GroupItem[]>(groupItems)
  const [selectedGroup, setSelectedGroup] = useState<GroupItem | null>(null)
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(-1)
  const [loading, setLoading] = useState<boolean>(false)
  const [showAddGroupModal, setShowAddGroupModal] = useState(false)
  const [showEditGroupModal, setShowEditGroupModal] = useState(false)
  const [sidebarLeftToggle, setSidebarLeftToggle] = useState<boolean>(false)
  const [sidebarMiniToggle, setSidebarMiniToggle] = useState<boolean>(false)
  const [containerToggle, setContainerToggle] = useState<boolean>(false)

  // Define columns for react-table with explicit widths
  const columns = React.useMemo<ColumnDef<GroupItem>[]>(
    () => [
      {
        accessorKey: 'srNo',
        header: 'Sr.No',
        size: 50,
        cell: (info) => (
          <div className="text-muted">
            {info.getValue<number>()}
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Group Name',
        size: 150,
        cell: (info) => (
          <div className="d-flex align-items-center">
            <h6 className="mb-0">{info.getValue<string>()}</h6>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Group Type',
        size: 100,
        cell: (info) => {
          const type = info.getValue<string>()
          return (
            <div className="d-flex align-items-center">
              <span>{type}</span>
            </div>
          )
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleEditGroupClick(row.original)}
              style={{ padding: '4px 8px' }}
            >
              <i className="fi fi-rr-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteGroup(row.original)}
              style={{ padding: '4px 8px' }}
            >
              <i className="fi fi-rr-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    []
  )

  // Initialize react-table with pagination
  const table = useReactTable({
    data: filteredGroups,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const handleAddGroup = useCallback((groupData: Omit<GroupItem, 'id' | 'alls' | 'starred' | 'label' | 'srNo'>) => {
    const typeToLabelMap: { [key: string]: { name: string; value: string; gradient: string } } = {
      'System': { name: 'System', value: 'system', gradient: 'success' },
      'Custom': { name: 'Custom', value: 'custom', gradient: 'primary' },
      'Temporary': { name: 'Temporary', value: 'temporary', gradient: 'warning' },
    }

    const newGroup: GroupItem = {
      id: (groupItems.length + 1).toString(),
      srNo: groupItems.length + 1,
      name: groupData.name,
      type: groupData.type,
      alls: true,
      starred: false,
      label: typeToLabelMap[groupData.type] || { name: 'Custom', value: 'custom', gradient: 'primary' },
    }

    const updatedGroupItems = [...groupItems, newGroup]
    setGroupItems(updatedGroupItems)

    if (selectedCategory === 'alls' || newGroup[selectedCategory as keyof GroupItem]) {
      setFilteredGroups([...filteredGroups, newGroup])
    }

    toast.success('Group added successfully')
  }, [groupItems, filteredGroups, selectedCategory])

  const handleEditGroup = useCallback((id: string, updatedData: Omit<GroupItem, 'id' | 'alls' | 'starred' | 'label' | 'srNo'>) => {
    const updatedGroupItems = groupItems.map((item) =>
      item.id === id
        ? {
            ...item,
            name: updatedData.name,
            type: updatedData.type,
          }
        : item
    )
    setGroupItems(updatedGroupItems)

    setFilteredGroups((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              name: updatedData.name,
              type: updatedData.type,
            }
          : item
      )
    )

    if (selectedGroup?.id === id) {
      setSelectedGroup({
        ...selectedGroup,
        name: updatedData.name,
        type: updatedData.type,
      })
    }

    toast.success('Group updated successfully')
  }, [groupItems, selectedGroup])

  const handleStarChange = useCallback((groupId: string, isStarred: boolean) => {
    const updatedGroups = filteredGroups.map((item) =>
      item.id === groupId ? { ...item, starred: isStarred } : item,
    )
    setFilteredGroups(updatedGroups)

    const updatedGroupItems = groupItems.map((item) =>
      item.id === groupId ? { ...item, starred: isStarred } : item,
    )
    setGroupItems(updatedGroupItems)

    if (selectedGroup?.id === groupId) {
      setSelectedGroup({ ...selectedGroup, starred: isStarred })
    }
  }, [groupItems, filteredGroups, selectedGroup])

  const categories: Category[] = useMemo(() => [
    {
      name: 'Groups',
      value: 'alls',
      icon: 'fi-rr-users',
      badge: groupItems.length,
      badgeClassName: 'bg-primary-subtle text-primary',
    },
  ], [groupItems.length])

  const labels: Label[] = useMemo(() => [
    { name: 'System', value: 'system', gradient: 'success' },
    { name: 'Custom', value: 'custom', gradient: 'primary' },
    { name: 'Temporary', value: 'temporary', gradient: 'warning' },
  ], [])

  useEffect(() => {
    setFilteredGroups(groupItems.filter((item) => item.alls))
  }, [groupItems])

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value)

      const filteredGroupsByCategory = groupItems.filter(
        (item) => item[selectedCategory as keyof GroupItem],
      )
      const filteredGroupsBySearch = filteredGroupsByCategory.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredGroups(filteredGroupsBySearch)
    }, 300),
    [groupItems, selectedCategory]
  )

  const handleCategoryChange = useCallback((categoryValue: string) => {
    setSelectedCategory(categoryValue)
    setSearchTerm('')

    if (labels.find((label) => label.value === categoryValue)) {
      setFilteredGroups(
        groupItems.filter((item) => {
          if (typeof item.label === 'object') {
            return item.label.value === categoryValue
          } else {
            return item.label && item.label.includes(categoryValue)
          }
        }),
      )
    } else {
      setFilteredGroups(groupItems.filter((item) => item[categoryValue as keyof GroupItem]))
    }
  }, [groupItems, labels])

  const handleGroupItemClick = useCallback((group: GroupItem) => {
    setSelectedGroup(group)
    setContainerToggle(true)
  }, [])

  const handleEditGroupClick = useCallback((group: GroupItem) => {
    setSelectedGroup(group)
    setShowEditGroupModal(true)
  }, [])

  const handleDeleteGroup = useCallback((group: GroupItem) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this group!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3E97FF',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true)

        setTimeout(() => {
          const updatedGroups = groupItems.filter((item) => item.id !== group.id)
          setGroupItems(updatedGroups)

          const filteredGroupsByCategory = updatedGroups.filter(
            (item) => item[selectedCategory as keyof GroupItem],
          )

          setFilteredGroups(filteredGroupsByCategory)

          if (filteredGroupsByCategory.length === 0) {
            setFilteredGroups([])
          }
          if (selectedGroup?.id === group.id) {
            setSelectedGroup(null)
            setContainerToggle(false)
            setSidebarLeftToggle(false)
          }
          setLoading(false)
          toast.success('Group deleted successfully')
        }, 1500)
      }
    })
  }, [groupItems, selectedCategory, selectedGroup])

  useEffect(() => {
    const index = filteredGroups.findIndex(
      (group) => group.id === (selectedGroup?.id || ''),
    )
    setSelectedGroupIndex(index)
  }, [filteredGroups, selectedGroup])

  const handleNext = useCallback(() => {
    if (selectedGroupIndex < filteredGroups.length - 1) {
      const nextIndex = selectedGroupIndex + 1
      setSelectedGroup(filteredGroups[nextIndex])
      setContainerToggle(true)
    }
  }, [selectedGroupIndex, filteredGroups])

  const handlePrev = useCallback(() => {
    if (selectedGroupIndex > 0) {
      const prevIndex = selectedGroupIndex - 1
      setSelectedGroup(filteredGroups[prevIndex])
      setContainerToggle(true)
    }
  }, [selectedGroupIndex, filteredGroups])

  // Compute the card classes based on state
  const cardClasses = useMemo(() => {
    let classes = 'apps-card'
    if (sidebarMiniToggle) classes += ' apps-sidebar-mini-toggle'
    if (containerToggle) classes += ' apps-container-toggle'
    if (sidebarLeftToggle) classes += ' apps-sidebar-left-toggle'
    return classes
  }, [sidebarMiniToggle, containerToggle, sidebarLeftToggle])

  // Handle resize for sidebarLeftToggle
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 991.98 && sidebarLeftToggle) {
        setSidebarLeftToggle(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [sidebarLeftToggle])

  const handleMenuClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setSidebarLeftToggle((prev) => !prev)
  }, [])

  return (
    <>
      <TitleHelmet title="Group Master" />
      <style>
        {`
          .apps-card {
            transition: all 0.3s ease-in-out;
          }
          .apps-sidebar-left,
          .apps-container {
            transition: width 0.3s ease-in-out;
          }
        `}
      </style>
      <Card className={cardClasses}>
        <div className="apps-sidebar-mini">
          <ContactSidebar
            categories={categories}
            labels={labels}
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
            setSidebarMiniToggle={setSidebarMiniToggle}
          />
        </div>
        <div className="apps-sidebar apps-sidebar-left apps-sidebar-md">
          <ContactSearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
          <div 
            className="apps-sidebar-content" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%', 
              minWidth: '350px'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2 px-3">
              <span className="text-muted fw-bold"></span>
              <span className="text-muted fw-bold"></span>
            </div>
            <div style={{ marginLeft: '10px' }}>
              <Table 
                responsive 
                className="mb-0" 
                style={{ minWidth: '100px' }}
              >
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th 
                          key={header.id} 
                          colSpan={header.colSpan}
                          style={{ width: header.column.columnDef.size }}
                        >
                          {header.isPlaceholder ? null : (
                            <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={selectedGroup?.id === row.original.id ? 'active' : ''}
                      onClick={() => handleGroupItemClick(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <Stack 
              className="p-2 border-top d-flex flex-row align-items-center justify-content-between"
              style={{ gap: '6px', padding: '8px 12px' }}
            >
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value))
                }}
                style={{
                  borderRadius: '4px',
                  padding: '2px 4px',
                  fontSize: '12px',
                  backgroundColor: 'transparent',
                  color: '#6c757d',
                  cursor: 'pointer',
                  width: '80px',
                  height: '24px',
                }}
              >
                {[10, 20, 30].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <Pagination 
                className="m-0"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0px',
                  marginRight: '20px',
                }}
              >
                <Pagination.Prev
                  onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 1)}
                  disabled={table.getState().pagination.pageIndex === 0}
                  style={{
                    color: table.getState().pagination.pageIndex === 0 ? '#d3d3d3' : '#6c757d',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    fontSize: '12px',
                    lineHeight: '1',
                  }}
                >
                  <i className="fi fi-rr-angle-left" style={{ fontSize: '12px' }} />
                </Pagination.Prev>
                <Pagination.Item
                  active
                >
                  {table.getState().pagination.pageIndex + 1}
                </Pagination.Item>
                <Pagination.Next
                  onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 1)}
                  disabled={table.getState().pagination.pageIndex === table.getPageCount() - 1}
                  style={{
                    color: table.getState().pagination.pageIndex === table.getPageCount() - 1 ? '#d3d3d3' : '#6c757d',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    fontSize: '12px',
                    lineHeight: '1',
                  }}
                >
                  <i className="fi fi-rr-angle-right" style={{ fontSize: '12px' }} />
                </Pagination.Next>
              </Pagination>
            </Stack>
          </div>
        </div>
        <div className={`apps-container ${containerToggle ? 'w-full' : 'w-1/2'}`}>
          <div className="apps-container-inner" style={{ minHeight: 'calc(100vh - 100px)' }}>
            {loading ? (
              <Stack className="align-items-center justify-content-center flex-grow-1 h-100">
                <Preloader />
              </Stack>
            ) : !selectedGroup ? (
              <Stack
                className="d-none d-lg-flex align-items-center justify-content-center flex-grow-1 h-100 mx-auto text-center"
                style={{ maxWidth: '320px' }}
              >
                <i className="fi fi-rr-users fs-48 mb-6"></i>
                <h4 className="fw-bold">Select a group to view</h4>
                <p className="fs-15 fw-light text-muted mb-4">
                  Select a group from the left sidebar to view its details.
                </p>
                <Button
                  variant=""
                  className="btn-neutral"
                  onClick={() => setShowAddGroupModal(true)}
                >
                  <i className="fi fi-br-plus fs-10"></i>
                  <span className="ms-2">Add New Group</span>
                </Button>
              </Stack>
            ) : (
              <div>
                <div className="apps-contact-details-header p-3 border-bottom">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-icon btn-light me-3"
                        onClick={() => {
                          setSelectedGroup(null)
                          setContainerToggle(false)
                          setSidebarLeftToggle(false)
                        }}
                      >
                        <i className="fi fi-rr-arrow-left"></i>
                      </button>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">Group Details</h5>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-icon btn-light"
                        onClick={handleMenuClick}
                        style={{ padding: '8px', fontSize: '1.2rem' }}
                      >
                        <i className="fi fi-rr-menu-burger"></i>
                      </button>
                      <button
                        className="btn btn-icon btn-light"
                        onClick={() => handleStarChange(selectedGroup.id, !selectedGroup.starred)}
                        style={{ padding: '8px', fontSize: '1.2rem' }}
                      >
                        <i className={`fi ${selectedGroup.starred ? 'fi-rr-star' : 'fi-rs-star'}`}></i>
                      </button>
                      <button
                        className="btn btn-icon btn-light"
                        onClick={handlePrev}
                        disabled={selectedGroupIndex <= 0}
                        style={{ padding: '8px', fontSize: '1.2rem' }}
                      >
                        <i className="fi fi-rr-angle-left"></i>
                      </button>
                      <button
                        className="btn btn-icon btn-light"
                        onClick={handleNext}
                        disabled={selectedGroupIndex >= filteredGroups.length - 1}
                        style={{ padding: '8px', fontSize: '1.2rem' }}
                      >
                        <i className="fi fi-rr-angle-right"></i>
                      </button>
                      <button
                        className="btn btn-icon btn-light"
                        onClick={() => handleDeleteGroup(selectedGroup)}
                        style={{ padding: '8px', fontSize: '1.2rem' }}
                      >
                        <i className="fi fi-rr-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="apps-contact-details p-4">
                  <div className="mb-4">
                   <p className="text-muted mb-2">Group Name:</p>
                    <div className="d-flex align-items-center">
                    <p className="mb-2">{selectedGroup.name}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-muted mb-2">Group Type:</p>
                    <div className="d-flex align-items-center">
                      <p className="mb-0">{selectedGroup.type}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="custom-backdrop" onClick={() => setSidebarMiniToggle(false)}></div>
      </Card>
      <AddGroupModal
        show={showAddGroupModal}
        onHide={() => setShowAddGroupModal(false)}
        onAddGroup={handleAddGroup}
      />
      <EditGroupModal
        show={showEditGroupModal}
        onHide={() => setShowEditGroupModal(false)}
        group={selectedGroup}
        onEditGroup={handleEditGroup}
      />
    </>
  )
}

export default React.memo(GroupMaster)