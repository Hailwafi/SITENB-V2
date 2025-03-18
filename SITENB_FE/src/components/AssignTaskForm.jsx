import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AssignTaskForm = ({ ticketId, onAssignTask }) => {
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [prioritas, setPrioritas] = useState('normal'); // State untuk prioritas
    const [error, setError] = useState('');
    const [ticketType, setTicketType] = useState('staff'); // State untuk jenis tiket
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStaffList = async () => {
            try {
                const token = localStorage.getItem('token');
                const staffResponse = await axios.get('http://127.0.0.1:8000/api/admin/staff-list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setStaffList(staffResponse.data.staff);
            } catch (err) {
                setError('Gagal memuat data staf: ' + (err.response?.data?.message || err.message));
                toast.error('Gagal memuat data staf: ' + (err.response?.data?.message || err.message));
            }
        };

        fetchStaffList();
    }, []);

    const handleAssignTask = async () => {
        if (!selectedStaff || !ticketId) {
            toast.warn('Silakan pilih staf untuk menugaskan tugas!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            let apiUrl;

            // Tentukan API berdasarkan jenis tiket
            if (ticketType === 'staff') {
                apiUrl = `http://127.0.0.1:8000/api/admin/tickets/${ticketId}/assign`;
            } else {
                apiUrl = `http://127.0.0.1:8000/api/admin/publiks/${ticketId}/assign`;
            }

            const response = await axios.put(apiUrl, {
                assigned_to: selectedStaff,
                prioritas: prioritas,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Tugas berhasil ditugaskan!');
            setTimeout(() => {
                navigate("");
            }, 3000);
            setSelectedStaff(null);
            setPrioritas('normal');
            setError('');
            onAssignTask({ assignedStaff: selectedStaff, ticketId, prioritas });
        } catch (err) {
            // setError('Gagal menugaskan tugas: ' + (err.response?.data?.message || err.message));
            // toast.error('Gagal menugaskan tugas: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div>
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
            <h2>Penugasan Tugas Kepada Staf</h2>
            
            {/* Pilihan jenis tiket */}
            <div className="mt-4">
                <label htmlFor="ticketType" className="block text-sm font-medium text-gray-700">Jenis Tiket</label>
                <select
                    id="ticketType"
                    value={ticketType}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    onChange={(e) => setTicketType(e.target.value)}
                >
                    <option value="staff">Tiket Pegawai</option>
                    <option value="public">Tiket Publik</option>
                </select>
            </div>

            <div>
                <select
                    value={selectedStaff}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    onChange={(e) => setSelectedStaff(e.target.value)}
                >
                    <option value="">Select Staff</option>
                    {staffList.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                            {staff.username} - {staff.email}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-4">
                <label htmlFor="prioritas" className="block text-sm font-medium text-gray-700">Prioritas Tugas</label>
                <select
                    id="prioritas"
                    value={prioritas}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    onChange={(e) => setPrioritas(e.target.value)}
                >
                    <option value="rendah">Rendah</option>
                    <option value="normal">Normal</option>
                    <option value="tinggi">Tinggi</option>
                </select>
            </div>

            <button className='mt-4 inline-flex justify-center rounded-md border border-transparent bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-customGreen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600' onClick={handleAssignTask}>
                Tugaskan Kepada Staff Subbag TI
            </button>
        </div>
    );
};

export default AssignTaskForm;
