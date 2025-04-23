import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const DataCIL = () => {
  const [requests, setRequests] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);  // Ganti sesuai jumlah yang diinginkan
  const [currentTime, setCurrentTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token'); // ambil token dari localStorage
        const response = await axios.get('http://127.0.0.1:8000/api/staff/pengajuan', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,  // Kirimkan halaman saat ini ke backend
            perPage: itemsPerPage,  // Jumlah data per halaman
          },
        });
        setRequests(response.data.data);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      }
    };

    fetchRequests();
  }, [currentPage]); // Setiap kali currentPage berubah, fetch ulang data

  useEffect(() => {
    const updateTime = () => {
      const options = { 
        timeZone: 'Asia/Jakarta', 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
      };
      const time = new Date().toLocaleString('id-ID', options);
      setCurrentTime(time);
    };

    updateTime();  // Set initial time
    const intervalId = setInterval(updateTime, 1000);  // Update time every second

    // Cleanup the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleClick = () => {
    navigate("/Staff/PengajuanCIL");
  };

  const filteredRequests = requests.filter(request => {
    const matchesDate = dateFilter ? request.tanggal_pembuatan === dateFilter : true;
    const matchesType = typeFilter ? request.jenis_pengajuan === typeFilter : true;
    return matchesDate && matchesType;
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 md:p-6 mt-10 min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Pengajuan Cuti/Izin/Lembur</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <button
            onClick={handleClick}
            className="bg-yellow-500 text-white py-2 px-4 rounded w-full sm:w-auto"
          >
            Tambah Pengajuan
          </button>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="py-2 px-4 rounded border w-full sm:w-auto"
          />

          <select
            className="py-2 px-4 rounded border w-full sm:w-auto"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">ALL</option>
            <option value="cuti">Cuti</option>
            <option value="lembur">Lembur</option>
            <option value="izin">Izin</option>
          </select>
        </div>
        
        {/* Real-time Date and Time */}
        <span className="text-gray-600 text-sm md:text-base">{currentTime}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full shadow-md rounded-lg text-sm md:text-base">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Jabatan</th>
              <th className="px-4 py-2">Jenis Pengajuan</th>
              <th className="px-4 py-2">Tanggal Pengajuan</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request, index) => (
              <tr key={request.id} className="border-b">
                <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + (index + 1)}</td>
                <td className="px-4 py-2">{request.nama}</td>
                <td className="px-4 py-2">{request.jabatan}</td>
                <td className="px-4 py-2">
                  <span className={`border rounded-full py-1 px-3 ${request.jenis_pengajuan === 'Cuti' ? 'bg-yellow-400' : ''}`}>
                    {request.jenis_pengajuan}
                  </span>
                </td>
                <td className="px-4 py-2">{request.tanggal_pembuatan}</td>
                <td className="px-4 py-2">
                  <span className={`text-white py-1 px-3 rounded-full ${
                    request.status === 'Ditolak' ? 'bg-red-500' :
                    request.status === 'Diterima' ? 'bg-green-500' :
                    'bg-gray-500'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button className="text-blue-500">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
        <span className="text-sm">{filteredRequests.length} dari {requests.length} data</span>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="py-1 px-3 border rounded"
            disabled={currentPage === 1}
          >
            ‹
          </button>
          <button
            onClick={() => handlePageChange(currentPage)}
            className="py-1 px-3 bg-blue-500 text-white rounded"
          >
            {currentPage}
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="py-1 px-3 border rounded"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataCIL;
