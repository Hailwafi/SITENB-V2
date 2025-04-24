import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DetailPgj = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = () => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:8000/api/admin/pengajuan/${id}/detail`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Gagal memuat data.');
        setLoading(false);
      });
  };

  const handleVerifikasi = (statusBaru) => {
    setVerifying(true);
    const token = localStorage.getItem('token');
    axios.post(`http://localhost:8000/api/admin/pengajuan/${id}/verifikasi`, {
      status_pengajuan: statusBaru
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        fetchData(); // Refresh data setelah berhasil update
      })
      .catch(() => {
        alert('Gagal memverifikasi.');
      })
      .finally(() => setVerifying(false));
  };

  if (loading) return <div className="p-6">Memuat...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return <div className="p-6">Data tidak ditemukan.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-xl font-bold text-gray-700 mb-4">Detail Pengajuan</h1>
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex justify-between"><span className="font-medium">ID Pengajuan:</span><span>{data.id}</span></div>
          <div className="flex justify-between"><span className="font-medium">Nama:</span><span>{data.nama}</span></div>
          <div className="flex justify-between"><span className="font-medium">Jabatan:</span><span>{data.jabatan}</span></div>
          <div className="flex justify-between"><span className="font-medium">Jenis Pengajuan:</span><span>{data.jenis_pengajuan}</span></div>
          <div className="flex justify-between"><span className="font-medium">Tanggal Pengajuan:</span><span>{data.tanggal_pengajuan}</span></div>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full font-semibold">
              {data.status}
            </span>
          </div>
          <div>
            <span className="font-medium block mb-1">Keterangan:</span>
            <p className="bg-gray-50 p-3 rounded-lg border text-gray-600">{data.catatan}</p>
          </div>

          {/* Tampilkan tombol verifikasi hanya jika status masih proses */}
          {data.status === 'proses' && (
          <div className="pt-4 flex gap-4">
          <button
            onClick={() => handleVerifikasi(data.jenis_pengajuan === 'cuti' ? 'cuti' : 'izin')}
            disabled={verifying}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            ACC
          </button>
          <button
            onClick={() => handleVerifikasi('ditolak')}
            disabled={verifying}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Tolak
          </button>
        </div>
        
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPgj;
