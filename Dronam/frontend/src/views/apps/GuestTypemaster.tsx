// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import Swal from 'sweetalert2';
// import { toast } from 'react-hot-toast';
// import { Button, Card, Stack, Pagination, Table, Modal, Form } from 'react-bootstrap';
// import {
//   useReactTable,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getFilteredRowModel,
//   ColumnDef,
//   flexRender,
// } from '@tanstack/react-table';
// import { Preloader } from '@/components/Misc/Preloader';
// import { ContactSearchBar, ContactSidebar } from '@/components/Apps/Contact';
// import TitleHelmet from '@/components/Common/TitleHelmet';

// // Interfaces
// interface GuestTypeitem {
//   Guesttypeid: string;
//   GuestTypename: string;
// }

// interface Category {
//   name: string;
//   value: string;
//   icon: string;
//   badge?: number;
//   badgeClassName?: string;
// }

// interface Label {
//   name: string;
//   value: string;
//   gradient: string;
// }

// interface ModalProps {
//   show: boolean;
//   onHide: () => void;
//   onSuccess: () => void;
// }

// interface EditGuestTypeModalProps extends ModalProps {
//   GuestType: GuestTypeitem | null;
//   onUpdateSelectedGuestType: (GuestType: GuestTypeitem) => void;
// }

// // Utility Functions
// const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
//   let timeout: NodeJS.Timeout;
//   return (...args: Parameters<T>) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func(...args), wait);
//   };
// };

// // Main Component
// const GuestType: React.FC = () => {
//   const [GuestTypeitem, setGuestTypeItems] = useState<GuestTypeitem[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>('alls');
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filteredGuestTypes, setFilteredGuestTypes] = useState<GuestTypeitem[]>([]);
//   const [selectedGuestType, setSelectedGuestType] = useState<GuestTypeitem | null>(null);
//   const [selectedGuestTypeIndex, setSelectedGuestTypeIndex] = useState<number>(-1);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [sidebarLeftToggle, setSidebarLeftToggle] = useState<boolean>(false);
//   const [sidebarMiniToggle, setSidebarMiniToggle] = useState<boolean>(false);
//   const [containerToggle, setContainerToggle] = useState<boolean>(false);

//   // Fetch guest types from API
//   const fetchGuestTypes = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:3001/api/Guests');
//       const data = await res.json();
//       setGuestTypeItems(data);
//       setFilteredGuestTypes(data);
//     } catch {
//       toast.error('Failed to fetch guest types');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGuestTypes();
//   }, []);

//   // Table columns
//   const columns = useMemo<ColumnDef<GuestTypeitem>[]>(() => [
//     {
//       id: 'srNo',
//       header: 'Sr No',
//       size: 20,
//       cell: ({ row }) => <span>{row.index + 1}</span>,
//     },
//     {
//       accessorKey: 'GuestTypename',
//       header: 'GuestTypename',
//       size: 10,
//       cell: ({ getValue }) => (
//         <div>
//           {getValue<string>()}
//         </div>
//       ),
//     },
//     {
//       id: 'actions',
//       header: 'Actions',
//       size: 30,
//       cell: ({ row }) => (
//         <div className="d-flex gap-2">
//           <Button
//             size="sm"
//             variant="success"
//             onClick={() => setShowEditModal(true)}
//             style={{ padding: '4px 8px' }}
//           >
//             <i className="fi fi-rr-edit" />
//           </Button>
//           <Button
//             size="sm"
//             variant="danger"
//             onClick={() => handleDeleteGuestType(row.original)}
//             style={{ padding: '4px 8px' }}
//           >
//             <i className="fi fi-rr-trash" />
//           </Button>
//         </div>
//       ),
//     },
//   ], []);

//   // Initialize table
//   const table = useReactTable({
//     data: filteredGuestTypes,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     initialState: { pagination: { pageSize: 10 } },
//   });

//   // Sidebar categories and labels
//   const categories: Category[] = useMemo(
//     () => [
//       {
//         name: 'Guest Types',
//         value: 'alls',
//         icon: 'fi-rr-globe',
//         badge: GuestTypeitem.length,
//         badgeClassName: 'bg-primary-subtle text-primary',
//       },
//     ],
//     [GuestTypeitem.length]
//   );

