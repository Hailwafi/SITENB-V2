import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormModal from '../../../components/FormModal';
import DetailStaff from '../../../components/DetailStaff';
import { format } from 'date-fns';
import { FaEdit, FaInfoCircle, FaPaperclip } from 'react-icons/fa';
import { IoIosEye, IoIosPaperPlane } from "react-icons/io";


import 'react-toastify/dist/ReactToastify.css';
const TaskPw = () => {
  const [searchTerm, setSearchTerm] = useState('');


    const [selectedTicket, setSelectedTicket] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isForm1Open, setIsForm1Open] = useState(false);
    const [isForm2Open, setIsForm2Open] = useState(false);
    const [isProofFormOpen, setIsProofFormOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false); 

    const openForm1 = () => setIsForm1Open(true);
    const closeForm1 = () => setIsForm1Open(false);
    const openForm2 = () => setIsForm2Open(true);
    const closeForm2 = () => setIsForm2Open(false);
    const openProofForm = () => setIsProofFormOpen(true);
    const closeProofForm = () => setIsProofFormOpen(false);

    const [tickets, setTickets] = useState({
        tiket_pegawai: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            const token = localStorage.getItem('token'); 
            try {
                const response = await axios.get('http://localhost:8000/api/staff/staff-tickets', {
                    headers: { Authorization: `Bearer ${token}` } 
                });
                setTickets(response.data.data); 
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Gagal mendapatkan tiket. Silakan coba lagi.'); 
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);


    
    const handleDetailClick = (ticket) => {
        setSelectedTicket(ticket); 
        setIsModalOpen(true); 
    };
      
    const handleCloseModal = () => {
        setSelectedTicket(null);
        setIsModalOpen(false); 
    };
      
    const handleStatusChange = async () => {
        setIsUpdating(true); 
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/api/staff/tickets/${selectedTicket.id}/status`, {
                status: newStatus,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updatedData = await axios.get('http://localhost:8000/api/staff/staff-tickets', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTickets(updatedData.data.data); 
            closeForm1(); 
        } catch (error) {
            console.error('Error updating status:', error.response?.data);
            alert('Gagal mengubah status tiket. Silakan coba lagi.');
        } finally {
            setIsUpdating(false); 
        }
    };
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
      };
      const filteredData = tickets.tiket_pegawai.filter(ticket => 
        ticket.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

const FormBuktiPengerjaan = ({ selectedTicket, onClose }) => {
    const [tanggal, setDate] = useState(''); 
    const [status, setNewStatus] = useState(''); 
    const [bukti_pengerjaan, setProofFile] = useState(null); 

    const handleFileChange = (e) => {
        setProofFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('tanggal', tanggal);
        formData.append('bukti_pengerjaan', bukti_pengerjaan);

        try {
            await axios.post(`http://127.0.0.1:8000/api/staff/tickets/${selectedTicket.id}/proof-of-work`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Bukti pengerjaan berhasil dikirim");
            onClose();
        } catch (error) {
            console.error("Gagal mengirim bukti pengerjaan:", error.response ? error.response.data : error.message);
            alert("Gagal mengirim bukti pengerjaan. Silakan coba lagi.");
        }

       
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <button className="float-right text-gray-500" onClick={onClose}>&times;</button>
                <h2 className="text-xl font-semibold mb-4">Kirim Bukti Pengerjaan</h2>
                <form onSubmit={handleSubmit}>
                   

                    {/* Input Tanggal */}
                    <label htmlFor="date" className="block mb-2">Tanggal</label>
                    <input
                        id="date"
                        type="date"
                        value={tanggal}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                        required
                    />

                 

                    {/* Input Bukti Pengerjaan (Foto) */}
                    <label htmlFor="proof" className="block mb-2">Bukti Pengerjaan (Foto)</label>
                    <input
                        id="proof"
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded mb-4"
                        accept="image/*,application/pdf"
                        required
                    />

<div className="sm:col-span-3">
                        <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Status Baru</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Pilih Status</option>
                            <option value="proses">Proses</option>
                            <option value="selesai">Selesai</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Kirim</button>
                </form>
            </div>
        </div>
    );
};

// const DetailStaff = ({ ticket, onClose }) => {
//     // If ticket is not available, display a fallback message or return early
//     if (!ticket) {
//         return <div>Loading...</div>; // You can show a loading spinner or message instead
//     }

//     const formatString = (str) => str.replace(/_/g, ' ');

//     const isImageFile = (filePath) => {
//         const ext = filePath.split('.').pop().toLowerCase();
//         return ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
//     };

//     const getFileNameFromPath = (filePath) => {
//         return filePath.split('/').pop();
//     };

//     const handleDownload = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 alert('Token tidak ditemukan. Pastikan Anda sudah login.');
//                 return;
//             }

//             const response = await axios.get(`http://127.0.0.1:8000/api/view-or-download-file/${ticket.unggah_file}?download=true`, {
//                 responseType: 'blob',
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', getFileNameFromPath(ticket.unggah_file));
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             window.URL.revokeObjectURL(url);
//         } catch (error) {
//             console.error('Error downloading the file:', error);
//             alert('Gagal mengunduh file. Silakan coba lagi.');
//         }
//     };

//     const formattedDate = ticket.created_at
//         ? format(new Date(ticket.created_at), 'dd MMMM yyyy')
//         : 'Tanggal tidak tersedia';

