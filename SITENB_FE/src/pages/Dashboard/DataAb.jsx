import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

import {
  Clock,
  CalendarDays,
  UserCheck,
  UserX,
  Briefcase,
  Hourglass,
  Search
} from 'lucide-react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DataAb = () => {
  const [dataAbsensi, setDataAbsensi] = useState([]);
  const [jumlahData, setJumlahData] = useState({
    masuk: 0,
    terlambat: 0,
    izin: 0,
    cuti: 0,
    lembur: 0
  });

  const [chartData, setChartData] = useState({
    labels: ['Masuk', 'Terlambat', 'Izin', 'Cuti', 'Lembur'],
    datasets: [
      {
        label: 'Jumlah',
        data: [0, 0, 0, 0, 0],
        backgroundColor: ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#000000'],
      },
    ],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios.get('http://127.0.0.1:8000/api/admin/statistik-absensi', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      .then((response) => {
        const data = response.data.data;
        setDataAbsensi(data);

        // Hitung jumlah berdasarkan status_masuk
        let masuk = 0, terlambat = 0, izin = 0, cuti = 0, lembur = 0;

        data.forEach(item => {
          const status = item.status_masuk?.toLowerCase();
          if (status === 'tepat waktu') masuk++;
          if (status === 'terlambat') terlambat++;
          if (status === 'izin') izin++;
          if (status === 'cuti') cuti++;
          if (status === 'lembur') lembur++;
        });

        setJumlahData({ masuk, terlambat, izin, cuti, lembur });

        setChartData({
          labels: ['Masuk', 'Terlambat', 'Izin', 'Cuti', 'Lembur'],
          datasets: [
            {
              label: 'Jumlah',
              data: [masuk, terlambat, izin, cuti, lembur],
              backgroundColor: ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#000000'],
            },
          ],
        });
      })
      .catch((error) => {
        console.error('Gagal mengambil data:', error);
      });
    }
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h2 className="text-2xl font-semibold mb-6">Laporan & Statistik Absensi Pegawai</h2>

      <div className="grid grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Tepat Waktu', count: jumlahData.masuk, color: 'bg-blue-500', icon: <UserCheck size={20} className="text-white" /> },
          { label: 'Terlambat', count: jumlahData.terlambat, color: 'bg-red-500', icon: <Clock size={20} className="text-white" /> },
          { label: 'Izin', count: jumlahData.izin, color: 'bg-green-500', icon: <UserX size={20} className="text-white" /> },
          { label: 'Cuti', count: jumlahData.cuti, color: 'bg-yellow-500', icon: <Briefcase size={20} className="text-white" /> },
          { label: 'Lembur', count: jumlahData.lembur, color: 'bg-black', icon: <Hourglass size={20} className="text-white" /> },
        ].map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${item.color}`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-bold">{item.count}</h3>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Laporan Absensi Pegawai</h3>

          <div className="flex items-center gap-2 mb-4">
            <button className="bg-gray-200 text-sm px-3 py-1 rounded-md flex items-center gap-1">
              <CalendarDays size={16} /> Filter Hari
            </button>
            <div className="flex flex-1 items-center border border-gray-300 rounded-md px-2 py-1">
              <Search size={16} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Cari nama pegawai..."
                className="flex-1 text-sm outline-none"
              />
            </div>
          </div>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">No</th>
                <th className="p-2">Nama</th>
                <th className="p-2">Jabatan</th>
                <th className="p-2">Absen Masuk</th>
                <th className="p-2">Status</th>
                <th className="p-2">Absen Keluar</th>
                <th className="p-2">Status</th>
                <th className="p-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {dataAbsensi.map((absen, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{absen.nama}</td>
                  <td className="p-2">{absen.jabatan}</td>
                  <td className="p-2">{absen.absenMasuk}</td>
                  <td className="p-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">{absen.status_masuk}</span>
                  </td>
                  <td className="p-2">{absen.absenKeluar}</td>
                  <td className="p-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">{absen.statusKeluar}</span>
                  </td>
                  <td className="p-2 text-center">🔍</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4 space-x-1">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className="w-8 h-8 rounded-full border text-sm hover:bg-blue-500 hover:text-white"
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Statistik Absensi</h3>
          <div className="mb-4">
            <button className="bg-gray-200 text-sm px-3 py-1 rounded-md flex items-center gap-1">
              <CalendarDays size={16} /> Filter Hari
            </button>
          </div>
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default DataAb;
