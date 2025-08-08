
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

// Define kitchen data type
interface Kitchen {
  id: string
  name: string
  location: string
  status: string
  assignedStaff: string
  active: boolean
  starred: boolean
  label?: { name: string; value: string; gradient: string }
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

// Sample kitchen data (10 items)
const initialKitchens: Kitchen[] = [
  {
    id: '1',
    name: 'Main Kitchen',
    location: 'First Floor',
    status: 'Operational',
    assignedStaff: 'Chef John, Assistant Sarah',
    active: true,
    starred: false,
    label: { name: 'Food Prep', value: 'food-prep', gradient: 'success' },
  },
  {
    id: '2',
    name: 'Pastry Kitchen',
    location: 'Ground Floor',
    status: 'Operational',
    assignedStaff: 'Chef Emma',
    active: true,
    starred: false,
    label: { name: 'Desserts', value: 'desserts', gradient: 'warning' },
  },
  {
    id: '3',
    name: 'Beverage Station',
    location: 'Bar Area',
    status: 'Operational',
    assignedStaff: 'Bartender Mike',
    active: true,
    starred: false,
    label: { name: 'Beverages', value: 'beverages', gradient: 'primary' },
  },
  {
    id: '4',
    name: 'Grill Station',
    location: 'Back Kitchen',
    status: 'Maintenance',
    assignedStaff: 'Chef Alex',
    active: false,
    starred: false,
    label: { name: 'Food Prep', value: 'food-prep', gradient: 'success' },
  },
  {
    id: '5',
    name: 'Prep Station',
    location: 'First Floor',
    status: 'Operational',
    assignedStaff: 'Assistant Lisa',
    active: true,
    starred: false,
    label: { name: 'Food Prep', value: 'food-prep', gradient: 'success' },
  },
  {
    id: '6',
    name: 'Cold Kitchen',
    location: 'Basement',
    status: 'Operational',
    assignedStaff: 'Chef Maria',
    active: true,
    starred: false,
    label: { name: 'Salads', value: 'salads', gradient: 'info' },
  },
  {
    id: '7',
    name: 'Bakery',
    location: 'Ground Floor',
    status: 'Operational',
    assignedStaff: 'Baker Tom',
    active: true,
    starred: false,
    label: { name: 'Desserts', value: 'desserts', gradient: 'warning' },
  },
  {
    id: '8',
    name: 'Sushi Station',
    location: 'First Floor',
    status: 'Operational',
    assignedStaff: 'Chef Ken',
    active: true,
    starred: false,
    label: { name: 'Food Prep', value: 'food-prep', gradient: 'success' },
  },
  {
    id: '9',
    name: 'Pasta Station',
    location: 'Back Kitchen',
    status: 'Operational',
    assignedStaff: 'Chef Sophia',
    active: true,
    starred: false,
    label: { name: 'Food Prep', value: 'food-prep', gradient: 'success' },
  },
  {
    id: '10',
    name: 'Coffee Bar',
    location: 'Front Area',
    status: 'Operational',
    assignedStaff: 'Barista Anna',
    active: true,
    starred: false,
    label: { name: 'Beverages', value: 'beverages', gradient: 'primary' },
  },
]

// AddKitchenModal component
const AddKitchenModal: React.FC<{
  show: boolean
  onHide: () => void
  onAddKitchen: (kitchenData: Omit<Kitchen, 'id' | 'active' | 'starred' | 'label'>) => void
}> = ({ show, onHide, onAddKitchen }) => {
  const [name, setName] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [assignedStaff, setAssignedStaff] = useState<string>('')

  const handleAdd = () => {
    if (!name || !status) {
      toast.error('Name and status are required')
      return
    }
    onAddKitchen({
      name,
      location,
      status,
      assignedStaff,
    })
    setName('')
    setLocation('')
    setStatus('')
    setAssignedStaff('')
    onHide()
  }

  if (!show) {
    return null
  }

  return (
    <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="modal-content" style={{ background: 'white', padding: '20px', maxWidth: '500px', margin: '100px auto', borderRadius: '8px' }}>
        <h3>Add New Kitchen</h3>
        <input
          type="text"
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Kitchen name (e.g., Main Kitchen)"
        />
        <input
          type="text"
          className="form-control mb-3"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (e.g., First Floor)"
        />
        <select
          className="form-control mb-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="" disabled>Select Status</option>
          <option value="Operational">Operational</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Closed">Closed</option>
        </select>
        <input
          type="text"
          className="form-control mb-3"
          value={assignedStaff}
          onChange={(e) => setAssignedStaff(e.target.value)}
          placeholder="Assigned Staff (e.g., Chef John)"
        />
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

// EditKitchenModal component
const EditKitchenModal: React.FC<{
  show: boolean
  onHide: () => void
  kitchen: Kitchen | null
  onEditKitchen: (id: string, updatedData: Omit<Kitchen, 'id' | 'active' | 'starred' | 'label'>) => void
}> = ({ show, onHide, kitchen, onEditKitchen }) => {
  const [name, setName] = useState<string>(kitchen?.name || '')
  const [location, setLocation] = useState<string>(kitchen?.location || '')
  const [status, setStatus] = useState<string>(kitchen?.status || '')
  const [assignedStaff, setAssignedStaff] = useState<string>(kitchen?.assignedStaff || '')

  useEffect(() => {
    if (kitchen) {
      setName(kitchen.name)
      setLocation(kitchen.location)
      setStatus(kitchen.status)
      setAssignedStaff(kitchen.assignedStaff)
    }
  }, [kitchen])

  if (!show || !kitchen) {
    return null
  }

  const handleEdit = () => {
    if (!name || !status) {
      toast.error('Name and status are required')
      return
    }
    onEditKitchen(kitchen.id, {
      name,
      location,
      status,
      assignedStaff,
    })
    onHide()
  }

  return (
    <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="modal-content" style={{ background: 'white', padding: '20px', maxWidth: '500px', margin: '100px auto', borderRadius: '8px' }}>
        <h3>Edit Kitchen</h3>
        <input
          type="text"
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Kitchen name"
        />
        <input
          type="text"
          className="form-control mb-3"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />
        <select
          className="form-control mb-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="" disabled>Select Status</option>
          <option value="Operational">Operational</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Closed">Closed</option>
        </select>
        <input
          type="text"
          className="form-control mb-3"
          value={assignedStaff}
          onChange={(e) => setAssignedStaff(e.target.value)}
          placeholder="Assigned Staff"
        />
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

const Kitchen: React.FC = () => {
  const [kitchens, setKitchens] = useState<Kitchen[]>(initialKitchens)
  const [selectedCategory, setSelectedCategory] = useState<string>('active')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredKitchens, setFilteredKitchens] = useState<Kitchen[]>(kitchens)
  const [selectedKitchen, setSelectedKitchen] = useState<Kitchen | null>(null)
  const [selectedKitchenIndex, setSelectedKitchenIndex] = useState<number>(-1)
  const [loading, setLoading] = useState<boolean>(false)
  const [showAddKitchenModal, setShowAddKitchenModal] = useState(false)
  const [showEditKitchenModal, setShowEditKitchenModal] = useState(false)
  const [sidebarLeftToggle, setSidebarLeftToggle] = useState<boolean>(false)
  const [sidebarMiniToggle, setSidebarMiniToggle] = useState<boolean>(false)
  const [containerToggle, setContainerToggle] = useState<boolean>(false)

  // Define columns for react-table with explicit widths
  const columns = useMemo<ColumnDef<Kitchen>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Kitchen',
        size: 200,
        cell: (info) => <h6 className="mb-1">{info.getValue<string>()}</h6>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        cell: (info) => <span>{info.getValue<string>()}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleEditKitchenClick(row.original)}
              style={{ padding: '4px 8px' }}
            >
              <i className="fi fi-rr-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteKitchen(row.original)}
              style={{ padding: '4px 8px' }}
            >
              <i className="fi fi-rr-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    [],
  )

  // Initialize react-table with pagination
  const table = useReactTable({
    data: filteredKitchens,
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

  const handleAddKitchen = useCallback((kitchenData: Omit<Kitchen, 'id' | 'active' | 'starred' | 'label'>) => {
    const statusToLabelMap: { [key: string]: { name: string; value: string; gradient: string } } = {
      Operational: { name: 'Food Prep', value: 'food-prep', gradient: 'success' },
      Maintenance: { name: 'Maintenance', value: 'maintenance', gradient: 'warning' },
      Closed: { name: 'Closed', value: 'closed', gradient: 'danger' },
    }

    const newKitchen: Kitchen = {
      id: (kitchens.length + 1).toString(),
      name: kitchenData.name,
      location: kitchenData.location,
      status: kitchenData.status,
      assignedStaff: kitchenData.assignedStaff,
      active: kitchenData.status === 'Operational',
      starred: false,
      label: statusToLabelMap[kitchenData.status] || { name: 'Other', value: 'other', gradient: 'info' },
    }

    const updatedKitchens = [...kitchens, newKitchen]
    setKitchens(updatedKitchens)

    if (selectedCategory === 'active' || newKitchen[selectedCategory as keyof Kitchen]) {
      setFilteredKitchens([...filteredKitchens, newKitchen])
    }

    toast.success('Kitchen added successfully')
  }, [kitchens, filteredKitchens, selectedCategory])

  const handleEditKitchen = useCallback((id: string, updatedData: Omit<Kitchen, 'id' | 'active' | 'starred' | 'label'>) => {
    const updatedKitchens = kitchens.map((kitchen) =>
      kitchen.id === id
        ? {
            ...kitchen,
            name: updatedData.name,
            location: updatedData.location,
            status: updatedData.status,
            assignedStaff: updatedData.assignedStaff,
            active: updatedData.status === 'Operational',
          }
        : kitchen
    )
    setKitchens(updatedKitchens)

    setFilteredKitchens((prev) =>
      prev.map((kitchen) =>
        kitchen.id === id
          ? {
              ...kitchen,
              name: updatedData.name,
              location: updatedData.location,
              status: updatedData.status,
              assignedStaff: updatedData.assignedStaff,
              active: updatedData.status === 'Operational',
            }
          : kitchen
      )
    )

    if (selectedKitchen?.id === id) {
      setSelectedKitchen({
        ...selectedKitchen,
        name: updatedData.name,
        location: updatedData.location,
        status: updatedData.status,
        assignedStaff: updatedData.assignedStaff,
        active: updatedData.status === 'Operational',
      })
    }

    toast.success('Kitchen updated successfully')
  }, [kitchens, selectedKitchen])

  const handleStarChange = useCallback((kitchenId: string, isStarred: boolean) => {
    const updatedKitchens = filteredKitchens.map((kitchen) =>
      kitchen.id === kitchenId ? { ...kitchen, starred: isStarred } : kitchen,
    )
    setFilteredKitchens(updatedKitchens)

    const updatedKitchenItems = kitchens.map((kitchen) =>
      kitchen.id === kitchenId ? { ...kitchen, starred: isStarred } : kitchen,
    )
    setKitchens(updatedKitchenItems)

    if (selectedKitchen?.id === kitchenId) {
      setSelectedKitchen({ ...selectedKitchen, starred: isStarred })
    }
  }, [kitchens, filteredKitchens, selectedKitchen])

  const categories: Category[] = useMemo(() => [
    {
      name: 'Kitchens',
      value: 'active',
      icon: 'fi-rr-kitchen',
      badge: kitchens.length,
      badgeClassName: 'bg-primary-subtle text-primary',
    },
  ], [kitchens.length])

  const labels: Label[] = useMemo(() => [
    { name: 'Food Prep', value: 'food-prep', gradient: 'success' },
    { name: 'Desserts', value: 'desserts', gradient: 'warning' },
    { name: 'Beverages', value: 'beverages', gradient: 'primary' },
    { name: 'Salads', value: 'salads', gradient: 'info' },
  ], [])

  useEffect(() => {
    setFilteredKitchens(kitchens.filter((kitchen) => kitchen.active))
  }, [kitchens])

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value)

      const filteredKitchensByCategory = kitchens.filter(
        (kitchen) => kitchen[selectedCategory as keyof Kitchen],
      )
      const filteredKitchensBySearch = filteredKitchensByCategory.filter((kitchen) =>
        kitchen.name.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredKitchens(filteredKitchensBySearch)
    }, 300),
    [kitchens, selectedCategory]
  )

  const handleCategoryChange = useCallback((categoryValue: string) => {
    setSelectedCategory(categoryValue)
    setSearchTerm('')

    if (labels.find((label) => label.value === categoryValue)) {
      setFilteredKitchens(
        kitchens.filter((kitchen) => {
          return typeof kitchen.label === 'object' && kitchen.label?.value === categoryValue
        }),
      )
    } else {
      setFilteredKitchens(kitchens.filter((kitchen) => kitchen[categoryValue as keyof Kitchen]))
    }
  }, [kitchens, labels])

  const handleKitchenClick = useCallback((kitchen: Kitchen) => {
    setSelectedKitchen(kitchen)
    setContainerToggle(true)
  }, [])

  const handleEditKitchenClick = useCallback((kitchen: Kitchen) => {
    setSelectedKitchen(kitchen)
    setShowEditKitchenModal(true)
  }, [])

  const handleDeleteKitchen = useCallback((kitchen: Kitchen) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this kitchen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3E97FF',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true)

        setTimeout(() => {
          const updatedKitchens = kitchens.filter((item) => item.id !== kitchen.id)
          setKitchens(updatedKitchens)

          const filteredKitchensByCategory = updatedKitchens.filter(
            (item) => item[selectedCategory as keyof Kitchen],
          )

          setFilteredKitchens(filteredKitchensByCategory)

          if (filteredKitchensByCategory.length === 0) {
            setFilteredKitchens([])
          }
          if (selectedKitchen?.id === kitchen.id) {
            setSelectedKitchen(null)
            setContainerToggle(false)
            setSidebarLeftToggle(false)
          }
          setLoading(false)
          toast.success('Kitchen deleted successfully')
        }, 1500)
      }
    })
  }, [kitchens, selectedCategory, selectedKitchen])

  useEffect(() => {
    const index = filteredKitchens.findIndex(
      (kitchen) => kitchen.id === (selectedKitchen?.id || ''),
    )
    setSelectedKitchenIndex(index)
  }, [filteredKitchens, selectedKitchen])

  const handleNext = useCallback(() => {
    if (selectedKitchenIndex < filteredKitchens.length - 1) {
      const nextIndex = selectedKitchenIndex + 1
      setSelectedKitchen(filteredKitchens[nextIndex])
      setContainerToggle(true)
    }
  }, [selectedKitchenIndex, filteredKitchens])

  const handlePrev = useCallback(() => {
    if (selectedKitchenIndex > 0) {
      const prevIndex = selectedKitchenIndex - 1
      setSelectedKitchen(filteredKitchens[prevIndex])
      setContainerToggle(true)
    }
  }, [selectedKitchenIndex, filteredKitchens])

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
      <TitleHelmet title="Kitchens" />
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
                style={{ minWidth: '330px' }}
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
                      className={selectedKitchen?.id === row.original.id ? 'active' : ''}
                      onClick={() => handleKitchenClick(row.original)}
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
                  border: '1px solid #0d6efd',
                  borderRadius: '4px',
                  padding: '2px 4px',
                  fontSize: '12px',
                  backgroundColor: '#fff',
                  color: '#6c757d',
                  cursor: 'pointer',
                  width: '100px',
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
                  gap: '3px',
                  marginRight: '20px',
                }}
              >
                <Pagination.Prev
                  onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 1)}
                  disabled={table.getState().pagination.pageIndex === 0}
                  style={{
                    border: '1px solid #e5e7eb',
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
                  style={{
                    backgroundColor: '#0d6efd',
                    border: '1px solid #0d6efd',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    minWidth: '24px',
                    textAlign: 'center',
                    lineHeight: '1',
                  }}
                >
                  {table.getState().pagination.pageIndex + 1}
                </Pagination.Item>
                <Pagination.Next
                  onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 1)}
                  disabled={table.getState().pagination.pageIndex === table.getPageCount() - 1}
                  style={{
                    border: '1px solid #e5e7eb',
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
            ) : !selectedKitchen ? (
              <Stack
                className="d-none d-lg-flex align-items-center justify-content-center flex-grow-1 h-100 mx-auto text-center"
                style={{ maxWidth: '320px' }}
              >
                <i className="fi fi-rr-kitchen fs-48 mb-6"></i>
                <h4 className="fw-bold">Select a kitchen to view</h4>
                <p className="fs-15 fw-light text-muted mb-4">
                  Select a kitchen from the left sidebar to view its details.
                </p>
                <Button
                  variant=""
                  className="btn-neutral"
                  onClick={() => setShowAddKitchenModal(true)}
                >
                  <i className="fi fi-br-plus fs-10"></i>
                  <span className="ms-2">Add New Kitchen</span>
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
                          setSelectedKitchen(null)
                          setContainerToggle(false)
                          setSidebarLeftToggle(false)
                        }}
                      >
                        <i className="fi fi-rr-arrow-left"></i>
                      </button>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">Kitchen</h5>
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
                        onClick={() => handleStarChange(selectedKitchen.id, !selectedKitchen.starred)}
                        style={{ padding: '8px', fontSize: '1.2rem' }}
                      >
                        <i className={`fi ${selectedKitchen.starred ? 'fi-rr-star' : 'fi-rs-star'}`}></i>
                      </button>
                      <button
                        className="btn btn-icon btn-light"
                        onClick={handlePrev}
                        disabled={selectedKitchenIndex <= 0}
                        style={{ padding: '8px', fontSize: '1.2rem' }}
                      >
                        <i className="fi fi-rr-angle-left"></i>
                      </button>
                      <button
                        className="btn btn-icon btn-light"
                        onClick={handleNext}
                        disabled={selectedKitchenIndex >= filteredKitchens.length - 1}
                        style={{ padding: '8px', fontSize: '1.2rem' }}
                      >
                        <i className="fi fi-rr-angle-right"></i>
                      </button>
                      <button
                        className="btn btn-icon btn-light"
                        onClick={() => handleDeleteKitchen(selectedKitchen)}
                        style={{ padding: '8px', fontSize: '1.2rem' }}
                      >
                        <i className="fi fi-rr-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="apps-contact-details p-4">
                  <div className="mb-4">
                    <h5 className="mb-2">{selectedKitchen.name}</h5>
                    <p className="text-muted mb-0">Status: {selectedKitchen.status}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-muted mb-2">Location:</p>
                    <p className="mb-0">{selectedKitchen.location}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-muted mb-2">Assigned Staff:</p>
                    <p className="mb-0">{selectedKitchen.assignedStaff}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="custom-backdrop" onClick={() => setSidebarMiniToggle(false)}></div>
      </Card>
      <AddKitchenModal
        show={showAddKitchenModal}
        onHide={() => setShowAddKitchenModal(false)}
        onAddKitchen={handleAddKitchen}
      />
      <EditKitchenModal
        show={showEditKitchenModal}
        onHide={() => setShowEditKitchenModal(false)}
        kitchen={selectedKitchen}
        onEditKitchen={handleEditKitchen}
      />
    </>
  )
}

export default Kitchen
