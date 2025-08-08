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

// Define state data type
interface StateItem {
  id: string
  code: string
  name: string
  country: string
  details: {
    capital: string
  }
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

// Sample state data (15 US states)
const initialStateItems: StateItem[] = [
  {
    id: '1',
    code: 'CA',
    name: 'California',
    country: 'United States',
    details: { capital: 'Sacramento' },
    alls: true,
    starred: false,
    label: { name: 'West', value: 'west', gradient: 'success' },
  },
  {
    id: '2',
    code: 'TX',
    name: 'Texas',
    country: 'United States',
    details: { capital: 'Austin' },
    alls: true,
    starred: false,
    label: { name: 'South', value: 'south', gradient: 'warning' },
  },
  {
    id: '3',
    code: 'NY',
    name: 'New York',
    country: 'United States',
    details: { capital: 'Albany' },
    alls: true,
    starred: false,
    label: { name: 'Northeast', value: 'northeast', gradient: 'danger' },
  },
  {
    id: '4',
    code: 'FL',
    name: 'Florida',
    country: 'United States',
    details: { capital: 'Tallahassee' },
    alls: true,
    starred: false,
    label: { name: 'South', value: 'south', gradient: 'warning' },
  },
  {
    id: '5',
    code: 'IL',
    name: 'Illinois',
    country: 'United States',
    details: { capital: 'Springfield' },
    alls: true,
    starred: false,
    label: { name: 'Midwest', value: 'midwest', gradient: 'info' },
  },
  {
    id: '6',
    code: 'PA',
    name: 'Pennsylvania',
    country: 'United States',
    details: { capital: 'Harrisburg' },
    alls: true,
    starred: false,
    label: { name: 'Northeast', value: 'northeast', gradient: 'danger' },
  },
  {
    id: '7',
    code: 'OH',
    name: 'Ohio',
    country: 'United States',
    details: { capital: 'Columbus' },
    alls: true,
    starred: false,
    label: { name: 'Midwest', value: 'midwest', gradient: 'info' },
  },
  {
    id: '8',
    code: 'MI',
    name: 'Michigan',
    country: 'United States',
    details: { capital: 'Lansing' },
    alls: true,
    starred: false,
    label: { name: 'Midwest', value: 'midwest', gradient: 'info' },
  },
  {
    id: '9',
    code: 'GA',
    name: 'Georgia',
    country: 'United States',
    details: { capital: 'Atlanta' },
    alls: true,
    starred: false,
    label: { name: 'South', value: 'south', gradient: 'warning' },
  },
  {
    id: '10',
    code: 'NC',
    name: 'North Carolina',
    country: 'United States',
    details: { capital: 'Raleigh' },
    alls: true,
    starred: false,
    label: { name: 'South', value: 'south', gradient: 'warning' },
  },
  {
    id: '11',
    code: 'NJ',
    name: 'New Jersey',
    country: 'United States',
    details: { capital: 'Trenton' },
    alls: true,
    starred: false,
    label: { name: 'Northeast', value: 'northeast', gradient: 'danger' },
  },
  {
    id: '12',
    code: 'VA',
    name: 'Virginia',
    country: 'United States',
    details: { capital: 'Richmond' },
    alls: true,
    starred: false,
    label: { name: 'South', value: 'south', gradient: 'warning' },
  },
  {
    id: '13',
    code: 'WA',
    name: 'Washington',
    country: 'United States',
    details: { capital: 'Olympia' },
    alls: true,
    starred: false,
    label: { name: 'West', value: 'west', gradient: 'success' },
  },
  {
    id: '14',
    code: 'AZ',
    name: 'Arizona',
    country: 'United States',
    details: { capital: 'Phoenix' },
    alls: true,
    starred: false,
    label: { name: 'West', value: 'west', gradient: 'success' },
  },
  {
    id: '15',
    code: 'MA',
    name: 'Massachusetts',
    country: 'United States',
    details: { capital: 'Boston' },
    alls: true,
    starred: false,
    label: { name: 'Northeast', value: 'northeast', gradient: 'danger' },
  },
]

// AddStateModal component
const AddStateModal: React.FC<{
  show: boolean
  onHide: () => void
  onAddState: (stateData: Omit<StateItem, 'id' | 'alls' | 'starred' | 'label'>) => void
}> = ({ show, onHide, onAddState }) => {
  const [name, setName] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [capital, setCapital] = useState<string>('')
  const [country, setCountry] = useState<string>('United States')

  if (!show) return null

  const handleAdd = () => {
    onAddState({
      name,
      code,
      country,
      details: {
        capital,
      },
    })
    setName('')
    setCode('')
    setCapital('')
    setCountry('United States')
    onHide()
  }

  return (
    <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="modal-content" style={{ background: 'white', padding: '20px', maxWidth: '500px', margin: '100px auto', borderRadius: '8px' }}>
        <h3>Add New State</h3>
        <input
          type="text"
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="State name (e.g., California)"
        />
        <input
          type="text"
          className="form-control mb-3"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="State code (e.g., CA)"
        />
        <input
          type="text"
          className="form-control mb-3"
          value={capital}
          onChange={(e) => setCapital(e.target.value)}
          placeholder="Capital (e.g., Sacramento)"
        />
        <select
          className="form-control mb-3"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          <option value="India">India</option>
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

// EditStateModal component
const EditStateModal: React.FC<{
  show: boolean
  onHide: () => void
  state: StateItem | null
  onEditState: (id: string, updatedData: Omit<StateItem, 'id' | 'alls' | 'starred' | 'label'>) => void
}> = ({ show, onHide, state, onEditState }) => {
  const [name, setName] = useState<string>(state?.name || '')
  const [code, setCode] = useState<string>(state?.code || '')
  const [capital, setCapital] = useState<string>(state?.details.capital || '')
  const [country, setCountry] = useState<string>(state?.country || '')

  useEffect(() => {
    if (state) {
      setName(state.name)
      setCode(state.code)
      setCapital(state.details.capital)
      setCountry(state.country)
    }
  }, [state])

  if (!show || !state) return null

  const handleEdit = () => {
    onEditState(state.id, {
      name,
      code,
      country,
      details: {
        capital,
      },
    })
    onHide()
  }

  return (
    <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="modal-content" style={{ background: 'white', padding: '20px', maxWidth: '500px', margin: '100px auto', borderRadius: '8px' }}>
        <h3>Edit State</h3>
        <input
          type="text"
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="State name"
        />
        <input
          type="text"
          className="form-control mb-3"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="State code"
        />
        <input
          type="text"
          className="form-control mb-3"
          value={capital}
          onChange={(e) => setCapital(e.target.value)}
          placeholder="Capital"
        />
        <select
          className="form-control mb-3"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          <option value="India">India</option>
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

const States: React.FC = () => {
  const [stateItems, setStateItems] = useState<StateItem[]>(initialStateItems)
  const [selectedCategory, setSelectedCategory] = useState<string>('alls')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredStates, setFilteredStates] = useState<StateItem[]>(stateItems)
  const [selectedState, setSelectedState] = useState<StateItem | null>(null)
  const [selectedStateIndex, setSelectedStateIndex] = useState<number>(-1)
  const [loading, setLoading] = useState<boolean>(false)
  const [showAddStateModal, setShowAddStateModal] = useState(false)
  const [showEditStateModal, setShowEditStateModal] = useState(false)
  const [sidebarLeftToggle, setSidebarLeftToggle] = useState<boolean>(false)
  const [sidebarMiniToggle, setSidebarMiniToggle] = useState<boolean>(false)
  const [containerToggle, setContainerToggle] = useState<boolean>(false)

  // Define columns for react-table with explicit widths
  const columns = React.useMemo<ColumnDef<StateItem>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Code',
        size: 100,
        cell: (info) => (
          <div className="avatar avatar-md rounded-circle bg-light text-muted">
            {info.getValue<string>()}
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'State',
        size: 200,
        cell: (info) => <h6 className="mb-1">{info.getValue<string>()}</h6>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleEditStateClick(row.original)}
              style={{ padding: '4px 8px' }}
            >
              <i className="fi fi-rr-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteState(row.original)}
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
    data: filteredStates,
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

  const handleAddState = useCallback((stateData: Omit<StateItem, 'id' | 'alls' | 'starred' | 'label'>) => {
    const regionToLabelMap: { [key: string]: { name: string; value: string; gradient: string } } = {
      'West': { name: 'West', value: 'west', gradient: 'success' },
      'South': { name: 'South', value: 'south', gradient: 'warning' },
      'Northeast': { name: 'Northeast', value: 'northeast', gradient: 'danger' },
      'Midwest': { name: 'Midwest', value: 'midwest', gradient: 'info' },
    }

    const newState: StateItem = {
      id: (stateItems.length + 1).toString(),
      name: stateData.name,
      code: stateData.code,
      country: stateData.country,
      details: {
        capital: stateData.details.capital,
      },
      alls: true,
      starred: false,
      label: regionToLabelMap[stateData.details.capital] || { name: 'Other', value: 'other', gradient: 'primary' },
    }

    const updatedStateItems = [...stateItems, newState]
    setStateItems(updatedStateItems)

    if (selectedCategory === 'alls' || newState[selectedCategory as keyof StateItem]) {
      setFilteredStates([...filteredStates, newState])
    }

    toast.success('State added successfully')
  }, [stateItems, filteredStates, selectedCategory])

  const handleEditState = useCallback((id: string, updatedData: Omit<StateItem, 'id' | 'alls' | 'starred' | 'label'>) => {
    const updatedStateItems = stateItems.map((item) =>
      item.id === id
        ? {
          ...item,
          name: updatedData.name,
          code: updatedData.code,
          country: updatedData.country,
          details: { capital: updatedData.details.capital },
        }
        : item
    )
    setStateItems(updatedStateItems)

    setFilteredStates((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            name: updatedData.name,
            code: updatedData.code,
            country: updatedData.country,
            details: { capital: updatedData.details.capital },
          }
          : item
      )
    )

    if (selectedState?.id === id) {
      setSelectedState({
        ...selectedState,
        name: updatedData.name,
        code: updatedData.code,
        country: updatedData.country,
        details: { capital: updatedData.details.capital },
      })
    }

    toast.success('State updated successfully')
  }, [stateItems, selectedState])

  const handleStarChange = useCallback((stateId: string, isStarred: boolean) => {
    const updatedStates = filteredStates.map((item) =>
      item.id === stateId ? { ...item, starred: isStarred } : item,
    )
    setFilteredStates(updatedStates)

    const updatedStateItems = stateItems.map((item) =>
      item.id === stateId ? { ...item, starred: isStarred } : item,
    )
    setStateItems(updatedStateItems)

    if (selectedState?.id === stateId) {
      setSelectedState({ ...selectedState, starred: isStarred })
    }
  }, [stateItems, filteredStates, selectedState])

  const categories: Category[] = useMemo(() => [
    {
      name: 'States',
      value: 'alls',
      icon: 'fi-rr-globe',
      badge: stateItems.length,
      badgeClassName: 'bg-primary-subtle text-primary',
    },
  ], [stateItems.length])

  const labels: Label[] = useMemo(() => [
    { name: 'West', value: 'west', gradient: 'success' },
    { name: 'South', value: 'south', gradient: 'warning' },
    { name: 'Northeast', value: 'northeast', gradient: 'danger' },
    { name: 'Midwest', value: 'midwest', gradient: 'info' },
  ], [])

  useEffect(() => {
    setFilteredStates(stateItems.filter((item) => item.alls))
  }, [stateItems])

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value)

      const filteredStatesByCategory = stateItems.filter(
        (item) => item[selectedCategory as keyof StateItem],
      )
      const filteredStatesBySearch = filteredStatesByCategory.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredStates(filteredStatesBySearch)
    }, 300),
    [stateItems, selectedCategory]
  )

  const handleCategoryChange = useCallback((categoryValue: string) => {
    setSelectedCategory(categoryValue)
    setSearchTerm('')

    if (labels.find((label) => label.value === categoryValue)) {
      setFilteredStates(
        stateItems.filter((item) => {
          if (typeof item.label === 'object') {
            return item.label.value === categoryValue
          } else {
            return item.label && item.label.includes(categoryValue)
          }
        }),
      )
    } else {
      setFilteredStates(stateItems.filter((item) => item[categoryValue as keyof StateItem]))
    }
  }, [stateItems, labels])

  const handleStateItemClick = useCallback((state: StateItem) => {
    setSelectedState(state)
    setContainerToggle(true)
  }, [])

  const handleEditStateClick = useCallback((state: StateItem) => {
    setSelectedState(state)
    setShowEditStateModal(true)
  }, [])

  const handleDeleteState = useCallback((state: StateItem) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this state!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3E97FF',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true)

        setTimeout(() => {
          const updatedStates = stateItems.filter((item) => item.id !== state.id)
          setStateItems(updatedStates)

          const filteredStatesByCategory = updatedStates.filter(
            (item) => item[selectedCategory as keyof StateItem],
          )

          setFilteredStates(filteredStatesByCategory)

          if (filteredStatesByCategory.length === 0) {
            setFilteredStates([])
          }
          if (selectedState?.id === state.id) {
            setSelectedState(null)
            setContainerToggle(false)
            setSidebarLeftToggle(false)
          }
          setLoading(false)
          toast.success('State deleted successfully')
        }, 1500)
      }
    })
  }, [stateItems, selectedCategory, selectedState])

  useEffect(() => {
    const index = filteredStates.findIndex(
      (state) => state.id === (selectedState?.id || ''),
    )
    setSelectedStateIndex(index)
  }, [filteredStates, selectedState])

  const handleNext = useCallback(() => {
    if (selectedStateIndex < filteredStates.length - 1) {
      const nextIndex = selectedStateIndex + 1
      setSelectedState(filteredStates[nextIndex])
      setContainerToggle(true)
    }
  }, [selectedStateIndex, filteredStates])

  const handlePrev = useCallback(() => {
    if (selectedStateIndex > 0) {
      const prevIndex = selectedStateIndex - 1
      setSelectedState(filteredStates[prevIndex])
      setContainerToggle(true)
    }
  }, [selectedStateIndex, filteredStates])

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
      <TitleHelmet title="States" />
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
                      className={selectedState?.id === row.original.id ? 'active' : ''}
                      onClick={() => handleStateItemClick(row.original)}
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
            ) : !selectedState ? (
              <Stack
                className="d-none d-lg-flex align-items-center justify-content-center flex-grow-1 h-100 mx-auto text-center"
                style={{ maxWidth: '320px' }}
              >
                <i className="fi fi-rr-globe fs-48 mb-6"></i>
                <h4 className="fw-bold">Select a state to view</h4>
                <p className="fs-15 fw-light text-muted mb-4">
                  Select a state from the left sidebar to view its details.
                </p>
                <Button
                  variant=""
                  className="btn-neutral"
                  onClick={() => setShowAddStateModal(true)}
                >
                  <i className="fi fi-br-plus fs-10"></i>
                  <span className="ms-2">Add New State</span>
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
                          setSelectedState(null)
                          setContainerToggle(false)
                          setSidebarLeftToggle(false)
                        }}
                      >
                        <i className="fi fi-rr-arrow-left"></i>
                      </button>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">States</h5>
                      
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
                        onClick={() => handleStarChange(selectedState.id, !selectedState.starred)}
                        style={{ padding: '8px', fontSize: '1.2rem' }}
                      >
                        <i className={`fi ${selectedState.starred ? 'fi-rr-star' : 'fi-rs-star'}`}></i>
                      </button>
                      <button
                        className="btn btn-icon btn-light"
                        onClick={handlePrev}
                        disabled={selectedStateIndex <= 0}
                        style={{ padding: '8px', fontSize: '1.2rem' }}
                      >
                        <i className="fi fi-rr-angle-left"></i>
                      </button>
                      <button
                        className="btn btn-icon btn-light"
                        onClick={handleNext}
                        disabled={selectedStateIndex >= filteredStates.length - 1}
                        style={{ padding: '8px', fontSize: '1.2rem' }}
                      >
                        <i className="fi fi-rr-angle-right"></i>
                      </button>
                      <button
                        className="btn btn-icon btn-light"
                        onClick={() => handleDeleteState(selectedState)}
                        style={{ padding: '8px', fontSize: '1.2rem' }}
                      >
                        <i className="fi fi-rr-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="apps-contact-details p-4">
                  <div className="mb-4">
                    <h5 className="mb-2">{selectedState.name}</h5>
                    <p className="text-muted mb-0">State Code: {selectedState.code}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-muted mb-2">Country:</p>
                    <p className="mb-0">{selectedState.country}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-muted mb-2">Capital:</p>
                    <p className="mb-0">{selectedState.details.capital}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="custom-backdrop" onClick={() => setSidebarMiniToggle(false)}></div>
      </Card>
      <AddStateModal
        show={showAddStateModal}
        onHide={() => setShowAddStateModal(false)}
        onAddState={handleAddState}
      />
      <EditStateModal
        show={showEditStateModal}
        onHide={() => setShowEditStateModal(false)}
        state={selectedState}
        onEditState={handleEditState}
      />
    </>
  )
}

export default React.memo(States)