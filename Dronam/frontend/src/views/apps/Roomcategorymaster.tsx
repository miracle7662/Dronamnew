
// import React, { useState, useRef } from 'react';
// import { Table, Button, Form, Pagination } from 'react-bootstrap';
// import { FaEdit, FaTrash } from 'react-icons/fa';
// import { toast } from 'react-hot-toast';

// type RoomCategory = {
//   categoryName: string;
//   printName: string;
//   displayName: string;
//   departmentName: string;
//   applyDate: string;
//   displaySeq: string;
//   totalRooms: string;
//   maxLimit: string;
//   hotelId: string;
//   departmentId: string;
// };

// const hotelOptions = [
//   { id: 'H001', name: 'Hotel Taj' },
//   { id: 'H002', name: 'Hotel Oberoi' },
//   { id: 'H003', name: 'Hotel Marriott' }
// ];

// const departmentOptions = [
//   { id: 'D001', name: 'Front Office' },
//   { id: 'D002', name: 'Housekeeping' },
//   { id: 'D003', name: 'F&B Service' }
// ];

// const initialCategories: RoomCategory[] = [
//   {
//     categoryName: 'Deluxe',
//     printName: 'DLX',
//     displayName: 'Deluxe Room',
//     departmentName: 'Front Office',
//     applyDate: '2024-01-01',
//     displaySeq: '1',
//     totalRooms: '20',
//     maxLimit: '4',
//     hotelId: 'H001',
//     departmentId: 'D001'
//   },
//   {
//     categoryName: 'Standard',
//     printName: 'STD',
//     displayName: 'Standard Room',
//     departmentName: 'Housekeeping',
//     applyDate: '2024-01-01',
//     displaySeq: '2',
//     totalRooms: '40',
//     maxLimit: '3',
//     hotelId: 'H002',
//     departmentId: 'D002'
//   }
// ];

// const inputFields = [
//   'categoryName', 'printName', 'displayName', 'departmentName', 'applyDate',
//   'displaySeq', 'totalRooms', 'maxLimit'
// ];

// // Add/Edit Room Category Modal Component
// const RoomCategoryModal: React.FC<{
//   show: boolean;
//   onHide: () => void;
//   category: RoomCategory | null;
//   onSave: (categoryData: RoomCategory) => void;
//   isEditing: boolean;
// }> = ({ show, onHide, category, onSave, isEditing }) => {
//   const formRefs = useRef<Record<string, any>>({});
//   const [selectedHotelId, setSelectedHotelId] = useState(category?.hotelId || '');
//   const [selectedDepartmentId, setSelectedDepartmentId] = useState(category?.departmentId || '');

//   if (!show) return null;

//   const handleSave = () => {
//     const newCategory: RoomCategory = {
//       ...(inputFields.reduce((acc, field) => {
//         acc[field] = formRefs.current[field]?.value || '';
//         return acc;
//       }, {} as any)),
//       hotelId: selectedHotelId,
//       departmentId: selectedDepartmentId
//     };

//     if (!newCategory.categoryName.trim()) {
//       toast.error('Category Name is required');
//       return;
//     }

//     onSave(newCategory);
//     onHide();
//   };

//   return (
//     <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
//       <div className="modal-content" style={{  padding: '20px', maxWidth: '800px', margin: '100px auto', borderRadius: '8px' }}>
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="mb-0">{isEditing ? 'Edit Category' : 'Add Category'}</h5>
//           <button className="btn-close" onClick={onHide}></button>
//         </div>
//         <div className="row mb-3">
//           {inputFields.map((field) => (
//             <div className="col-md-6 mb-3" key={field}>
//               <label className="form-label text-capitalize">
//                 {field.replace(/([A-Z])/g, ' $1').trim()} {field === 'categoryName' ? <span style={{ color: 'red' }}>*</span> : null}
//               </label>
//               <input
//                 type={field === 'applyDate' ? 'date' : 'text'}
//                 className="form-control"
//                 defaultValue={category ? (category as any)[field] : ''}
//                 placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim()}`}
//                 ref={(el) => (formRefs.current[field] = el)}
//               />
//             </div>
//           ))}
//           <div className="col-md-6 mb-3">
//             <label className="form-label">Hotel ID <span style={{ color: 'red' }}>*</span></label>
//             <select
//               className="form-control"
//               value={selectedHotelId}
//               onChange={(e) => setSelectedHotelId(e.target.value)}
//             >
//               <option value="">Select Hotel</option>
//               {hotelOptions.map((hotel) => (
//                 <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
//               ))}
//             </select>
//           </div>
//           <div className="col-md-6 mb-3">
//             <label className="form-label">Department ID <span style={{ color: 'red' }}>*</span></label>
//             <select
//               className="form-control"
//               value={selectedDepartmentId}
//               onChange={(e) => setSelectedDepartmentId(e.target.value)}
//             >
//               <option value="">Select Department</option>
//               {departmentOptions.map((dept) => (
//                 <option key={dept.id} value={dept.id}>{dept.name}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//         <div className="d-flex justify-content-end mt-4">
//           <button className="btn btn-success me-2" onClick={handleSave}>{isEditing ? 'Save' : 'Create'}</button>
//           <button className="btn btn-danger" onClick={onHide}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Delete Room Category Modal Component
// const DeleteRoomCategoryModal: React.FC<{
//   show: boolean;
//   onHide: () => void;
//   onConfirm: () => void;
// }> = ({ show, onHide, onConfirm }) => {
//   if (!show) return null;

