import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../service/axiosInstance';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const LogOut = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const logout = async () => {
        setLoading(true);
        setError(null);

        try {
            await axiosInstance.post('/logout'); // Mengirim request logout

            // Hapus token dan role dari localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('role');

            // Menampilkan notifikasi sukses
            toast.success('Logout berhasil!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });

            // Arahkan pengguna ke halaman login setelah delay
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            // Menangani kesalahan dan menampilkan notifikasi gagal
            console.error('Logout error:', err.response ? err.response.data : err.message);
            setError(err.response ? err.response.data.message : 'Logout failed');
            toast.error('Logout gagal! Silakan coba lagi.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        } finally {
            setLoading(false);
        }
    };

    return { logout, loading, error };
};

export default LogOut;
