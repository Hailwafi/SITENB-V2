import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, CalendarIcon, ZoomIn } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [jenisFilter, setJenisFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/admin/pengajuan', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data.data);
    } catch (error) {
      console.error('Gagal memuat data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const namaMatch = item.nama.toLowerCase().includes(search.toLowerCase());
    const jenisMatch = jenisFilter === 'Semua' || item.jenis_pengajuan === jenisFilter;
    return namaMatch && jenisMatch;
  });

  return (
    <div className="p-6 space-y-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-700">Pengajuan Cuti/Izin/Lembur</h1>

      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
              value={jenisFilter}
              onChange={(e) => setJenisFilter(e.target.value)}
            >
              <option value="Semua">ALL</option>
              <option value="izin">Izin</option>
              <option value="cuti">Cuti</option>
              <option value="lembur">Lembur</option>
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Cari Staff"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl">
            <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">{new Date().toLocaleDateString('id-ID', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-gray-500">Memuat data...</p>
          ) : (
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
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{item.nama}</td>
                    <td className="px-4 py-2">{item.jabatan}</td>
                    <td className="px-4 py-2"><JenisBadge jenis={item.jenis_pengajuan} /></td>
                    <td className="px-4 py-2">{item.tanggal_pembuatan}</td>
                    <td className="px-4 py-2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                    <Link to={`/Dashboard/DetailPgj/${item.id}`} className="p-2 hover:bg-gray-100 rounded-full inline-block">
  <ZoomIn className="w-4 h-4 text-gray-600" />
</Link>


                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataSI;
