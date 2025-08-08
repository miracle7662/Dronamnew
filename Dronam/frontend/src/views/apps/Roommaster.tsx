import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { Preloader } from '@/components/Misc/Preloader';
import { Button, Card, Stack, Table } from 'react-bootstrap';
import TitleHelmet from '@/components/Common/TitleHelmet';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import Select, { MultiValue } from 'react-select';
import {
  fetchBlocks,
  fetchFloors,
  fetchFeatures,
  BlockItem,
  FloorItem,
  FeatureItem,
} from '@/utils/commonfunction';

interface RoomItem {
  room_id: number;
  room_no: string;
  room_name: string;
  display_name: string;
  category_id: string;
  room_ext_no: string;
  room_status: string;
  department_id: string;
  blockid: string;
  block_name: string;
  floorid: string;
  feature_list: string;
  hotel_id: string;
  created_by_id: string;
  created_date: string;
  updated_by_id: string;
  updated_date: string;
}

interface AddRoomModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

interface EditRoomModalProps {
  show: boolean;
  onHide: () => void;
  room: RoomItem | null;
  onSuccess: () => void;
  onUpdateSelectedRoom: (room: RoomItem) => void;
}

interface Option {
  value: string;
  label: string;
}

const hotelOptions = [
  { id: 'Hotel A' },
  { id: 'Hotel B' },
  { id: 'Hotel C' },
];

const categoryOptions = [
  { id: 'Deluxe' },
  { id: 'Standard' },
  { id: 'Executive' },
];

