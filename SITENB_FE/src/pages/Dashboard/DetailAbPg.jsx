import React from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';

const DetailAbP = () => {
  const data = {
    nama: 'Ruslan Ismail',
    jabatan: 'Pegawai',
    absensi: [
      {
        waktu: '07:00:45',
        status: 'Masuk',
        foto: '/path-to-image/kucing.png',
        koordinat: '/path-to-image/maps.png',
        warna: 'bg-indigo-100 text-indigo-700'
      },
      {
        waktu: '16:00:00',
        status: 'Lembur',
        foto: '/path-to-image/kucing.png',
        koordinat: '/path-to-image/maps.png',
        warna: 'bg-gray-300 text-gray-800'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f4f4fa] p-6 font-sans">
      {/* Judul */}
      <h2 className="text-lg font-semibold mb-4">Detail Absen Pegawai</h2>

      {/* Card */}
      <div className="bg-white rounded-xl p-6 shadow-md max-w-3xl mx-auto">
        {/* Info Nama & Jabatan */}
        <div className="mb-6">
          <p className="text-sm mb-1">Nama <span className="ml-6">: {data.nama}</span></p>
          <p className="text-sm">Jabatan <span className="ml-4">: {data.jabatan}</span></p>
        </div>

        {data.absensi.map((item, i) => (
          <div key={i} className="border-t pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
            <div className="grid grid-cols-4 text-xs items-center gap-4 mb-2">
              <p className="col-span-1">Absen</p>
              <p className="col-span-1">Status</p>
              <p className="col-span-1">Foto Absen</p>
              <p className="col-span-1">Koordinat Absen</p>
            </div>
            <div className="grid grid-cols-4 items-center text-sm">
              <p className="col-span-1 font-mono">{item.waktu}</p>
              <div className="col-span-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${item.warna}`}>
                  {item.status}
                  <ChevronDown size={14} className="ml-1" />
                </span>
              </div>
              <div className="col-span-1">
                <img src={item.foto} alt="foto absen" className="w-12 h-12 rounded-full object-cover" />
              </div>
              <div className="col-span-1">
                <img src={item.koordinat} alt="koordinat absen" className="w-12 h-12 rounded-full object-cover" />
              </div>
            </div>
          </div>
        ))}

        {/* Back Button */}
        <div className="mt-6">
          <button className="text-sm text-gray-600 flex items-center hover:underline">
            <ChevronLeft size={18} className="mr-1" /> Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailAbP;
