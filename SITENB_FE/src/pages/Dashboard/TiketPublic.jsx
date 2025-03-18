
import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import FormModal from '../../components/FormModal';
import Detail from '../../components/Detail';
import { MdEdit } from "react-icons/md";
import { IoIosEye } from "react-icons/io";



const TiketPublic = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedTickets, setSelectedTickets] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isForm1Open, setIsForm1Open] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const openForm1 = () => setIsForm1Open(true);
  const closeForm1 = () => setIsForm1Open(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; 

  // useEffect(() => {
  const fetchData = async (page = 1) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/admin/publiks?page=${page}&per_page=${itemsPerPage}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setData(response.data.data.data);
      setTotalPages(response.data.data.last_page);

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
// }, []);

const handleDetailClick = (tickets) => {
  setSelectedTickets(tickets); 
  setIsModalOpen(true); 
};

const handleCloseModal = () => {
  setSelectedTickets(null);
  setIsModalOpen(false); 
};

const handleStatusChange = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:8000/api/admin/publiks/${selectedTickets.id}/status`, {
      status: newStatus,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const updatedData = await axios.get('http://localhost:8000/api/admin/publiks', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setData(updatedData.data.data.data);
    closeForm1(); 
  } catch (error) {
    console.error('Error updating status:', error.response.data); 
  }
};
const handleSearch = (e) => {
  setSearchTerm(e.target.value);
};
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  const filteredData = data.filter(ticket =>
    ticket.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
    {/* isolate */}
      <div className='relative  px-4 pt-24 sm:px-6 lg:px-8'>
        
        <a href="/Dashboard/Tiket" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-blue-300 inline-flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z" clipRule="evenodd" />
          </svg>
          <span className="sr-only">Search</span>
        </a>

        <div className="flex justify-between items-center w-full">
          <p>Tiket Public </p>
          <form className="flex items-center w-full sm:max-w-xs">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-2.5"
              placeholder="Cari tiket berdasarkan nama"
              value={searchTerm}
              onChange={handleSearch}
              required
            />
          </div>
          <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </form>
        </div>

        <div className="overflow-x-auto shadow-md sm:rounded-lg mt-4">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">No</th>
                <th scope="col" className="px-6 py-3">Nama Lengkap</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Kategori</th>
                <th scope="col" className="px-6 py-3">Jenis Tiket</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((tickets,index) => (
                <tr key={tickets.id} className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700">
           
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{tickets.nama_lengkap}</td>
                  <td className="px-6 py-4">{tickets.email}</td>
                  <td className="px-6 py-4">{tickets.kategori}</td>
                  <td className="px-6 py-4">{tickets.jenis_tiket}</td>
                  <td className="px-6 py-4">{tickets.status}</td>
                  
                 <td className="grid grid-cols-1 gap-4 sm:grid-cols-3 p-4 ">
                                    {/* <button onClick={openForm1} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button> */}
                                    
                                    <button onClick={() => { openForm1(); setSelectedTickets(tickets); }} className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-800 focus:outline-none transition-all duration-200 ease-in-out"> 
                                    <MdEdit />
                
                
                                      </button>  
                              
                                   <button 
                                          onClick={() => handleDetailClick(tickets)} 
                                          className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-800 focus:outline-none transition-all duration-200 ease-in-out">
                                          <IoIosEye className="text-xl" />
                                      </button>
                                  </td>
                </tr>
              ))}
                {isModalOpen && (
        <Detail tickets={selectedTickets} onClose={handleCloseModal}   title="Detail Tiket Pegawai BNPT" />
      )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          <button onClick={handlePreviousPage} disabled={currentPage === 1} className="px-4 py-2 mx-1 bg-gray-200 rounded">Sebelumnya</button>
          {[...Array(totalPages)].map((_, page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page + 1)}
              className={`px-4 py-2 mx-1 rounded ${currentPage === page + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {page + 1}
            </button>
          ))}
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 mx-1 bg-gray-200 rounded">Selanjutnya</button>
        </div>

        {/* <FormModal isOpen={isForm1Open} onClose={closeForm1} title="Ubah Status">
          <div className="sm:col-span-3">
            <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
              Pilih status
            </label>
            <div className="mt-2">
              <select
                id="status"
                name="status"
                type="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
   <option value="">Pilih Status</option>
              <option value="Proses">Proses</option>
              <option value="Selesai">Selesai</option>
              </select>
              <button onClick={handleStatusChange} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Simpan</button>
            </div>
          </div>
        </FormModal> */}
   <FormModal isOpen={isForm1Open} onClose={closeForm1} onSave={handleStatusChange} title="Ubah Status">
  <div className="sm:col-span-3">
    <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Status Baru</label>
    <select
      id="status"
      value={newStatus}
      onChange={(e) => setNewStatus(e.target.value)}
      className="block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Pilih Status</option>
      <option value="proses">Proses</option>
      <option value="selesai">Selesai</option>
      <option value="close">Close</option>
    </select>
  </div>
</FormModal>

      </div>
    </>
  );
};

export default TiketPublic;