//   const labels: Label[] = useMemo(
//     () => [
//       { name: 'North America', value: 'north_america', gradient: 'success' },
//       { name: 'Europe', value: 'europe', gradient: 'warning' },
//       { name: 'Asia', value: 'asia', gradient: 'danger' },
//       { name: 'Africa', value: 'africa', gradient: 'info' },
//     ],
//     []
//   );

//   // Search handler
//   const handleSearch = useCallback(
//     debounce((value: string) => {
//       setSearchTerm(value);
//       const filtered = GuestTypeitem.filter((item) =>
//         item.GuestTypename.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredGuestTypes(filtered);
//     }, 300),
//     [GuestTypeitem]
//   );

//   // Category change handler
//   const handleCategoryChange = useCallback(
//     (categoryValue: string) => {
//       setSelectedCategory(categoryValue);
//       setSearchTerm('');
//       setFilteredGuestTypes(GuestTypeitem);
//     },
//     [GuestTypeitem]
//   );

//   // Guest type selection handler
//   const handleGuestTypeItemClick = useCallback((GuestType: GuestTypeitem) => {
//     setSelectedGuestType(GuestType);
//     setContainerToggle(true);
//   }, []);

//   // Delete guest type handler
//   const handleDeleteGuestType = async (GuestType: GuestTypeitem) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'You will not be able to recover this Guest Type!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3E97FF',
//       confirmButtonText: 'Yes, delete it!',
//     });

//     if (result.isConfirmed) {
//       try {
//         await fetch(`http://localhost:3001/api/Guests/${GuestType.Guesttypeid}`, { method: 'DELETE' });
//         toast.success('Deleted successfully');
//         fetchGuestTypes();
//         setSelectedGuestType(null);
//       } catch {
//         toast.error('Failed to delete');
//       }
//     }
//   };

//   // Update selected guest type index
//   useEffect(() => {
//     const index = filteredGuestTypes.findIndex((GuestType) => GuestType.Guesttypeid === selectedGuestType?.Guesttypeid);
//     setSelectedGuestTypeIndex(index);
//   }, [filteredGuestTypes, selectedGuestType]);

//   // Navigation handlers
//   const handleNext = useCallback(() => {
//     if (selectedGuestTypeIndex < filteredGuestTypes.length - 1) {
//       setSelectedGuestType(filteredGuestTypes[selectedGuestTypeIndex + 1]);
//       setContainerToggle(true);
//     }
//   }, [selectedGuestTypeIndex, filteredGuestTypes]);

//   const handlePrev = useCallback(() => {
//     if (selectedGuestTypeIndex > 0) {
//       setSelectedGuestType(filteredGuestTypes[selectedGuestTypeIndex - 1]);
//       setContainerToggle(true);
//     }
//   }, [selectedGuestTypeIndex, filteredGuestTypes]);