//   return (
//     <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
//       <div className="modal-content" style={{  padding: '20px', maxWidth: '600px', margin: '100px auto', borderRadius: '8px' }}>
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="mb-0">Delete Category</h5>
//           <button className="btn-close" onClick={onHide}></button>
//         </div>
//         <p>Are you sure you want to delete this category?</p>
//         <div className="d-flex justify-content-end">
//           <button className="btn btn-danger me-2" onClick={onConfirm}>Yes, Delete</button>
//           <button className="btn btn-secondary" onClick={onHide}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main RoomCategoryMaster Component
// const RoomCategoryMaster: React.FC = () => {
//   const [categories, setCategories] = useState<RoomCategory[]>(initialCategories);
//   const [showCategoryModal, setShowCategoryModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<RoomCategory | null>(null);
//   const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
//   const [search, setSearch] = useState('');
//   const [pageIndex, setPageIndex] = useState(0);
//   const [pageSize, setPageSize] = useState(10);

//   const handleSaveCategory = (categoryData: RoomCategory) => {
//     if (editingCategory) {
//       setCategories(categories.map((category, index) => (index === categories.indexOf(editingCategory) ? categoryData : category)));
//       toast.success('Category updated successfully');
//     } else {
//       setCategories([...categories, categoryData]);
//       toast.success('Category added successfully');
//     }
//   };

//   const handleDeleteCategory = () => {
//     if (deleteIndex !== null) {
//       setCategories(categories.filter((_, i) => i !== deleteIndex));
//       toast.success('Category deleted successfully');
//     }
//     setShowDeleteModal(false);
//     setDeleteIndex(null);
//   };

//   const openModal = (category?: RoomCategory, index?: number) => {
//     setEditingCategory(category || null);
//     setShowCategoryModal(true);
//   };

//   const filtered = categories.filter((r) =>
//     r.categoryName.toLowerCase().includes(search.toLowerCase())
//   );
//   const totalPages = Math.ceil(filtered.length / pageSize);
//   const paginated = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

//   return (
//     <div className="container mt-4" style={{ minHeight: '90vh' }}>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Form.Control
//           type="text"
//           placeholder="Search by Category Name"
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPageIndex(0);
//           }}
//           style={{ maxWidth: '300px', border: '1px solid #6c757d', borderRadius: '0.25rem' }}
//         />
//         <Button variant="success" onClick={() => openModal()}>
//           <i className="bi bi-plus"></i> Add Category
//         </Button>
//       </div>

//       <div className="table-responsive flex-grow-1" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
//         <Table size="sm" striped bordered hover>
//           <thead>
//             <tr>
//               <th>Sr No</th>
//               <th>Category Name</th>
//               <th>Display Name</th>
//               <th>Department</th>
//               <th>Total Rooms</th>
//               <th style={{width: '100px'}}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginated.map((r, index) => (
//               <tr key={index}>
//                 <td>{pageIndex * pageSize + index + 1}</td>
//                 <td>{r.categoryName}</td>
//                 <td>{r.displayName}</td>
//                 <td>{r.departmentName}</td>
//                 <td>{r.totalRooms}</td>
//                 <td>
//                   <Button
//                     variant="success"
//                     size="sm"
//                     onClick={() => openModal(r, pageIndex * pageSize + index)}
//                     className="me-2"
//                   >
//                     <FaEdit />
//                   </Button>
//                   <Button
//                     variant="danger"
//                     size="sm"
//                     onClick={() => {
//                       setDeleteIndex(pageIndex * pageSize + index);
//                       setShowDeleteModal(true);
//                     }}
//                   >
//                     <FaTrash />
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>

