import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

import {
  Clock,
  CalendarDays,
  UserCheck,
  UserX,
  Briefcase,
  Hourglass
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardAbsensi = () => {
  const [dataAbsensi, setDataAbsensi] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [statistikData, setStatistikData] = useState({});
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // Fungsi untuk mengambil data absensi berdasarkan tanggal
    const fetchData = async (tanggal = '') => {
      const token = localStorage.getItem('token');

      try {
        // Menentukan endpoint berdasarkan apakah ada tanggal yang dipilih atau tidak
        const endpoint = tanggal
          ? `http://127.0.0.1:8000/api/staff/statistik-absensi?tanggal=${tanggal}`
          : 'http://127.0.0.1:8000/api/staff/statistik-absensi';

        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data, statistik_2 } = res.data;

        setDataAbsensi(data);
        setStatistikData(statistik_2);

        setChartData({
          labels: ['Tepat Waktu', 'Terlambat', 'Izin', 'Cuti', 'Lembur'],
          datasets: [
            {
              label: 'Jumlah Kehadiran',
              data: [
                statistik_2.tepat_waktu,
                statistik_2.terlambat,
                statistik_2.izin,
                statistik_2.cuti,
                statistik_2.lembur,
              ],
              backgroundColor: ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#000000'],
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error('Gagal mengambil data:', err);
      }
    };

    fetchData(selectedDate);  // Memanggil fetchData dengan tanggal yang dipilih
  }, [selectedDate]);  // Memastikan useEffect dijalankan saat selectedDate berubah

  const handleFilterChange = (e) => {
    setSelectedDate(e.target.value);  // Mengubah tanggal yang dipilih
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen font-sans">
      <h2 className="text-2xl font-semibold mb-6">Laporan & Statistik Absensi Pegawai</h2>

      {/* Ringkasan Cepat */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        {['Tepat Waktu', 'Terlambat', 'Izin', 'Cuti', 'Lembur'].map((label, index) => {
          const iconList = [<UserCheck />, <Clock />, <UserX />, <Briefcase />, <Hourglass />];
          const colors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-black'];

          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-4 text-center">
              <div className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${colors[index]}`}>
                {React.cloneElement(iconList[index], { size: 20, className: 'text-white' })}
              </div>
              <h3 className="text-xl font-bold">{chartData?.datasets[0]?.data[index] || 0}</h3>
              <p className="text-sm text-gray-600">{label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tabel Absensi */}
        <div className="col-span-2 bg-white rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Laporan Absensi Pegawai</h3>

          {/* Filter dan Search */}
          <div className="flex items-center gap-2 mb-4">
            <label className="bg-gray-200 text-sm px-3 py-1 rounded-md flex items-center gap-1 cursor-pointer">
              <CalendarDays size={16} />
              <input type="date" className="ml-2 bg-transparent outline-none" value={selectedDate} onChange={handleFilterChange} />
            </label>
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
                  <td className="p-2">{absen.absen_masuk}</td>
                  <td className="p-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">{absen.status_masuk}</span>
                  </td>
                  <td className="p-2">{absen.absen_keluar}</td>
                  <td className="p-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">{absen.status_keluar}</span>
                  </td>
                  <td className="p-2 text-center">🔍</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl p-4 shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Statistik Absensi</h3>
          <div className="w-full max-w-xs mx-auto">
            {chartData && <Pie data={chartData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAbsensi;
