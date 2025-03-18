import React, { useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AssignTaskForm from './AssignTaskForm';

const Detail = ({ tickets, onClose, staffList, onAssignTask, onStatusUpdate }) => {
    const [assignData, setAssignData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(tickets.status || 'Open'); 

    const formatString = (str) => str.replace(/_/g, ' ');

    const handleStatusChange = async (newStatus) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Token tidak ditemukan. Pastikan Anda sudah login.');
                return;
            }

            const response = await axios.put(
                `http://127.0.0.1:8000/api/admin/tickets/${tickets.id}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                setStatus(newStatus);
                toast.success('Status berhasil diperbarui!');
                if (onStatusUpdate) onStatusUpdate(tickets.id, newStatus);
            } else {
                toast.error('Gagal memperbarui status. Silakan coba lagi.');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Terjadi kesalahan saat memperbarui status.');
        } finally {
            setLoading(false);
        }
    };

    const isImageFile = (filePath) => {
        const ext = filePath.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
    };

    const getFileNameFromPath = (filePath) => {
        return filePath.split('/').pop();
    };

    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Token tidak ditemukan. Pastikan Anda sudah login.');
                return;
            }

            const response = await axios.get(`http://127.0.0.1:8000/api/view-or-download-file/${tickets.unggah_file}?download=true`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', getFileNameFromPath(tickets.unggah_file));
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the file:', error);
            alert('Gagal mengunduh file. Silakan coba lagi.');
        }
    };

    const formattedDate = tickets?.created_at
        ? format(new Date(tickets.created_at), 'dd MMMM yyyy')
        : 'Tanggal tidak tersedia';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto mt-10">
                <div className="relative isolate mt-10 lg:px-8">
                    <form>
                        <div className="space-y-12">
                            <div className="border-b border-gray-900/10 pb-12">
                                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
                                    <div>
                                        <label className="block text-sm font-medium leading-6 text-gray-900">
                                            Tanggal:
                                        </label>
                                        <div className="mt-2">
                                            <div className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
                                                {formattedDate}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium leading-6 text-gray-900">
                                            Nama Lengkap
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                value={tickets.nama_lengkap}
                                                readOnly
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium leading-6 text-gray-900">
                                            Email
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                value={tickets.email}
                                                readOnly
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium leading-6 text-gray-900">
                                            Kategori
                                        </label>
                                        <div className="mt-2">
                                            <div className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300">
                                                {formatString(tickets.kategori)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-900">Foto</label>
                                        <div className="mt-2 flex flex-col gap-2">
                                            {/* <input
                                                value={tickets.unggah_file}
                                                readOnly
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                                            /> */}
                                            {isImageFile(tickets.unggah_file) && (
                                                <div className="flex gap-4">
                                                    <a
                                                        href={`http://127.0.0.1:8000/storage/${tickets.unggah_file}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-block rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                                    >
                                                        Lihat Foto
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-span-full">
                                        <label className="block text-sm font-medium leading-6 text-gray-900">
                                            Deskripsi
                                        </label>
                                        <div className="mt-2">
                                            <textarea
                                                rows={4}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                                                value={tickets.deskripsi}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium leading-6 text-gray-900">
                                            Status
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                                                value={status}
                                                onChange={(e) => handleStatusChange(e.target.value)}
                                                disabled={loading }
                                            >
                                                {/* <option value="open">Open</option> */}
                                                <option value="proses">Proses</option>
                                                <option value="selesai">Selesai</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <AssignTaskForm
                        ticketId={tickets.id}
                        onAssignTask={setAssignData}
                    />
                </div>
                <div className="flex justify-end space-x-4 gap-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Detail;