//       <div className="d-flex justify-content-between align-items-center pt-3 border-top sticky-bottom px-3">
//         <Form.Select
//           value={pageSize}
//           onChange={(e) => {
//             setPageSize(Number(e.target.value));
//             setPageIndex(0);
//           }}
//           style={{ width: '100px' }}
//         >
//           {[5, 10, 20, 50].map((size) => (
//             <option key={size} value={size}>{size}</option>
//           ))}
//         </Form.Select>
//         <Pagination className="mb-0">
//           <Pagination.Prev
//             onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
//             disabled={pageIndex === 0}
//           />
//           {Array.from({ length: totalPages }, (_, i) => (
//             <Pagination.Item
//               key={i}
//               active={i === pageIndex}
//               onClick={() => setPageIndex(i)}
//             >
//               {i + 1}
//             </Pagination.Item>
//           ))}
//           <Pagination.Next
//             onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))}
//             disabled={pageIndex >= totalPages - 1}
//           />
//         </Pagination>
//       </div>

//       <RoomCategoryModal
//         show={showCategoryModal}
//         onHide={() => setShowCategoryModal(false)}
//         category={editingCategory}
//         onSave={handleSaveCategory}
//         isEditing={!!editingCategory}
//       />
//       <DeleteRoomCategoryModal
//         show={showDeleteModal}
//         onHide={() => setShowDeleteModal(false)}
//         onConfirm={handleDeleteCategory}
//       />
//     </div>
//   );
// };

// export default RoomCategoryMaster;      


// import React, { useState, useRef } from 'react';
// import { Table, Button, Form, Pagination } from 'react-bootstrap';
// import { FaEdit, FaTrash } from 'react-icons/fa';
// import { toast } from 'react-hot-toast';

// type RoomCategory = {
//   categoryName: string;
//   printName: string;
//   displayName: string;
//   departmentName: string;
//   applyDate: string;
//   displaySeq: string;
//   totalRooms: string;
//   maxLimit: string;
//   hotelId: string;
//   departmentId: string;
// };

// const hotelOptions = [
//   { id: 'H001', name: 'Hotel Taj' },
//   { id: 'H002', name: 'Hotel Oberoi' },
//   { id: 'H003', name: 'Hotel Marriott' }
// ];

// const departmentOptions = [
//   { id: 'D001', name: 'Front Office' },
//   { id: 'D002', name: 'Housekeeping' },
//   { id: 'D003', name: 'F&B Service' }
// ];

// const initialCategories: RoomCategory[] = [
//   {
//     categoryName: 'Deluxe',
//     printName: 'DLX',
//     displayName: 'Deluxe Room',
//     departmentName: 'Front Office',
//     applyDate: '2024-01-01',
//     displaySeq: '1',
//     totalRooms: '20',
//     maxLimit: '4',
//     hotelId: 'H001',
//     departmentId: 'D001'
//   },
//   {
//     categoryName: 'Standard',
//     printName: 'STD',
//     displayName: 'Standard Room',
//     departmentName: 'Housekeeping',
//     applyDate: '2024-01-01',
//     displaySeq: '2',
//     totalRooms: '40',
//     maxLimit: '3',
//     hotelId: 'H002',
//     departmentId: 'D002'
//   }
// ];

// const inputFields = [
//   'CategoryName', 'PrintName', 'DisplayName', 'DepartmentName', 'ApplyDate',
//   'DisplaySeq', 'TotalRooms', 'MaxLimit'
// ];

// const RoomCategoryModal: React.FC<{
//   show: boolean;
//   onHide: () => void;
//   category: RoomCategory | null;
//   onSave: (categoryData: RoomCategory) => void;
//   isEditing: boolean;
// }> = ({ show, onHide, category, onSave, isEditing }) => {
//   const formRefs = useRef<Record<string, any>>({});
//   const [selectedHotelId, setSelectedHotelId] = useState(category?.hotelId || '');
//   const [selectedDepartmentId, setSelectedDepartmentId] = useState(category?.departmentId || '');

