import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
    const [tickets, setTickets] = useState({
        tiket_pegawai: [],
        tiket_publik: []
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

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Tiket yang Ditugaskan kepada Saya</h1>

            <h2>Tiket Pegawai</h2>
            <ul>
                {tickets.tiket_pegawai.length > 0 ? (
                    tickets.tiket_pegawai.map((ticket) => (
                        <li key={`pegawai-${ticket.id}`}>
                            {ticket.nama_lengkap} - Jabatan: {ticket.jabatan} - Status: {ticket.status}
                        </li>
                    ))
                ) : (
                    <p>Tidak ada tiket pegawai yang ditugaskan.</p>
                )}
            </ul>

            <h2>Tiket Publik</h2>
            <ul>
                {tickets.tiket_publik.length > 0 ? (
                    tickets.tiket_publik.map((ticket) => (
                        <li key={`publik-${ticket.id}`}>
                            {ticket.nama_lengkap} - Kategori: {ticket.kategori} - Status: {ticket.status}
                        </li>
                    ))
                ) : (
                    <p>Tidak ada tiket publik yang ditugaskan.</p>
                )}
            </ul>
        </div>
    );
};

export default TaskList;
