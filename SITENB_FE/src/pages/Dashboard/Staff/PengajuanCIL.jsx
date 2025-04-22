import { useState } from "react";
import axios from "axios";

export default function PengajuanCIL() {
  const [formData, setFormData] = useState({
    nama: "",
    jabatan: "",
    tanggal: new Date().toISOString().split("T")[0],
    jenis: "Lembur",
    catatan: "",
    dokumen: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "dokumen") {
      const file = files[0];
      setFormData({ ...formData, dokumen: file });
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post("https://yourapi.com/api/pengajuan", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Pengajuan berhasil dikirim!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengirim pengajuan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-xl font-semibold mb-4">Isi Data Pengajuan</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Nama*</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="Masukan Nama"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Dokumen Pendukung*</label>
          <input
            type="file"
            name="dokumen"
            accept="image/*,application/pdf"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Jabatan*</label>
          <input
            type="text"
            name="jabatan"
            value={formData.jabatan}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="Pilih Jabatan"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Tanggal Pembuatan*</label>
          <input
            type="text"
            value={formData.tanggal}
            className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Jenis Pengajuan*</label>
          <select
            name="jenis"
            value={formData.jenis}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          >
            <option value="Cuti">Cuti</option>
            <option value="Izin">Izin</option>
            <option value="Lembur">Lembur</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Catatan*</label>
          <textarea
            name="catatan"
            value={formData.catatan}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            placeholder="Isi Catatan"
            required
          ></textarea>
        </div>

        <div className="md:col-span-2 text-right">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
          >
            {loading ? "Mengirim..." : "Kirim"}
          </button>
        </div>
      </form>
    </div>
  );
}