// Debounce utility function
const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Main RoomMaster Component
const RoomMaster: React.FC = () => {
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredRooms, setFilteredRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/rooms');
      if (!res.ok) throw new Error('Failed to fetch rooms');
      const data = await res.json();
      console.log('Fetched Rooms:', data);
      setRooms(data);
      setFilteredRooms(data);
    } catch (err) {
      toast.error('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const columns = useMemo<ColumnDef<RoomItem>[]>(
    () => [
      {
        id: 'srNo',
        header: 'Sr No',
        size: 50,
        cell: ({ row }) => <div style={{ textAlign: 'center' }}>{row.index + 1}</div>,
      },
      {
        accessorKey: 'room_no',
        header: 'Room No',
        size: 100,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        accessorKey: 'room_name',
        header: 'Room Name',
        size: 150,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        accessorKey: 'block_name',
        header: 'Block Name',
        size: 150,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        accessorKey: 'floor_name',
        header: 'Floor Name',
        size: 150,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        accessorKey: 'feature_list',
        header: 'Feature List',
        size: 200,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        accessorKey: 'room_status',
        header: 'Room Status',
        size: 100,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        id: 'actions',
        header: () => <div style={{ textAlign: 'center' }}>Action</div>,
        size: 150,
        cell: ({ row }) => (
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleEditClick(row.original)}
              title="Edit Room"
            >
              <i className="fi fi-rr-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteRoom(row.original)}
              title="Delete Room"
            >
              <i className="fi fi-rr-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredRooms,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      const filteredRoomsBySearch = rooms.filter((item) =>
        item.room_no.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRooms(filteredRoomsBySearch);
    }, 300),
    [rooms]
  );

  const handleEditClick = (room: RoomItem) => {
    setSelectedRoom(room);
    setShowEditModal(true);
  };

  const handleDeleteRoom = async (room: RoomItem) => {
    const res = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this room!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3E97FF',
      confirmButtonText: 'Yes, delete it!',
    });
    if (res.isConfirmed) {
      try {
        await fetch(`http://localhost:3001/api/rooms/${room.room_id}`, { method: 'DELETE' });
        toast.success('Room deleted successfully');
        fetchRooms();
        setSelectedRoom(null);
      } catch {
        toast.error('Failed to delete room');
      }
    }
  };

  // AddRoomModal Component
  const AddRoomModal: React.FC<AddRoomModalProps> = ({ show, onHide, onSuccess }) => {
    const [room_no, setRoomNo] = useState('');
    const [room_name, setRoomName] = useState('');
    const [display_name, setDisplayName] = useState('');
    const [department_id, setDepartmentId] = useState('');
    const [category_id, setCategoryId] = useState('');
    const [floor_name, setFloorname] = useState('');
    const [blockid, setblockid] = useState<number | null>(null);
    const [room_ext_no, setExtNo] = useState('');
    const [room_status, setRoomStatus] = useState('');
    const [hotel_id, setHotelId] = useState('');
    const [selectedFeatures, setSelectedFeatures] = useState<MultiValue<Option>>([]);
    const [loading, setLoading] = useState(false);
    const [Floors, setFloors] = useState<FloorItem[]>([]);
    const [floorid, setfloorid] = useState<number | null>(null);
    const [Blocks, setBlocks] = useState<BlockItem[]>([]);
    const [FeatureItem, setFeatures] = useState<FeatureItem[]>([]);
    const [featureid, setFeatureid] = useState<number | null>(null);

    useEffect(() => {
      fetchBlocks(setBlocks, setblockid);
      fetchFloors(setFloors, setfloorid);
      fetchFeatures(setFeatures, setFeatureid);
    }, []);

    const featureOptions: Option[] = FeatureItem.filter((feature) => String(feature.status) === '0').map((feature) => ({
      value: feature.feature_name,
      label: feature.feature_name,
    }));

    const handleFeatureChange = (selected: MultiValue<Option>) => {
      setSelectedFeatures(selected);
    };

    const handleAdd = async () => {
      if (!room_no || !category_id || !room_status || !hotel_id || selectedFeatures.length === 0) {
        toast.error('Required fields: Room No, Category, Room Status, Hotel, and at least one Feature');
        return;
      }

      setLoading(true);
      try {
        const currentDate = new Date().toISOString();
        const payload = {
          room_no,
          room_name,
          display_name,
          department_id,
          category_id,
          floorid: floorid?.toString() || '',
          blockid: blockid?.toString() || '',
          room_ext_no,
          room_status,
          hotel_id,
          feature_list: selectedFeatures.map((option) => option.value).join(', '),
          created_by_id: '1',
          created_date: currentDate,
        };
        console.log('Sending to backend:', payload);
        const res = await fetch('http://localhost:3001/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success('Room added successfully');
          setRoomNo('');
          setRoomName('');
          setDisplayName('');
          setDepartmentId('');
          setCategoryId('');
          setFloorname('');
          setblockid(null);
          setfloorid(null);
          setExtNo('');
          setRoomStatus('');
          setHotelId('');
          setSelectedFeatures([]);
          onSuccess();
          onHide();
        } else {
          const errorData = await res.json();
          console.log('Backend error:', errorData);
          toast.error('Failed to add room');
        }
      } catch (err) {
        console.error('Add room error:', err);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (!show) return null;

    return (
      <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        <div className="modal-content" style={{ padding: '20px', maxWidth: '1000px', margin: '100px auto', borderRadius: '8px' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Add Room</h5>
            <button className="btn-close" onClick={onHide}></button>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Room No <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  value={room_no}
                  onChange={(e) => setRoomNo(e.target.value)}
                  placeholder="Enter Room No"
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Room Name
                </label>
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  value={room_name}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter Room Name"
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Display Name
                </label>
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  value={display_name}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter Display Name"
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Room Category <span className="text-danger">*</span>
                </label>
                <select
                  className="form-control flex-grow-1"
                  value={category_id}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.id}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Room Ext No
                </label>
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  value={room_ext_no}
                  onChange={(e) => setExtNo(e.target.value)}
                  placeholder="Enter Room Ext No"
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Room Status <span className="text-danger">*</span>
                </label>
                <select
                  className="form-control flex-grow-1"
                  value={room_status}
                  onChange={(e) => setRoomStatus(e.target.value)}
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                >
                  <option value="">Select Status</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Department Name
                </label>
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  value={department_id}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  placeholder="Enter Department Name"
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Block Name
                </label>
                <select
                  className="form-control"
                  value={blockid ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setblockid(value === '' ? null : Number(value));
                  }}
                  disabled={loading}
                >
                  <option value="">Select a Block</option>
                  {Blocks.filter((block) => String(block.status) === '0').map((block) => (
                    <option key={block.blockid} value={block.blockid}>
                      {block.block_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Floor Name
                </label>
                <select
                  className="form-control"
                  value={floorid ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setfloorid(value === '' ? null : Number(value));
                  }}
                  disabled={loading}
                >
                  <option value="">Select a Floor</option>
                  {Floors.filter((floor) => String(floor.status) === '0').map((floor) => (
                    <option key={floor.floorid} value={floor.floorid}>
                      {floor.floor_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Feature List <span className="text-danger">*</span>
                </label>
                <div className="flex-grow-1">
                  <Select
                    options={featureOptions}
                    isMulti
                    onChange={handleFeatureChange}
                    value={selectedFeatures}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select Features"
                    isDisabled={loading}
                  />
                </div>
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Hotel Name <span className="text-danger">*</span>
                </label>
                <select
                  className="form-control flex-grow-1"
                  value={hotel_id}
                  onChange={(e) => setHotelId(e.target.value)}
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                >
                  <option value="">Select Hotel</option>
                  {hotelOptions.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-danger me-2" onClick={onHide} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={handleAdd} disabled={loading}>
              Create
            </button>
          </div>
        </div>
      </div>
    );
  };

  // EditRoomModal Component
  const EditRoomModal: React.FC<EditRoomModalProps> = ({ show, onHide, room, onSuccess, onUpdateSelectedRoom }) => {
    const [room_no, setRoomNo] = useState('');
    const [room_name, setRoomName] = useState('');
    const [display_name, setDisplayName] = useState('');
    const [department_id, setDepartmentId] = useState('');
    const [category_id, setCategoryId] = useState('');
    const [room_ext_no, setExtNo] = useState('');
    const [room_status, setRoomStatus] = useState('');
    const [hotel_id, setHotelId] = useState('');
    const [selectedFeatures, setSelectedFeatures] = useState<MultiValue<Option>>([]);
    const [loading, setLoading] = useState(false);
    const [Floors, setFloors] = useState<FloorItem[]>([]);
    const [floorid, setfloorid] = useState<number | null>(null);
    const [blockid, setblockid] = useState<number | null>(null);
    const [Blocks, setBlocks] = useState<BlockItem[]>([]);
    const [FeatureItem, setFeatures] = useState<FeatureItem[]>([]);
    const [featureid, setFeatureid] = useState<number | null>(null);

    useEffect(() => {
      fetchBlocks(setBlocks, setblockid).catch((err) => console.error('Failed to fetch blocks:', err));
      fetchFloors(setFloors, setfloorid).catch((err) => console.error('Failed to fetch floors:', err));
      fetchFeatures(setFeatures, setFeatureid).catch((err) => console.error('Failed to fetch features:', err));
    }, []);

    const featureOptions: Option[] = FeatureItem.filter((feature) => String(feature.status) === '0').map((feature) => ({
      value: feature.feature_name,
      label: feature.feature_name,
    }));

    const handleFeatureChange = (selected: MultiValue<Option>) => {
      setSelectedFeatures(selected);
    };

    useEffect(() => {
      if (room) {
        setRoomNo(room.room_no || '');
        setRoomName(room.room_name || '');
        setDisplayName(room.display_name || '');
        setDepartmentId(room.department_id || '');
        setCategoryId(room.category_id || '');
        setExtNo(room.room_ext_no || '');
        setRoomStatus(room.room_status || '');
        setHotelId(room.hotel_id || '');
        setSelectedFeatures(
          room.feature_list
            ? room.feature_list.split(', ').map((feature) => ({
                value: feature,
                label: feature,
              }))
            : []
        );
        setblockid(room.blockid ? Number(room.blockid) : null);
        setfloorid(room.floorid ? Number(room.floorid) : null);
      }
    }, [room]);

    const handleEdit = async () => {
      if (!room_no || !category_id || !room_status || !hotel_id || selectedFeatures.length === 0) {
        toast.error('Required fields: Room No, Category, Room Status, Hotel, and at least one Feature');
        return;
      }

      setLoading(true);
      try {
        const currentDate = new Date().toISOString();
        const payload = {
          room_no,
          room_name,
          display_name,
          department_id,
          category_id,
          floorid: floorid?.toString() || '',
          blockid: blockid?.toString() || '',
          room_ext_no,
          room_status,
          hotel_id,
          feature_list: selectedFeatures.map((option) => option.value).join(', '),
          room_id: room?.room_id,
          updated_by_id: '2',
          updated_date: currentDate,
        };
        console.log('Sending to backend:', payload);
        const res = await fetch(`http://localhost:3001/api/rooms/${room?.room_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success('Room updated successfully');
          onSuccess();
          const updatedRoom = {
            ...room,
            ...payload,
            room_id: room?.room_id ?? 0,
            blockid: blockid?.toString() || '',
            floorid: floorid?.toString() || '',
            created_by_id: room?.created_by_id || '',
          };
          onUpdateSelectedRoom(updatedRoom as RoomItem);
          onHide();
        } else {
          const errorData = await res.json();
          console.log('Backend error:', errorData);
          toast.error('Failed to update room');
        }
      } catch (err) {
        console.error('Edit room error:', err);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (!show || !room) return null;

    return (
      <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        <div className="modal-content" style={{ padding: '20px', maxWidth: '900px', margin: '100px auto', borderRadius: '8px' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Edit Room</h5>
            <button className="btn-close" onClick={onHide}></button>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Room No <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  value={room_no}
                  onChange={(e) => setRoomNo(e.target.value)}
                  placeholder="Enter Room No"
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Room Name
                </label>
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  value={room_name}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter Room Name"
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Display Name
                </label>
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  value={display_name}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter Display Name"
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Room Category <span className="text-danger">*</span>
                </label>
                <select
                  className="form-control flex-grow-1"
                  value={category_id}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.id}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Room Ext No
                </label>
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  value={room_ext_no}
                  onChange={(e) => setExtNo(e.target.value)}
                  placeholder="Enter Room Ext No"
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Room Status <span className="text-danger">*</span>
                </label>
                <select
                  className="form-control flex-grow-1"
                  value={room_status}
                  onChange={(e) => setRoomStatus(e.target.value)}
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                >
                  <option value="">Select Status</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Department Name
                </label>
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  value={department_id}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  placeholder="Enter Department Name"
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Block Name
                </label>
                <select
                  className="form-control"
                  value={blockid ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setblockid(value === '' ? null : Number(value));
                  }}
                >
                  <option value="">Select a Block</option>
                  {Blocks.filter((block) => String(block.status) === '0').map((block) => (
                    <option key={block.blockid} value={block.blockid}>
                      {block.block_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Floor Name
                </label>
                <select
                  className="form-control"
                  value={floorid ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setfloorid(value === '' ? null : Number(value));
                  }}
                >
                  <option value="">Select a Floor</option>
                  {Floors.filter((floor) => String(floor.status) === '0').map((floor) => (
                    <option key={floor.floorid} value={floor.floorid}>
                      {floor.floor_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Feature List <span className="text-danger">*</span>
                </label>
                <div className="flex-grow-1">
                  <Select
                    options={featureOptions}
                    isMulti
                    onChange={handleFeatureChange}
                    value={selectedFeatures}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select Features"
                    isDisabled={loading}
                  />
                </div>
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                  Hotel Name <span className="text-danger">*</span>
                </label>
                <select
                  className="form-control flex-grow-1"
                  value={hotel_id}
                  onChange={(e) => setHotelId(e.target.value)}
                  style={{ border: '0.5px solid lightgray' }}
                  disabled={loading}
                >
                  <option value="">Select Hotel</option>
                  {hotelOptions.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-danger me-2" onClick={onHide} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={handleEdit} disabled={loading}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <TitleHelmet title="Rooms List" />
      <Card className="m-1">
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h4 className="mb-0">Rooms</h4>
          <div className="d-flex align-items-center gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Room No"
              onChange={(e) => handleSearch(e.target.value)}
              style={{ maxWidth: '300px', border: '1px solid #6c757d', borderRadius: '0.25rem' }}
            />
            <Button variant="success" onClick={() => setShowAddModal(true)}>
              <i className="bi bi-plus"></i> Add Room
            </Button>
          </div>
        </div>
        <div className="p-3">
          {loading ? (
            <Stack className="align-items-center justify-content-center flex-grow-1 h-100">
              <Preloader />
            </Stack>
          ) : (
            <Table responsive>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} style={{ width: header.column.columnDef.size, textAlign: header.id === 'actions' ? 'left' : 'center' }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} style={{ textAlign: cell.column.id === 'actions' ? 'left' : 'center' }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Card>
      <AddRoomModal show={showAddModal} onHide={() => setShowAddModal(false)} onSuccess={fetchRooms} />
      <EditRoomModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        room={selectedRoom}
        onSuccess={fetchRooms}
        onUpdateSelectedRoom={setSelectedRoom}
      />
    </>
  );
};

export default RoomMaster;