//   if (!show) return null;

//   const handleSave = () => {
//     const newCategory: RoomCategory = {
//       ...(inputFields.reduce((acc, field) => {
//         acc[field] = formRefs.current[field]?.value || '';
//         return acc;
//       }, {} as any)),
//       hotelId: selectedHotelId,
//       departmentId: selectedDepartmentId
//     };

//     if (!newCategory.categoryName.trim()) {
//       toast.error('Category Name is required');
//       return;
//     }

//     onSave(newCategory);
//     onHide();
//   };

//   return (
//     <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
//       <div className="modal-content" style={{ padding: '20px', maxWidth: '800px', margin: '100px auto', borderRadius: '8px' }}>
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="mb-0">{isEditing ? 'Edit Category' : 'Add Category'}</h5>
//           <button className="btn-close" onClick={onHide}></button>
//         </div>
//         <div className="row mb-3">
//           {inputFields.map((field) => (
//             <div className="col-md-6 mb-3" key={field}>
//               <div className="d-flex align-items-center">
//                 <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
//                   {field.replace(/([A-Z])/g, ' $1').trim()} {field === 'categoryName' ? <span className="text-danger">*</span> : null}
//                 </label>
//                 <input
//                   type={field === 'applyDate' ? 'date' : 'text'}
//                   className="form-control flex-grow-1"
//                   defaultValue={category ? (category as any)[field] : ''}
//                   placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim()}`}
//                   ref={(el) => (formRefs.current[field] = el)}
//                   style={{border:'0.5px solid lightgray'}}
//                 />
//               </div>
//             </div>
//           ))}
//           <div className="col-md-6 mb-3">
//             <div className="d-flex align-items-center">
//               <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
//                 Hotel ID <span className="text-danger">*</span>
//               </label>
//               <select
//                 style={{border:'0.5px solid lightgray'}}
//                 className="form-control flex-grow-1"
//                 value={selectedHotelId}
//                 onChange={(e) => setSelectedHotelId(e.target.value)}
//               >
//                 <option value="">Select Hotel</option>
//                 {hotelOptions.map((hotel) => (
//                   <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="col-md-6 mb-3">
//             <div className="d-flex align-items-center">
//               <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
//                 Department ID <span className="text-danger">*</span>
//               </label>
//               <select
//                 style={{border:'0.5px solid lightgray'}}
//                 className="form-control flex-grow-1"
//                 value={selectedDepartmentId}
//                 onChange={(e) => setSelectedDepartmentId(e.target.value)}
//               >
//                 <option value="">Select Department</option>
//                 {departmentOptions.map((dept) => (
//                   <option key={dept.id} value={dept.id}>{dept.name}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//         <div className="d-flex justify-content-end mt-4">
//           <button className="btn btn-success me-2" onClick={handleSave}>{isEditing ? 'Save' : 'Create'}</button>
//           <button className="btn btn-danger" onClick={onHide}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DeleteRoomCategoryModal: React.FC<{
//   show: boolean;
//   onHide: () => void;
//   onConfirm: () => void;
// }> = ({ show, onHide, onConfirm }) => {
//   if (!show) return null;

//   return (
//     <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
//       <div className="modal-content" style={{ padding: '20px', maxWidth: '600px', margin: '100px auto', borderRadius: '8px' }}>
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="mb-0">Delete Category</h5>
//           <button className="btn-close" onClick={onHide}></button>
//         </div>
//         <p>Are you sure you want to delete this category?</p>
//         <div className="d-flex justify-content-end">
//           <button className="btn btn-danger me-2" onClick={onConfirm}>Yes, Delete</button>
//           <button className="btn btn-secondary" onClick={onHide}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const RoomCategoryMaster: React.FC = () => {
//   const [categories, setCategories] = useState<RoomCategory[]>(initialCategories);
//   const [showCategoryModal, setShowCategoryModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<RoomCategory | null>(null);
//   const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
//   const [search, setSearch] = useState('');
//   const [pageIndex, setPageIndex] = useState(0);
//   const [pageSize, setPageSize] = useState(10);

//   const handleSaveCategory = (categoryData: RoomCategory) => {
//     if (editingCategory) {
//       setCategories(categories.map((category, index) => 
//         index === categories.indexOf(editingCategory) ? categoryData : category
//       ));
//       toast.success('Category updated successfully');
//     } else {
//       setCategories([...categories, categoryData]);
//       toast.success('Category added successfully');
//     }
//   };

