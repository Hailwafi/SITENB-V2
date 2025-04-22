import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const DataCIL = () => {
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const navigate = useNavigate();

  const requests = [
    { id: 1, name: 'Pegawai 1', position: 'Pegawai', type: 'Cuti', date: '2021-01-01', status: 'Ditolak' },
    { id: 2, name: 'Pegawai 1', position: 'Pegawai', type: 'Cuti', date: '2021-01-01', status: 'Tanggal Kadaluarsa' },
    { id: 3, name: 'Pegawai 2', position: 'Pegawai', type: 'Lembur', date: '2021-02-01', status: 'Diterima' },
  ];

  const handleClick = () => {
    navigate("/Staff/PengajuanCIL"); 
  };

  const filteredRequests = requests.filter(request => {
    const matchesDate = dateFilter ? request.date === dateFilter : true;
    const matchesType = typeFilter ? request.type === typeFilter : true;
    return matchesDate && matchesType;
  });

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
            <option value="Cuti">Cuti</option>
            <option value="Lembur">Lembur</option>
          </select>
        </div>
        
        <span className="text-gray-600 text-sm md:text-base">Senin 34 Februari 2060</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full  shadow-md rounded-lg text-sm md:text-base">
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
            {filteredRequests.map(request => (
              <tr key={request.id} className="border-b">
                <td className="px-4 py-2">{request.id}</td>
                <td className="px-4 py-2">{request.name}</td>
                <td className="px-4 py-2">{request.position}</td>
                <td className="px-4 py-2">
                  <span className={`border rounded-full py-1 px-3 ${request.type === 'Cuti' ? 'bg-yellow-400' : ''}`}>
                    {request.type}
                  </span>
                </td>
                <td className="px-4 py-2">{request.date}</td>
                <td className="px-4 py-2">
                  <span className={`text-white py-1 px-3 rounded-full ${request.status === 'Ditolak' ? 'bg-red-500' : 'bg-gray-500'}`}>
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
          <button className="py-1 px-3 border rounded">‹</button>
          <button className="py-1 px-3 bg-blue-500 text-white rounded">1</button>
          <button className="py-1 px-3 border rounded">2</button>
          <button className="py-1 px-3 border rounded">3</button>
          <button className="py-1 px-3 border rounded">4</button>
          <button className="py-1 px-3 border rounded">5</button>
          <button className="py-1 px-3 border rounded">›</button>
        </div>
      </div>
    </div>
  );
};

export default DataCIL;
