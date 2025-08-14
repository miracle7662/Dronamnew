
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


interface Book {
  book_id: number;
  book_name: string;
  mobile_no: string;
  company_name: string;
  address: string;
  cityid: number | string
  countryid: number | string
  fax: string;
  email: string;
website: string;
  created_by_id: string;
  created_date: string;
  updated_by_id: string;
  updated_date: string;
}


import { fetchCountries,
   CountryItem, 
  fetchCities, 
  CityItem, 
} 
  from '@/utils/commonfunction'
interface AddBookModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

interface EditBookModalProps {
  show: boolean;
  onHide: () => void;
  book: Book | null;
  onSuccess: () => void;
  onUpdateSelectedBook: (book: Book) => void;
}


const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};


const BookMaster: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/books');
      if (!res.ok) throw new Error('Failed to fetch books');
      const data = await res.json();
      console.log('Fetched Books:', data);
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const columns = useMemo<ColumnDef<Book>[]>(
    () => [
      {
        id: 'srNo',
        header: 'Sr No',
        size: 50,
        cell: ({ row }) => <div style={{ textAlign: 'center' }}>{row.index + 1}</div>,
      },
      {
        accessorKey: 'book_name',
        header: 'Name',
        size: 150,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        accessorKey: 'company_name',
        header: 'Company Name',
        size: 150,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        size: 200,
        cell: (info) => <div style={{ textAlign: 'center' }}>{info.getValue<string>()}</div>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 150,
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
              title="Edit Book"
            >
              <i className="fi fi-rr-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteBook(row.original)}
              title="Delete Book"
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
    data: filteredBooks,
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
      const filteredBooksBySearch = books.filter((item) =>
        item.book_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBooks(filteredBooksBySearch);
    }, 300),
    [books]
  );

  const handleEditClick = (book: Book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const handleDeleteBook = async (book: Book) => {
    const res = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this book!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3E97FF',
      confirmButtonText: 'Yes, delete it!',
    });
    if (res.isConfirmed) {
      try {
        await fetch(`http://localhost:3001/api/books/${book.book_id}`, { method: 'DELETE' });
        toast.success('Book deleted successfully');
        fetchBooks();
        setSelectedBook(null);
      } catch {
        toast.error('Failed to delete book');
      }
    }
  };