//   const handleDeleteCategory = () => {
//     if (deleteIndex !== null) {
//       setCategories(categories.filter((_, i) => i !== deleteIndex));
//       toast.success('Category deleted successfully');
//     }
//     setShowDeleteModal(false);
//     setDeleteIndex(null);
//   };

//   const openModal = (category?: RoomCategory, index?: number) => {
//     setEditingCategory(category || null);
//     setShowCategoryModal(true);
//   };

//   const filtered = categories.filter((r) =>
//     r.categoryName.toLowerCase().includes(search.toLowerCase())
//   );
//   const totalPages = Math.ceil(filtered.length / pageSize);
//   const paginated = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

//   return (
//     <div className="container mt-4" style={{ minHeight: '90vh' }}>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <Form.Control
//           type="text"
//           placeholder="Search by Category Name"
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPageIndex(0);
//           }}
//           style={{ maxWidth: '300px', border: '1px solid #6c757d', borderRadius: '0.25rem' }}
//         />
//         <Button variant="success" onClick={() => openModal()}>
//           <i className="bi bi-plus"></i> Add Category
//         </Button>
//       </div>

//       <div className="table-responsive flex-grow-1" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
//         <Table size="sm" striped bordered hover>
//           <thead>
//             <tr>
//               <th>Sr No</th>
//               <th>Category Name</th>
//               <th>Display Name</th>
//               <th>Department</th>
//               <th>Total Rooms</th>
//               <th style={{ width: '100px' }}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginated.map((r, index) => (
//               <tr key={index}>
//                 <td>{pageIndex * pageSize + index + 1}</td>
//                 <td>{r.categoryName}</td>
//                 <td>{r.displayName}</td>
//                 <td>{r.departmentName}</td>
//                 <td>{r.totalRooms}</td>
//                 <td>
//                   <Button
//                     variant="success"
//                     size="sm"
//                     onClick={() => openModal(r, pageIndex * pageSize + index)}
//                     className="me-2"
//                   >
//                     <FaEdit />
//                   </Button>
//                   <Button
//                     variant="danger"
//                     size="sm"
//                     onClick={() => {
//                       setDeleteIndex(pageIndex * pageSize + index);
//                       setShowDeleteModal(true);
//                     }}
//                   >
//                     <FaTrash />
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>

//       <div className="d-flex justify-content-between align-items-center pt-3 border-top sticky-bottom px-3">
//         <Form.Select
//           value={pageSize}
//           onChange={(e) => {
//             setPageSize(Number(e.target.value));
//             setPageIndex(0);
//           }}
//           style={{ width: '120px' }}
//         >
//           {[5, 10, 20, 50].map((size) => (
//             <option key={size} value={size}>{size}</option>
//           ))}
//         </Form.Select>
//         <Pagination className="mb-0">
//           <Pagination.Prev
//             onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
//             disabled={pageIndex === 0}
//           />
//           {Array.from({ length: totalPages }, (_, i) => (
//             <Pagination.Item
//               key={i}
//               active={i === pageIndex}
//               onClick={() => setPageIndex(i)}
//             >
//               {i + 1}
//             </Pagination.Item>
//           ))}
//           <Pagination.Next
//             onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))}
//             disabled={pageIndex >= totalPages - 1}
//           />
//         </Pagination>
//       </div>

//       <RoomCategoryModal
//         show={showCategoryModal}
//         onHide={() => setShowCategoryModal(false)}
//         category={editingCategory}
//         onSave={handleSaveCategory}
//         isEditing={!!editingCategory}
//       />
//       <DeleteRoomCategoryModal
//         show={showDeleteModal}
//         onHide={() => setShowDeleteModal(false)}
//         onConfirm={handleDeleteCategory}
//       />
//     </div>
//   );
// };

// export default RoomCategoryMaster;





