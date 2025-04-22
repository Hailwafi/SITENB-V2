import React from 'react';
import { Search, CalendarIcon, ZoomIn } from 'lucide-react';

const data = [
  { no: 1, nama: 'Ruslan Ismail', jabatan: 'Pegawai', jenis: 'Cuti', tanggal: '20/06/2070' },
  { no: 2, nama: 'Ahmad Abdullah', jabatan: 'Pegawai', jenis: 'Izin', tanggal: '60/70/7070' },
  { no: 3, nama: 'Surya Firdaus', jabatan: 'Pegawai', jenis: 'Lembur', tanggal: '20/06/2070' },
  { no: 4, nama: 'Ismail Sulaiman', jabatan: 'Pegawai', jenis: 'Cuti', tanggal: '60/70/7070' },
  { no: 5, nama: 'Rahman Mansur', jabatan: 'Pegawai', jenis: 'Lembur', tanggal: '20/06/2070' },
  { no: 6, nama: 'Buana Ahmad', jabatan: 'Pegawai', jenis: 'Cuti', tanggal: '20/06/2070' },
  { no: 7, nama: 'Putri Melati', jabatan: 'Pegawai', jenis: 'Izin', tanggal: '20/06/2070' },
  { no: 8, nama: 'Wira Cahya', jabatan: 'Pegawai', jenis: 'Lembur', tanggal: '20/06/2070' },
  { no: 9, nama: 'Mohamad Zakaria', jabatan: 'Pegawai', jenis: 'Cuti', tanggal: '20/06/2070' },
  { no: 10, nama: 'Putra Idris', jabatan: 'Pegawai', jenis: 'Lembur', tanggal: '20/06/2070' },
];

const JenisBadge = ({ jenis }) => {
  const color = {
    Cuti: 'bg-yellow-200 text-yellow-800',
    Izin: 'bg-green-200 text-green-800',
    Lembur: 'bg-gray-600 text-white',
  }[jenis];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {jenis}
    </span>
  );
};

const DataSI = () => {
  return (
    <div className="p-6 space-y-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-700">Pengajuan Cuti/Izin/Lembur</h1>

      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 items-center">
            <button className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm">Semua</button>
            <div className="relative">
              <input
                type="text"
                placeholder="Cari Nama ........"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl">
            <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">Senin, 24 Februari 2060</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Jabatan</th>
                <th className="px-4 py-2">Jenis Pengajuan</th>
                <th className="px-4 py-2">Tanggal Pembuatan</th>
                <th className="px-4 py-2">Status Pengajuan</th>
                <th className="px-4 py-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.no} className="border-b">
                  <td className="px-4 py-2">{item.no}</td>
                  <td className="px-4 py-2">{item.nama}</td>
                  <td className="px-4 py-2">{item.jabatan}</td>
                  <td className="px-4 py-2"><JenisBadge jenis={item.jenis} /></td>
                  <td className="px-4 py-2">{item.tanggal}</td>
                  <td className="px-4 py-2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Proses</span>
                  </td>
                  <td className="px-4 py-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <ZoomIn className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4 space-x-1 text-sm">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              className={`px-3 py-1 rounded-full ${num === 2 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataSI;
