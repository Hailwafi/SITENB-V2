import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DetailPgj = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token'); // Ambil token dari localStorage

    axios.get(`http://localhost:8000/api/admin/pengajuan/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setData(response.data.data); // asumsi response { data: { data: {...} } }
        setLoading(false);
      })
      .catch(error => {
        setError('Gagal memuat data.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6">Memuat...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return <div className="p-6">Data tidak ditemukan.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-xl font-bold text-gray-700 mb-4">Detail Pengajuan</h1>
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">ID Pengajuan:</span>
            <span>{data.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Nama:</span>
            <span>{data.nama}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Jabatan:</span>
            <span>{data.jabatan}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Jenis Pengajuan:</span>
            <span>{data.jenis}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Tanggal Pengajuan:</span>
            <span>{data.tanggal}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full font-semibold">
              {data.status}
            </span>
          </div>
          <div>
            <span className="font-medium block mb-1">Keterangan:</span>
            <p className="bg-gray-50 p-3 rounded-lg border text-gray-600">{data.keterangan}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPgj;