const AddBookModal: React.FC<AddBookModalProps> = ({ show, onHide, onSuccess }) => {
  const [book_name, setName] = useState('');
  const [mobile_no, setMobileNo] = useState('');
  const [company_name, setCompanyName] = useState('');
  const [address, setAddress] = useState('')
  // const [cityid, setcityid] = useState('');
  // const [countryid, setcountryid] = useState('');
  const [fax, setFax] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [countryid, setCountryId] = useState<number | null>(null)
  const [cityid, setCityId] = useState<number | null>(null)
  const [filteredCountries, setFilteredCountries] = useState<CountryItem[]>([])
  const [countryItems, setCountryItems] = useState<CountryItem[]>([])
  const [CityItems, setCityItems] = useState<CityItem[]>([])



useEffect(() => {
      fetchCountries(setCountryItems, setFilteredCountries, setLoading)
      fetchCities(setCityItems, setCityId)
      
    }, [])


  const handleAdd = async () => {
      if (!book_name || !company_name ) {
      toast.error('Required fields: Name, Company Name');
      return;
    }

    setLoading(true);
    try {
      const currentDate = new Date().toISOString();
      const payload = {
        book_name,
        mobile_no,
        company_name,
        address,
        cityid: cityid ?? '',
        countryid: countryid ?? '',
        fax,
        email,
        website,
        created_by_id: '1',
        created_date: currentDate,
      };
      console.log('Sending to backend:', payload);
      const res = await fetch('http://localhost:3001/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success('Book added successfully');
        setName('');
        setMobileNo('');
        setCompanyName('');
        setAddress('');
        setCityId(null);
        setCountryId(null);
        setFax('');
        setEmail('');
        setWebsite('');
        onSuccess();
        onHide();
      } else {
        const errorData = await res.json();
        console.log('Backend error:', errorData);
        toast.error('Failed to add book');
      }
    } catch (err) {
      console.error('Add book error:', err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="modal-content" style={{ padding: '20px', maxWidth: '900px', margin: '100px auto', borderRadius: '8px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Add Book</h5>
          <button className="btn-close" onClick={onHide} disabled={loading}></button>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                value={book_name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                style={{ border: '0.5px solid lightgray', width: '300px' }}
                disabled={loading}
              />
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Mobile No
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                value={mobile_no}
                onChange={(e) => setMobileNo(e.target.value)}
                placeholder="Enter Mobile No"
                style={{ border: '0.5px solid lightgray', width: '300px' }}
                disabled={loading}
              />
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Company Name<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                value={company_name}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter Company Name"
                style={{ border: '0.5px solid lightgray' }}
                disabled={loading}
              />
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Fax
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                value={fax}
                onChange={(e) => setFax(e.target.value)}
                placeholder="Enter Fax"
                style={{ border: '0.5px solid lightgray' }}
                disabled={loading}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Email
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                style={{ border: '0.5px solid lightgray' }}
                disabled={loading}
              />
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Address
              </label>
              <textarea
                className="form-control flex-grow-1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Address"
                style={{ border: '0.5px solid lightgray', height: '100px' }}
                disabled={loading}
              />
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                City <span className="text-danger">*</span>
              </label>
               <select
                    className="form-control"
                    value={cityid ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setCityId(value === '' ? null : Number(value))
                    }}
                    style={{ border: '0.5px solid lightgray' }}
                    disabled={loading}>
                    <option value="">Select a city</option>
                    {CityItems.filter((city) => String(city.status) === '0') // Only include active cities
                      .map((city) => (
                        <option key={city.cityid} value={city.cityid}>
                          {city.city_name}
                        </option>
                      ))}
                  </select>
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Country <span className="text-danger">*</span>
              </label>
              <select
                className="form-control flex-grow-1"
                value={countryid ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setCountryId(value === '' ? null : Number(value));
                }}
                style={{ border: '0.5px solid lightgray' }}
                disabled={loading}
              >
                <option value="">Select a country</option>
                {countryItems.filter((country) => String(country.status) === '0') // Only include active countries
                  .map((country) => (
                    <option key={country.countryid} value={country.countryid}>
                      {country.country_name}
                    </option>    
                  ))}
                 </select>  
            </div>
            <div className="mb-3 d-flex align-items-center">
             <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Website
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Website"
                style={{ border: '0.5px solid lightgray' }}
                disabled={loading}
              />
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

const EditBookModal: React.FC<EditBookModalProps> = ({ show, onHide, book, onSuccess, onUpdateSelectedBook }) => {
  const [book_name, setName] = useState('');
  const [mobile_no, setMobileNo] = useState('');
  const [company_name, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  // const [cityid, setcityid] = useState('');
  // const [countryid, setcountryid] = useState('');
  const [fax, setFax] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [countryid, setCountryId] = useState<number | null>(null);
  const [cityid, setCityId] = useState<number | null>(null);
  const [filteredCountries, setFilteredCountries] = useState<CountryItem[]>([]);
  const [countryItems, setCountryItems] = useState<CountryItem[]>([]);
  const [CityItems, setCityItems] = useState<CityItem[]>([])



useEffect(() => {
      fetchCountries(setCountryItems, setFilteredCountries, setLoading)
      fetchCities(setCityItems, setCityId)
      
    }, [])

 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setName(book.book_name || '');
      setMobileNo(book.mobile_no || '');
      setCompanyName(book.company_name || '');
      setAddress(book.address || '');
      setCityId(book.cityid ? Number(book.cityid) : null);
      setCountryId(book.countryid ? Number(book.countryid) : null);
      setFax(book.fax || '');
      setEmail(book.email || '');
      setWebsite(book.website || '');

    }
  }, [book]);

  const handleEdit = async () => {
      if (!book_name || !company_name ) {
      toast.error('Required fields: Name, Company Name');
      return;
    }
    setLoading(true);
    try {
      const currentDate = new Date().toISOString();
      const payload = {
        book_name,
        mobile_no,
        company_name,
        address,
        cityid,
        countryid,
        fax,
        email,
        website,
        book_id: book?.book_id,
        updated_by_id: '2',
        updated_date: currentDate,
      };
      console.log('Sending to backend:', payload);
      const res = await fetch(`http://localhost:3001/api/books/${book?.book_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success('Book updated successfully');
        onSuccess();
        const updatedBook = {
          ...book,
          ...payload,
          book_id: book?.book_id ?? 0,
          created_by_id: book?.created_by_id || '',
        };
        onUpdateSelectedBook(updatedBook as Book);
        onHide();
      } else {
        const errorData = await res.json();
        console.log('Backend error:', errorData);
        toast.error('Failed to update book');
      }
    } catch (err) {
      console.error('Edit book error:', err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!show || !book) return null;

  return (
    <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="modal-content" style={{ padding: '20px', maxWidth: '900px', margin: '100px auto', borderRadius: '8px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Edit Book</h5>
          <button className="btn-close" onClick={onHide} disabled={loading}></button>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                value={book_name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                style={{ border: '0.5px solid lightgray', width: '300px' }}
                disabled={loading}
              />
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Mobile No
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                value={mobile_no}
                onChange={(e) => setMobileNo(e.target.value)}
                placeholder="Enter Mobile No"
                style={{ border: '0.5px solid lightgray', width: '300px' }}
                disabled={loading}
              />
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Company Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                value={company_name}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter Company Name"
                style={{ border: '0.5px solid lightgray' }}
                disabled={loading}
              />
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Fax
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                value={fax}
                onChange={(e) => setFax(e.target.value)}
                placeholder="Enter Fax"
                style={{ border: '0.5px solid lightgray' }}
                disabled={loading}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Email
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                style={{ border: '0.5px solid lightgray' }}
                disabled={loading}
              />
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Address
              </label>
              <textarea
                className="form-control flex-grow-1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Address"
                style={{ border: '0.5px solid lightgray', height: '100px' }}
                disabled={loading}
              />
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                City <span className="text-danger">*</span>
              </label>
              <select
                    className="form-control"
                    value={cityid ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setCityId(value === '' ? null : Number(value))
                    }}
                    style={{ border: '0.5px solid lightgray' }}
                    disabled={loading}>
                    <option value="">Select a city</option>
                    {CityItems.filter((city) => String(city.status) === '0') // Only include active cities
                      .map((city) => (
                        <option key={city.cityid} value={city.cityid}>
                          {city.city_name}
                        </option>
                      ))}
                  </select>
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Country <span className="text-danger">*</span>
              </label>
              <select
                className="form-control flex-grow-1"
                value={countryid ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setCountryId(value === '' ? null : Number(value));
                }}
                style={{ border: '0.5px solid lightgray' }}
                disabled={loading}
              >
                <option value="">Select a country</option>
                {countryItems.filter((country) => String(country.status) === '0') // Only include active countries
                  .map((country) => (
                    <option key={country.countryid} value={country.countryid}>
                      {country.country_name}
                    </option>    
                  ))}
                 </select>  
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-2" style={{ minWidth: '120px' }}>
                Website <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control flex-grow-1"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Enter Website"
                style={{ border: '0.5px solid lightgray' }}
                disabled={loading}
              />
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
      <TitleHelmet title="Books List" />
      <Card className="m-1">
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h4 className="mb-0">Books</h4>
          <div className="d-flex align-items-center gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Name"
              onChange={(e) => handleSearch(e.target.value)}
              style={{ maxWidth: '300px', border: '1px solid #6c757d', borderRadius: '0.25rem' }}
            />
            <Button variant="success" onClick={() => setShowAddModal(true)}>
              <i className="bi bi-plus"></i> Add Book
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
                      <th
                        key={header.id}
                        style={{
                          width: header.column.columnDef.size,
                          textAlign: header.id === 'actions' ? 'left' : 'center',
                        }}
                      >
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
                      <td
                        key={cell.id}
                        style={{ textAlign: cell.column.id === 'actions' ? 'left' : 'center' }}
                      >
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
      <AddBookModal show={showAddModal} onHide={() => setShowAddModal(false)} onSuccess={fetchBooks} />
      <EditBookModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        book={selectedBook}
        onSuccess={fetchBooks}
        onUpdateSelectedBook={setSelectedBook}
      />
    </>
  );
};

export default BookMaster;