//   // Card classes
//   const cardClasses = useMemo(() => {
//     const classes = ['apps-card'];
//     if (sidebarMiniToggle) classes.push('apps-sidebar-mini-toggle');
//     if (containerToggle) classes.push('apps-container-toggle');
//     if (sidebarLeftToggle) classes.push('apps-sidebar-left-toggle');
//     return classes.join(' ');
//   }, [sidebarMiniToggle, containerToggle, sidebarLeftToggle]);

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth <= 991.98 && sidebarLeftToggle) {
//         setSidebarLeftToggle(false);
//       }
//     };
//     window.addEventListener('resize', handleResize);
//     handleResize();
//     return () => window.removeEventListener('resize', handleResize);
//   }, [sidebarLeftToggle]);

//   const handleMenuClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation();
//     setSidebarLeftToggle((prev) => !prev);
//   }, []);

//   return (
//     <>
//       <TitleHelmet title="Guest Types" />
//       <style>
//         {`
//           .apps-card,
//           .apps-sidebar-left,
//           .apps-container {
//             transition: all 0.3s ease-in-out;
//           }
//         `}
//       </style>
//       <Card className={cardClasses}>
//         <div className="apps-sidebar-mini w-70">
//           <ContactSidebar
//             categories={categories}
//             labels={labels}
//             selectedCategory={selectedCategory}
//             handleCategoryChange={handleCategoryChange}
//             setSidebarMiniToggle={setSidebarMiniToggle}
//           />
//         </div>
//         <div className="apps-sidebar apps-sidebar-left apps-sidebar-md" style={{ minWidth: '450px' }}>
//           <ContactSearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
//           <div className="apps-sidebar-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: '250px' }}>
//             <Table responsive size="sm" className="mb-0" style={{ minWidth: '300px' }}>
//               <thead>
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <tr key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => (
//                       <th key={header.id} style={{ width: header.column.columnDef.size }}>
//                         {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>
//               <tbody>
//                 {table.getRowModel().rows.map((row) => (
//                   <tr
//                     key={row.id}
//                     className={selectedGuestType?.Guesttypeid === row.original.Guesttypeid ? 'active' : ''}
//                     onClick={() => handleGuestTypeItemClick(row.original)}
//                   >
//                     {row.getVisibleCells().map((cell) => (
//                       <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//             <Stack className="p-2 border-top d-flex flex-row align-items-center justify-content-between" style={{ gap: '6px', padding: '8px 12px' }}>
//               <select
//                 value={table.getState().pagination.pageSize}
//                 onChange={(e) => table.setPageSize(Number(e.target.value))}
//                 style={{ border: '1px solid #0d6efd', borderRadius: '4px', padding: '2px 4px', fontSize: '12px', backgroundColor: '#fff', color: '#6c757d', cursor: 'pointer', width: '100px', height: '30px' }}
//               >
//                 {[10, 20, 30].map((pageSize) => (
//                   <option key={pageSize} value={pageSize}>
//                     {pageSize}
//                   </option>
//                 ))}
//               </select>
//               <Pagination className="m-0" style={{ display: 'flex', alignItems: 'center', gap: '3px', marginRight: '20px' }}>
//                 <Pagination.Prev
//                   onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 1)}
//                   disabled={table.getState().pagination.pageIndex === 0}
//                   style={{ border: '1px solid #e5e7eb', color: table.getState().pagination.pageIndex === 0 ? '#d3d3d3' : '#6c757d', padding: '2px 4px', borderRadius: '4px', backgroundColor: 'transparent', fontSize: '12px', lineHeight: '1' }}
//                 >
//                   <i className="fi fi-rr-angle-left" style={{ fontSize: '12px' }} />
//                 </Pagination.Prev>
//                 <Pagination.Item
//                   active
//                   style={{ backgroundColor: '#0d6efd', border: '1px solid #0d6efd', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', lineHeight: '1', minWidth: '24px', textAlign: 'center' }}
//                 >
//                   {table.getState().pagination.pageIndex + 1}
//                 </Pagination.Item>
//                 <Pagination.Next
//                   onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 1)}
//                   disabled={table.getState().pagination.pageIndex === table.getPageCount() - 1}
//                   style={{ border: '1px solid #e5e7eb', color: table.getState().pagination.pageIndex === table.getPageCount() - 1 ? '#d3d3d3' : '#6c757d', padding: '2px 4px', borderRadius: '4px', backgroundColor: 'transparent', fontSize: '12px', lineHeight: '1' }}
//                 >
//                   <i className="fi fi-rr-angle-right" style={{ fontSize: '12px' }} />
//                 </Pagination.Next>
//               </Pagination>
//             </Stack>
//           </div>
//         </div>
//         <div className={`apps-container ${containerToggle ? 'w-full' : ''}`}>
//           <div className="apps-container-inner" style={{ minHeight: '100vh' }}>
//             {loading ? (
//               <Stack className="align-items-center justify-content-center h-100">
//                 <Preloader />
//               </Stack>
//             ) : !selectedGuestType ? (
//               <Stack className="d-none d-lg-flex align-items-center justify-content-center flex-grow-1 h-100 mx-auto text-center" style={{ maxWidth: '420px' }}>
//                 <i className="fi fi-rr-globe fs-48 mb-6" />
//                 <h4 className="fw-bold">Select a Guest Type to view</h4>
//                 <p className="fs-15 fw-light text-muted mb-4">Select a Guest Type from the left sidebar to view its details.</p>
//                 <Button variant="neutral" onClick={() => setShowAddModal(true)}>
//                   <i className="fi fi-br-plus fs-10" />
//                   <span className="ms-2">Add New Guest Type</span>
//                 </Button>
//               </Stack>
//             ) : (
//               <div>
//                 <div className="apps-contact-details-header p-3 border-bottom">
//                   <div className="d-flex align-items-center justify-content-between">
//                     <div className="d-flex align-items-center">
//                       <Button
//                         variant="light"
//                         size="sm"
//                         className="btn-icon me-3"
//                         onClick={() => {
//                           setSelectedGuestType(null);
//                           setContainerToggle(false);
//                           setSidebarLeftToggle(false);
//                         }}
//                       >
//                         <i className="fi fi-rr-arrow-left" />
//                       </Button>
//                       <h5 className="mb-1">Guest Type</h5>
//                     </div>
//                     <div className="d-flex gap-2">
//                       <Button variant="light" className="btn-icon" onClick={handleMenuClick} style={{ padding: '8px', fontSize: '1.2rem' }}>
//                         <i className="fi fi-rr-menu-burger" />
//                       </Button>
//                       <Button variant="light" className="btn-icon" onClick={handlePrev} disabled={selectedGuestTypeIndex <= 0} style={{ padding: '8px', fontSize: '1.2rem' }}>
//                         <i className="fi fi-rr-angle-left" />
//                       </Button>
//                       <Button variant="light" className="btn-icon" onClick={handleNext} disabled={selectedGuestTypeIndex >= filteredGuestTypes.length - 1} style={{ padding: '8px', fontSize: '1.2rem' }}>
//                         <i className="fi fi-rr-angle-right" />
//                       </Button>
//                       <Button variant="light" className="btn-icon" onClick={() => handleDeleteGuestType(selectedGuestType)} style={{ padding: '8px', fontSize: '1.2rem' }}>
//                         <i className="fi fi-rr-trash" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="apps-contact-details p-4">
//                   <div className="mb-4">
//                     <p className="text-muted mb-0">Guest Type: {selectedGuestType.GuestTypename}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="custom-backdrop" onClick={() => setSidebarMiniToggle(false)} />
//       </Card>
//       <AddGuestTypeModal show={showAddModal} onHide={() => setShowAddModal(false)} onSuccess={fetchGuestTypes} />
//       <EditGuestTypeModal
//         show={showEditModal}
//         onHide={() => setShowEditModal(false)}
//         GuestType={selectedGuestType}
//         onSuccess={fetchGuestTypes}
//         onUpdateSelectedGuestType={setSelectedGuestType}
//       />
//     </>
//   );
// };

// // Add Guest Type Modal
// const AddGuestTypeModal: React.FC<ModalProps> = ({ show, onHide, onSuccess }) => {
//   const [GuestTypename, setGuestTypename] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleAdd = async () => {
//     if (!GuestTypename) {
//       toast.error('All fields are required');
//       return;
//     }

//     setLoading(true);
//     try {
//      const statusValue = status === 'Active' ? 0 : 1;
//       const currentDate = new Date().toISOString(); // Timestamp: e.g., 2025-07-05T11:03:00.000Z
//       const payload = {
//         GuestTypename,
//         created_by_id: '2', // Default to "2" (string)
//         created_date: currentDate,
//         status: statusValue // Default to 0 (Active)
//       };
//       console.log('Sending to backend:', payload); // Debug log
//       const res = await fetch('http://localhost:3001/api/Guests', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       if (res.ok) {
//         toast.success('Guest Type added successfully');
//         setGuestTypename('');
//         onSuccess();
//         onHide();
//       } else {
//         toast.error('Failed to add Guest Type');
//       }
//     } catch {
//       toast.error('Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide}>
//       <Modal.Header closeButton>
//         <Modal.Title>Add Guest Type</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form.Group className="mb-3">
//           <Form.Label>GuestTypename</Form.Label>
//           <Form.Control type="text" value={GuestTypename} onChange={(e) => setGuestTypename(e.target.value)} style={{ borderColor: '#ccc' }} />
//         </Form.Group>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide} disabled={loading}>
//           Cancel
//         </Button>
//         <Button variant="primary" onClick={handleAdd} disabled={loading}>
//           {loading ? 'Adding...' : 'Add Guest Type'}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// // Edit Guest Type Modal
// const EditGuestTypeModal: React.FC<EditGuestTypeModalProps> = ({ show, onHide, GuestType, onSuccess, onUpdateSelectedGuestType }) => {
//   const [GuestTypenameName, setGuestTypenameName] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (GuestType) {
//       setGuestTypenameName(GuestType.GuestTypename);
//     }
//   }, [GuestType]);

//   const handleEdit = async () => {
//     if (!GuestTypenameName || !GuestType) {
//       toast.error('All fields are required');
//       return;
//     }

//     setLoading(true);
//     try {
//     const statusValue = status === 'Active' ? 0 : 1;
//       const currentDate = new Date().toISOString(); // Timestamp: e.g., 2025-07-05T11:03:00.000Z
//       const payload = {
//         GuestTypename: GuestTypenameName,
//         updated_by_id: '2', // Default to "2" (string)
//         updated_date: currentDate,
//         status: statusValue // Default to 0 (Active)
//       };
//       console.log('Sending to backend:', payload); // Debug log
//       const res = await fetch(`http://localhost:3001/api/Guests/${GuestType.Guesttypeid}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       if (res.ok) {
//         toast.success('Guest Type updated successfully');
//         onSuccess();
//         onUpdateSelectedGuestType({ ...GuestType, GuestTypename: GuestTypenameName });
//         onHide();
//       } else {
//         toast.error('Failed to update Guest Type');
//       }
//     } catch {
//       toast.error('Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide}>
//       <Modal.Header closeButton>
//         <Modal.Title>Edit Guest Type</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form.Group className="mb-3">
//           <Form.Label>GuestTypename</Form.Label>
//           <Form.Control type="text" value={GuestTypenameName} onChange={(e) => setGuestTypenameName(e.target.value)} style={{ borderColor: '#ccc' }} />
//         </Form.Group>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide} disabled={loading}>
//           Cancel
//         </Button>
//         <Button variant="primary" onClick={handleEdit} disabled={loading}>
//           {loading ? 'Updating...' : 'Update Guest Type'}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default GuestType;





// 




import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { Button, Card, Stack, Pagination, Table, Modal, Form } from 'react-bootstrap';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Preloader } from '@/components/Misc/Preloader';
import { ContactSearchBar, ContactSidebar } from '@/components/Apps/Contact';
import TitleHelmet from '@/components/Common/TitleHelmet';

// Interfaces
interface GuestItem {
  guesttypeid: string;
  guest_type: string;
  status: number;
  created_by_id: string;
  created_date: string;
  updated_by_id: string;
  updated_date: string;
}

interface Category {
  name: string;
  value: string;
  icon: string;
  badge?: number;
  badgeClassName?: string;
}

interface Label {
  name: string;
  value: string;
  gradient: string;
}

interface ModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

interface EditNewspaperModalProps extends ModalProps {
  guest: GuestItem | null;
  onUpdateSelectedGuest: (guest: GuestItem) => void;
}

// Utility Functions
const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Main Component
const GuestMaster: React.FC = () => {
  const [guestItems, setGuestItems] = useState<GuestItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('alls');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredGuests, setFilteredGuests] = useState<GuestItem[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<GuestItem | null>(null);
  const [selectedGuestIndex, setSelectedGuestIndex] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sidebarLeftToggle, setSidebarLeftToggle] = useState<boolean>(false);
  const [sidebarMiniToggle, setSidebarMiniToggle] = useState<boolean>(false);
  const [containerToggle, setContainerToggle] = useState<boolean>(false);

  // Fetch newspapers from API
  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/Guests');
      const data = await res.json();
      setGuestItems(data);
      setFilteredGuests(data);
    } catch {
      toast.error('Failed to fetch Guest');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  // Table columns
  const columns = useMemo<ColumnDef<GuestItem>[]>(() => [
    {
      id: 'srNo',
      header: 'Sr No',
      size: 20,
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      accessorKey: 'guest_type',
      header: 'GuestType',
      size: 10,
      cell: ({ getValue }) => <h6 className="mb-1">{getValue<string>()}</h6>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 80,
      cell: (info) => {
        const statusValue = info.getValue<string | number>();
        console.log('Status value:', statusValue, typeof statusValue); // Debug log
        return <div style={{ textAlign: 'center' }}>{statusValue == '0' || statusValue === 0 ? 'Active' : 'Inactive'}</div>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 30,
      cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Button
            size="sm"
            variant="success"
            onClick={() => setShowEditModal(true)}
            style={{ padding: '4px 8px' }}
          >
            <i className="fi fi-rr-edit" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDeleteGuest(row.original)}
            style={{ padding: '4px 8px' }}
          >
            <i className="fi fi-rr-trash" />
          </Button>
        </div>
      ),
    },
  ], []);

  // Initialize table
  const table = useReactTable({
    data: filteredGuests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  // Sidebar categories and labels
  const categories: Category[] = useMemo(
    () => [
      {
        name: 'Newspapers',
        value: 'alls',
        icon: 'fi-rr-globe',
        badge: guestItems.length,
        badgeClassName: 'bg-primary-subtle text-primary',
      },
    ],
    [guestItems.length]
  );

  const labels: Label[] = useMemo(
    () => [
      { name: 'North America', value: 'north_america', gradient: 'success' },
      { name: 'Europe', value: 'europe', gradient: 'warning' },
      { name: 'Asia', value: 'asia', gradient: 'danger' },
      { name: 'Africa', value: 'africa', gradient: 'info' },
    ],
    []
  );

  // Search handler
  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      const filtered = guestItems.filter((item) =>
        item.guest_type.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredGuests(filtered);
    }, 300),
    [guestItems]
  );

  // Category change handler
  const handleCategoryChange = useCallback(
    (categoryValue: string) => {
      setSelectedCategory(categoryValue);
      setSearchTerm('');
      setFilteredGuests(guestItems);
    },
    [guestItems]
  );

  // Newspaper selection handler
  const handleGuestItemClick = useCallback((guest: GuestItem) => {
    setSelectedGuest(guest);
    setContainerToggle(true);
  }, []);

  // Delete newspaper handler
  const handleDeleteGuest = async (guest: GuestItem) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Guest!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3E97FF',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await fetch(`http://localhost:3001/api/Guests/${guest.guesttypeid}`, { method: 'DELETE' });
        toast.success('Deleted successfully');
        fetchGuests();
        setSelectedGuest(null);
      } catch {
        toast.error('Failed to delete');
      }
    }
  };

  // Update selected newspaper index
  useEffect(() => {
    const index = filteredGuests.findIndex((guest) => guest.guesttypeid === selectedGuest?.guesttypeid);
    setSelectedGuestIndex(index);
  }, [filteredGuests, selectedGuest]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (selectedGuestIndex < filteredGuests.length - 1) {
      setSelectedGuest(filteredGuests[selectedGuestIndex + 1]);
      setContainerToggle(true);
    }
  }, [selectedGuestIndex, filteredGuests]);

  const handlePrev = useCallback(() => {
    if (selectedGuestIndex > 0) {
      setSelectedGuest(filteredGuests[selectedGuestIndex - 1]);
      setContainerToggle(true);
    }
  }, [selectedGuestIndex, filteredGuests]);

  // Card classes
  const cardClasses = useMemo(() => {
    const classes = ['apps-card'];
    if (sidebarMiniToggle) classes.push('apps-sidebar-mini-toggle');
    if (containerToggle) classes.push('apps-container-toggle');
    if (sidebarLeftToggle) classes.push('apps-sidebar-left-toggle');
    return classes.join(' ');
  }, [sidebarMiniToggle, containerToggle, sidebarLeftToggle]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 991.98 && sidebarLeftToggle) {
        setSidebarLeftToggle(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarLeftToggle]);

  const handleMenuClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSidebarLeftToggle((prev) => !prev);
  }, []);

  return (
    <>
      <TitleHelmet title="Newspapers" />
      <style>
        {`
          .apps-card,
          .apps-sidebar-left,
          .apps-container {
            transition: all 0.3s ease-in-out;
          }
        `}
      </style>
      <Card className={cardClasses}>
        <div className="apps-sidebar-mini w-70">
          <ContactSidebar
            categories={categories}
            labels={labels}
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
            setSidebarMiniToggle={setSidebarMiniToggle}
          />
        </div>
        <div className="apps-sidebar apps-sidebar-left apps-sidebar-md" style={{ minWidth: '500px' }}>
          <ContactSearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
          <div className="apps-sidebar-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: '250px' }}>
            <Table responsive size="sm" className="mb-0" style={{ minWidth: '300px' }}>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} style={{ width: header.column.columnDef.size }}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={selectedGuest?.guesttypeid === row.original.guesttypeid ? 'active' : ''}
                    onClick={() => handleGuestItemClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
            <Stack className="p-2 border-top d-flex flex-row align-items-center justify-content-between" style={{ gap: '6px', padding: '8px 12px' }}>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                style={{ border: '1px solid #0d6efd', borderRadius: '4px', padding: '2px 4px', fontSize: '12px', backgroundColor: '#fff', color: '#6c757d', cursor: 'pointer', width: '100px', height: '30px' }}
              >
                {[10, 20, 30].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <Pagination className="m-0" style={{ display: 'flex', alignItems: 'center', gap: '3px', marginRight: '20px' }}>
                <Pagination.Prev
                  onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 1)}
                  disabled={table.getState().pagination.pageIndex === 0}
                  style={{ border: '1px solid #e5e7eb', color: table.getState().pagination.pageIndex === 0 ? '#d3d3d3' : '#6c757d', padding: '2px 4px', borderRadius: '4px', backgroundColor: 'transparent', fontSize: '12px', lineHeight: '1' }}
                >
                  <i className="fi fi-rr-angle-left" style={{ fontSize: '12px' }} />
                </Pagination.Prev>
                <Pagination.Item
                  active
                  style={{ backgroundColor: '#0d6efd', border: '1px solid #0d6efd', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', lineHeight: '1', minWidth: '24px', textAlign: 'center' }}
                >
                  {table.getState().pagination.pageIndex + 1}
                </Pagination.Item>
                <Pagination.Next
                  onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 1)}
                  disabled={table.getState().pagination.pageIndex === table.getPageCount() - 1}
                  style={{ border: '1px solid #e5e7eb', color: table.getState().pagination.pageIndex === table.getPageCount() - 1 ? '#d3d3d3' : '#6c757d', padding: '2px 4px', borderRadius: '4px', backgroundColor: 'transparent', fontSize: '12px', lineHeight: '1' }}
                >
                  <i className="fi fi-rr-angle-right" style={{ fontSize: '12px' }} />
                </Pagination.Next>
              </Pagination>
            </Stack>
          </div>
        </div>
        <div className={`apps-container ${containerToggle ? 'w-full' : ''}`}>
          <div className="apps-container-inner" style={{ minHeight: '100vh' }}>
            {loading ? (
              <Stack className="align-items-center justify-content-center h-100">
                <Preloader />
              </Stack>
            ) : !selectedGuest ? (
              <Stack className="d-none d-lg-flex align-items-center justify-content-center flex-grow-1 h-100 mx-auto text-center" style={{ maxWidth: '420px' }}>
                <i className="fi fi-rr-globe fs-48 mb-6" />
                <h4 className="fw-bold">Select a Guest to view</h4>
                <p className="fs-15 fw-light text-muted mb-4">Select a Guest from the left sidebar to view its details.</p>
                <Button variant="neutral" onClick={() => setShowAddModal(true)}>
                  <i className="fi fi-br-plus fs-10" />
                  <span className="ms-2">Add New Guest</span>
                </Button>
              </Stack>
            ) : (
              <div>
                <div className="apps-contact-details-header p-3 border-bottom">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <Button
                        variant="light"
                        size="sm"
                        className="btn-icon me-3"
                        onClick={() => {
                          setSelectedGuest(null);
                          setContainerToggle(false);
                          setSidebarLeftToggle(false);
                        }}
                      >
                        <i className="fi fi-rr-arrow-left" />
                      </Button>
                      <h5 className="mb-1">Guest</h5>
                    </div>
                    <div className="d-flex gap-2">
                      <Button variant="light" className="btn-icon" onClick={handleMenuClick} style={{ padding: '8px', fontSize: '1.2rem' }}>
                        <i className="fi fi-rr-menu-burger" />
                      </Button>
                      <Button variant="light" className="btn-icon" onClick={handlePrev} disabled={selectedGuestIndex <= 0} style={{ padding: '8px', fontSize: '1.2rem' }}>
                        <i className="fi fi-rr-angle-left" />
                      </Button>
                      <Button variant="light" className="btn-icon" onClick={handleNext} disabled={selectedGuestIndex >= filteredGuests.length - 1} style={{ padding: '8px', fontSize: '1.2rem' }}>
                        <i className="fi fi-rr-angle-right" />
                      </Button>
                      <Button variant="light" className="btn-icon" onClick={() => handleDeleteGuest(selectedGuest)} style={{ padding: '8px', fontSize: '1.2rem' }}>
                        <i className="fi fi-rr-trash" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="apps-contact-details p-4">
                  <div className="mb-4">
                    <p className="text-muted mb-0">Guest type:{selectedGuest.guest_type}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="custom-backdrop" onClick={() => setSidebarMiniToggle(false)} />
      </Card>
      <AddNewspaperModal show={showAddModal} onHide={() => setShowAddModal(false)} onSuccess={fetchGuests} />
      <EditNewspaperModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        guest={selectedGuest}
        onSuccess={fetchGuests}
        onUpdateSelectedGuest={setSelectedGuest}
      />
    </>
  );
};