import React, { useState, useRef } from 'react';
import { Table, Button, Form, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

type RoomCategory = {
  categoryName: string;
  printName: string;
  displayName: string;
  departmentName: string;
  applyDate: string;
  displaySeq: string;
  totalRooms: string;
  maxLimit: string;
  hotelId: string;
  departmentId: string;
};

const hotelOptions = [
  { id: 'H001', name: 'Hotel Taj' },
  { id: 'H002', name: 'Hotel Oberoi' },
  { id: 'H003', name: 'Hotel Marriott' }
];

const departmentOptions = [
  { id: 'D001', name: 'Front Office' },
  { id: 'D002', name: 'Housekeeping' },
  { id: 'D003', name: 'F&B Service' }
];

const initialCategories: RoomCategory[] = [
  {
    categoryName: 'Deluxe',
    printName: 'DLX',
    displayName: 'Deluxe Room',
    departmentName: 'Front Office',
    applyDate: '2024-01-01',
    displaySeq: '1',
    totalRooms: '20',
    maxLimit: '4',
    hotelId: 'H001',
    departmentId: 'D001'
  },
  {
    categoryName: 'Standard',
    printName: 'STD',
    displayName: 'Standard Room',
    departmentName: 'Housekeeping',
    applyDate: '2024-01-01',
    displaySeq: '2',
    totalRooms: '40',
    maxLimit: '3',
    hotelId: 'H002',
    departmentId: 'D002'
  }
];

const RoomCategoryModal: React.FC<{
  show: boolean;
  onHide: () => void;
  category: RoomCategory | null;
  onSave: (categoryData: RoomCategory) => void;
  isEditing: boolean;
}> = ({ show, onHide, category, onSave, isEditing }) => {
  const formRefs = useRef<Record<string, any>>({});
  const [selectedHotelId, setSelectedHotelId] = useState(category?.hotelId || '');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(category?.departmentId || '');
  const [applyDate, setApplyDate] = useState(category?.applyDate || '');

  if (!show) return null;

  const handleSave = () => {
    const newCategory: RoomCategory = {
      categoryName: formRefs.current['categoryName']?.value || '',
      printName: formRefs.current['printName']?.value || '',
      displayName: formRefs.current['displayName']?.value || '',
      departmentName: formRefs.current['departmentName']?.value || '',
      applyDate: applyDate,
      displaySeq: formRefs.current['displaySeq']?.value || '',
      totalRooms: formRefs.current['totalRooms']?.value || '',
      maxLimit: formRefs.current['maxLimit']?.value || '',
      hotelId: selectedHotelId,
      departmentId: selectedDepartmentId
    };

    if (!newCategory.categoryName.trim()) {
      toast.error('Category Name is required');
      return;
    }

    onSave(newCategory);
    onHide();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApplyDate(e.target.value);
  };

  return (
    <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="modal-content" style={{ padding: '20px', maxWidth: '900px', margin: '100px auto', borderRadius: '8px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{isEditing ? 'Edit Category' : 'Add Category'}</h5>
          <button className="btn-close" onClick={onHide}></button>
        </div>
        <div className="row mb-3">
          {/* Left Column */}
          <div className="col-md-6">
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Category Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                defaultValue={category?.categoryName || ''}
                placeholder="Enter Category Name"
                ref={(el) => (formRefs.current['categoryName'] = el)}
                style={{border:'0.5px solid lightgray'}}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Print Name
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                defaultValue={category?.printName || ''}
                placeholder="Enter Print Name"
                ref={(el) => (formRefs.current['printName'] = el)}
                style={{border:'0.5px solid lightgray'}}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Display Name
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                defaultValue={category?.displayName || ''}
                placeholder="Enter Display Name"
                ref={(el) => (formRefs.current['displayName'] = el)}
                style={{border:'0.5px solid lightgray'}}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Apply Date
              </label>
              <input
                type="date"
                className="form-control flex-grow-1"
                value={applyDate}
                onChange={handleDateChange}
                style={{border:'0.5px solid lightgray'}}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Department Name
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                defaultValue={category?.departmentName || ''}
                placeholder="Enter Department Name"
                ref={(el) => (formRefs.current['departmentName'] = el)}
                style={{border:'0.5px solid lightgray'}}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Display Seq
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                defaultValue={category?.displaySeq || ''}
                placeholder="Enter Display Sequence"
                ref={(el) => (formRefs.current['displaySeq'] = el)}
                style={{border:'0.5px solid lightgray'}}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Total Rooms
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                defaultValue={category?.totalRooms || ''}
                placeholder="Enter Total Rooms"
                ref={(el) => (formRefs.current['totalRooms'] = el)}
                style={{border:'0.5px solid lightgray'}}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Max Limit
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                defaultValue={category?.maxLimit || ''}
                placeholder="Enter Max Limit"
                ref={(el) => (formRefs.current['maxLimit'] = el)}
                style={{border:'0.5px solid lightgray'}}
              />
            </div>
          </div>

          {/* Bottom Row - Full Width */}
          <div className="col-12">
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                    Hotel ID <span className="text-danger">*</span>
                  </label>
                  <select
                    style={{border:'0.5px solid lightgray'}}
                    className="form-control flex-grow-1"
                    value={selectedHotelId}
                    onChange={(e) => setSelectedHotelId(e.target.value)}
                  >
                    <option value="">Select Hotel</option>
                    {hotelOptions.map((hotel) => (
                      <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                    Department ID <span className="text-danger">*</span>
                  </label>
                  <select
                    style={{border:'0.5px solid lightgray'}}
                    className="form-control flex-grow-1"
                    value={selectedDepartmentId}
                    onChange={(e) => setSelectedDepartmentId(e.target.value)}
                  >
                    <option value="">Select Department</option>
                    {departmentOptions.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-success me-2" onClick={handleSave}>{isEditing ? 'Save' : 'Create'}</button>
          <button className="btn btn-danger" onClick={onHide}>Close</button>
        </div>
      </div>
    </div>
  );
};

const DeleteRoomCategoryModal: React.FC<{
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}> = ({ show, onHide, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="modal-content" style={{ padding: '20px', maxWidth: '600px', margin: '100px auto', borderRadius: '8px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Delete Category</h5>
          <button className="btn-close" onClick={onHide}></button>
        </div>
        <p>Are you sure you want to delete this category?</p>
        <div className="d-flex justify-content-end">
          <button className="btn btn-danger me-2" onClick={onConfirm}>Yes, Delete</button>
          <button className="btn btn-secondary" onClick={onHide}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const RoomCategoryMaster: React.FC = () => {
  const [categories, setCategories] = useState<RoomCategory[]>(initialCategories);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<RoomCategory | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleSaveCategory = (categoryData: RoomCategory) => {
    if (editingCategory) {
      setCategories(categories.map((category, index) => 
        index === categories.indexOf(editingCategory) ? categoryData : category
      ));
      toast.success('Category updated successfully');
    } else {
      setCategories([...categories, categoryData]);
      toast.success('Category added successfully');
    }
  };

  const handleDeleteCategory = () => {
    if (deleteIndex !== null) {
      setCategories(categories.filter((_, i) => i !== deleteIndex));
      toast.success('Category deleted successfully');
    }
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  const openModal = (category?: RoomCategory, index?: number) => {
    setEditingCategory(category || null);
    setShowCategoryModal(true);
  };

  const filtered = categories.filter((r) =>
    r.categoryName.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  return (
    <div className="container mt-4" style={{ minHeight: '90vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Search by Category Name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPageIndex(0);
          }}
          style={{ maxWidth: '300px', border: '1px solid #6c757d', borderRadius: '0.25rem' }}
        />
        <Button variant="success" onClick={() => openModal()}>
          <i className="bi bi-plus"></i> Add Category
        </Button>
      </div>

      <div className="table-responsive flex-grow-1" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <Table size="sm" striped bordered hover>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Category Name</th>
              <th>Display Name</th>
              <th>Department</th>
              <th>Total Rooms</th>
              <th style={{ width: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((r, index) => (
              <tr key={index}>
                <td>{pageIndex * pageSize + index + 1}</td>
                <td>{r.categoryName}</td>
                <td>{r.displayName}</td>
                <td>{r.departmentName}</td>
                <td>{r.totalRooms}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => openModal(r, pageIndex * pageSize + index)}
                    className="me-2"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setDeleteIndex(pageIndex * pageSize + index);
                      setShowDeleteModal(true);
                    }}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="d-flex justify-content-between align-items-center pt-3 border-top sticky-bottom px-3">
        <Form.Select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPageIndex(0);
          }}
          style={{ width: '120px' }}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </Form.Select>
        <Pagination className="mb-0">
          <Pagination.Prev
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
            disabled={pageIndex === 0}
          />
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item
              key={i}
              active={i === pageIndex}
              onClick={() => setPageIndex(i)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={pageIndex >= totalPages - 1}
          />
        </Pagination>
      </div>

      <RoomCategoryModal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        category={editingCategory}
        onSave={handleSaveCategory}
        isEditing={!!editingCategory}
      />
      <DeleteRoomCategoryModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
};

export default RoomCategoryMaster;