//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto mt-10">
//                 <div className="relative isolate mt-10 lg:px-8">
//                     <form>
//                         <div className="space-y-12">
//                             <div className="border-b border-gray-900/10 pb-12">
//                                 <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
//                                     <div>
//                                         <label className="block text-sm font-medium leading-6 text-gray-900">
//                                             Tanggal:
//                                         </label>
//                                         <div className="mt-2">
//                                             <div className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
//                                                 {formattedDate}
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium leading-6 text-gray-900">
//                                             Nama Lengkap
//                                         </label>
//                                         <div className="mt-2">
//                                             <input
//                                                 value={ticket?.nama_lengkap || 'Tidak tersedia'}
//                                                 readOnly
//                                                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
//                                             />
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium leading-6 text-gray-900">
//                                             Email
//                                         </label>
//                                         <div className="mt-2">
//                                             <input
//                                                 value={ticket?.email || 'Tidak tersedia'}
//                                                 readOnly
//                                                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
//                                             />
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium leading-6 text-gray-900">
//                                             Kategori
//                                         </label>
//                                         <div className="mt-2">
//                                             <div className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
//                                                 {formatString(ticket.kategori)}
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="mb-6">
//                                         <label className="block text-sm font-medium text-gray-900">Foto</label>
//                                         <div className="mt-2 flex flex-col gap-2">
//                                             <input
//                                                 value={ticket?.unggah_file || 'Tidak tersedia'}
//                                                 readOnly
//                                                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
//                                             />
//                                             {isImageFile(ticket?.unggah_file) && (
//                                                 <div className="flex gap-4">
//                                                     <a
//                                                         href={`http://127.0.0.1:8000/storage/${ticket?.unggah_file}`}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                         className="inline-block rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//                                                     >
//                                                         Lihat Foto
//                                                     </a>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                     <div className="col-span-full">
//                                         <label className="block text-sm font-medium leading-6 text-gray-900">
//                                             Deskripsi
//                                         </label>
//                                         <div className="mt-2">
//                                             <textarea
//                                                 rows={4}
//                                                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
//                                                 value={ticket?.deskripsi || 'Tidak tersedia'}
//                                                 readOnly
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//                 <div className="flex justify-end space-x-4 gap-5">
//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
//                     >
//                         Tutup
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


    return (
        <>
            <div className='relative px-4 pt-24 sm:px-6 lg:px-8'>
                <a href="/Staff" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-blue-300 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z" clipRule="evenodd" />
                    </svg>
                    <span className="sr-only">Search</span>
                </a>

                <div className="flex justify-between items-center w-full">
                    <p>v Tiket Pegawai </p>
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
                                <th scope="col" className="px-6 py-3">No.</th>
                                <th scope="col" className="px-6 py-3">Nama</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Jabatan</th>
                                <th scope="col" className="px-6 py-3">Kategori</th>
                                <th scope="col" className="px-6 py-3">Jenis Tiket</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {tickets.tiket_pegawai.length > 0 ? (
                                tickets.tiket_pegawai.map((ticket, index) => (
                                    <tr key={ticket.id} className="bg-white border-b">
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4">{ticket.nama_lengkap}</td>
                                        <td className="px-6 py-4">{ticket.email}</td>
                                        <td className="px-6 py-4">{ticket.jabatan}</td>
                                        <td className="px-6 py-4">{ticket.kategori}</td>
                                        <td className="px-6 py-4">{ticket.jenis_tiket}</td>
                                        <td className="px-6 py-4">{ticket.status}</td>
                                        <td className="grid grid-cols-1 gap-2 sm:grid-cols-3 p-4">
                                            
                                        <button onClick={() => { openForm1(); setSelectedTicket(ticket); }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Ganti Status</button>

                                        <button 
                        onClick={() => handleDetailClick(ticket)} 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Detail
                    </button>

                                        <button onClick={() => { setSelectedTicket(ticket); openProofForm(); }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Kirim Bukti</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">Tidak ada tiket yang tersedia.</td>
                                </tr>
                            )} */}

{filteredData.length > 0 ? (
    filteredData.map((ticket, index) => (
        <tr key={ticket.id} className="bg-white border-b">
            <td className="px-6 py-4">{index + 1}</td>
            <td className="px-6 py-4">{ticket.nama_lengkap}</td>
            <td className="px-6 py-4">{ticket.email}</td>
            <td className="px-6 py-4">{ticket.jabatan}</td>
            <td className="px-6 py-4">{ticket.kategori}</td>
            <td className="px-6 py-4">{ticket.jenis_tiket}</td>
            <td className="px-6 py-4">{ticket.status}</td>
            <td className="grid grid-cols-1 gap-4 sm:grid-cols-3 p-4">
    <button 
        onClick={() => { openForm1(); setSelectedTicket(ticket); }} 
        className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-800 focus:outline-none transition-all duration-200 ease-in-out">
        <FaEdit className="text-lg" />
    </button>

    <button 
        onClick={() => handleDetailClick(ticket)} 
        className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-800 focus:outline-none transition-all duration-200 ease-in-out">
        <IoIosEye className="text-xl" />
    </button>

    <button 
        onClick={() => { setSelectedTicket(ticket); openProofForm(); }} 
        className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-800 focus:outline-none transition-all duration-200 ease-in-out">
        <IoIosPaperPlane className="text-lg" />
    </button>
</td>

        </tr>
    ))
) : (
    <tr>
        <td colSpan="8" className="text-center py-4">Tidak ada tiket yang tersedia.</td>
    </tr>
)}

                        </tbody>
                    </table>
                </div>
            </div>

            {selectedTicket && (
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
                        </select>
                    </div>
                </FormModal>
            )}
        {isProofFormOpen && (
    <FormBuktiPengerjaan selectedTicket={selectedTicket} onClose={closeProofForm} />
)}
     {isModalOpen && selectedTicket && (
    <DetailStaff ticket={selectedTicket} onClose={handleCloseModal} />
)}
        </>
    );
};

export default TaskPw;