// Add Newspaper Modal
const AddNewspaperModal: React.FC<ModalProps> = ({ show, onHide, onSuccess }) => {
  const [guest_type, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Active'); // Default to 'Active'

  const handleAdd = async () => {
    if (!guest_type || !status) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const statusValue = status === 'Active' ? 0 : 1;
      const currentDate = new Date().toISOString(); // Timestamp: e.g., 2025-07-01T04:00:00.000Z
      const payload = {
       guest_type,
        status: statusValue,
        created_by_id: 1, // Default to null (or 0 if backend requires)
        created_date: currentDate,
      };
      console.log('Sending to backend:', payload); // Debug log
      const res = await fetch('http://localhost:3001/api/Guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success('Guest added successfully');
        setName('');
        setStatus('Active'); // Reset to 'Active' after successful add
        onSuccess();
        onHide();
      } else {
        toast.error('Failed to add Guest');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add GuestType</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>GuestType</Form.Label>
          <Form.Control type="text" value={guest_type} onChange={(e) => setName(e.target.value)} style={{ borderColor: '#ccc' }} />
        </Form.Group>
         <Form.Group className="mb-3">
                    <div className="col-md-12">
            <label className="form-label">Status <span style={{ color: 'red' }}>*</span></label>
            <select
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAdd} disabled={loading}>
          {loading ? 'Adding...' : 'Add Guest'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Edit Newspaper Modal
const EditNewspaperModal: React.FC<EditNewspaperModalProps> = ({ show, onHide, guest, onSuccess, onUpdateSelectedGuest}) => {
  const [guest_type, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  

  useEffect(() => {
    if (guest) {
      setName(guest.guest_type);
      setStatus(String(guest.status) === '0' ? 'Active' : 'Inactive');
      console.log('Edit newspaper status:', guest.status, typeof guest.status); // Debug log
    }
  }, [guest]);

  const handleEdit = async () => {
    if (!guest_type || !status || !guest) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
       const statusValue = status === 'Active' ? 0 : 1;
      const currentDate = new Date().toISOString(); // Timestamp: e.g., 2025-07-01T04:51:00.000Z
      const payload = {
        guest_type,
        status: statusValue,
        guesttypeid: guest.guesttypeid, // Ensure this is included
        updated_by_id: '2', // Default to "0" (string)
        updated_date: currentDate,
      };
      console.log('Sending to backend:', payload); // Debug log
      const res = await fetch(`http://localhost:3001/api/Guests/${guest.guesttypeid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success('Guest type updated successfully');
        onSuccess();
        onUpdateSelectedGuest({ ...guest, guest_type});
        onHide();
      } else {
        toast.error('Failed to update Guest type');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Guest type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Guest type Name</Form.Label>
          <Form.Control type="text" value={guest_type} onChange={(e) => setName(e.target.value)} style={{ borderColor: '#ccc' }} />
        </Form.Group>
         <Form.Group className="mb-3">
         <div className="col-md-12">
            <label className="form-label">Status <span style={{ color: 'red' }}>*</span></label>
            <select
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleEdit} disabled={loading}>
          {loading ? 'Updating...' : 'Update Guest type'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GuestMaster;