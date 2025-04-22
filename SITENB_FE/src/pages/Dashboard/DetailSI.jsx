import React from 'react';
import { ExternalLink } from 'lucide-react';

const DetailSI = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <h2 className="text-xl font-bold text-gray-700">Pengajuan Cuti/Izin/Lembur</h2>

      <div className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row justify-between gap-6">
        {/* Detail Kiri */}
        <div className="flex-1 space-y-2 text-sm">
          <h3 className="text-base font-semibold mb-2">Detail Pengajuan</h3>
          <div><strong>Nama</strong> : Ruslan Ismail</div>
          <div><strong>Jabatan</strong> : Pegawai</div>
          <div className="flex items-center gap-2">
            <strong>Jenis Pengajuan</strong> : 
            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">Cuti</span>
          </div>
          <div className="flex items-center gap-2">
            <strong>Jenis Cuti</strong> : 
            <span className="bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-medium">Tahunan</span>
          </div>
          <div><strong>Tanggal Pembuatan</strong> : 20/06/2070</div>
          <div><strong>Tanggal Pengajuan</strong> : 01/01/2021 - 05/01/2021</div>
          <div>
            <strong>Catatan</strong> : <br />
            “Saya ingin mengambil cuti pada tanggal [tanggal] karena ada acara penting yang harus saya hadiri.”
          </div>
        </div>

        {/* Dokumen Pendukung */}
        <div className="flex-1">
          <h3 className="text-base font-semibold mb-2">Dokumen Pendukung</h3>
          <div className="border rounded-lg overflow-hidden bg-gray-50 p-2">
            <img
              src="https://via.placeholder.com/300x400?text=Preview+Dokumen"
              alt="Preview dokumen"
              className="w-full h-60 object-cover rounded-md border"
            />
            <div className="flex justify-center mt-2">
              <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                <ExternalLink size={16} />
                Lihat Dokumen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-center gap-4 mt-4">
        <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">Tolak</button>
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Terima</button>
      </div>
    </div>
  );
};

export default DetailSI;
