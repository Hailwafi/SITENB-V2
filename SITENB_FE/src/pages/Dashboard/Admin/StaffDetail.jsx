// src/pages/StaffDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StaffDetail = () => {
  const { id } = useParams(); // Ambil ID dari URL
  const [staffDetail, setStaffDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaffDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/admin/staff-tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Staff Detail:', response.data); // Debug log
        setStaffDetail(response.data);
      } catch (err) {
        console.error('Error fetching staff detail:', err); // Tambahkan log ini untuk debugging
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffDetail();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Detail Staff</h1>
      {staffDetail && (
        <div>
          <p>Nama: {staffDetail.name  }</p>
          <p>Jabatan: {staffDetail.jabatan}</p>
          {/* Tambahkan informasi lainnya sesuai kebutuhan */}
        </div>
      )}
    </div>
  );
};

export default StaffDetail;
