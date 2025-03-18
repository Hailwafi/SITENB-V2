// src/pages/WorkStaff.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WorkStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/admin/pantau-pekerjaan', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Staff List:', response.data); // Debug log
        setStaffList(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffList();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Daftar Staff</h1>
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Jabatan</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((pekerjaan) => (
            <tr key={pekerjaan.staff}> {/* gunakan pekerjaan.staff sebagai key */}
              <td>{pekerjaan.nama}</td>
              <td>{pekerjaan.jabatan}</td>
              <td>
                {/* <button
                  onClick={() => {
                    console.log('Navigating to staff with ID:', pekerjaan.staff); // Debug log
                    navigate(`/TesAdmin/${pekerjaan.staff}`); // gunakan pekerjaan.staff untuk navigasi
                  }}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Detail
                </button> */}
             <button
        onClick={() => {
            console.log('Navigating to staff with ID:', pekerjaan.staff);
            navigate(`/Dashboard/${pekerjaan.staff}`); // Ubah di sini
        }}
        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
    >
        Detail
    </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkStaff;
