import { useState } from "react";
import axios from "axios";

export default function PengajuanCIL() {
  const [formData, setFormData] = useState({
    nama: "",
    jabatan: "",
    tanggal_dari: new Date().toISOString().split("T")[0],
    tanggal_sampai: new Date().toISOString().split("T")[0],
    jenis_pengajuan: "lembur",
    jenis_cuti: "",
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

  const formatTanggal = (tanggal) => {
    const tgl = new Date(tanggal);
    const day = String(tgl.getDate()).padStart(2, "0");
    const month = String(tgl.getMonth() + 1).padStart(2, "0");
    const year = tgl.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const tanggal_pengajuan = `${formatTanggal(formData.tanggal_dari)} s.d ${formatTanggal(formData.tanggal_sampai)}`;

    const data = new FormData();
    data.append("nama", formData.nama);
    data.append("jabatan", formData.jabatan);
    data.append("tanggal_pengajuan", tanggal_pengajuan);
    data.append("jenis_pengajuan", formData.jenis_pengajuan);
    if (formData.jenis_pengajuan === "cuti") {
      data.append("jenis_cuti", formData.jenis_cuti);
    }
    data.append("catatan", formData.catatan);
    data.append("dokumen", formData.dokumen);

    console.log("Data yang dikirim ke backend:");
    console.log({
      nama: formData.nama,
      jabatan: formData.jabatan,
      tanggal_pengajuan,
      jenis_pengajuan: formData.jenis_pengajuan,
      jenis_cuti: formData.jenis_pengajuan === "cuti" ? formData.jenis_cuti : undefined,
      catatan: formData.catatan,
      dokumen: formData.dokumen?.name,
    });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token tidak ditemukan. Harap login ulang.");
        setLoading(false);
        return;
      }

      const response = await axios.post("http://127.0.0.1:8000/api/staff/membuat", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Pengajuan berhasil dikirim!");
      console.log("Response dari server:", response.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Terjadi kesalahan saat mengirim pengajuan.");
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
            <img src={previewUrl} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
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
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Tanggal Pengajuan (Dari)*</label>
          <input
            type="date"
            name="tanggal_dari"
            value={formData.tanggal_dari}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Sampai Dengan Tanggal*</label>
          <input
            type="date"
            name="tanggal_sampai"
            value={formData.tanggal_sampai}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Jenis Pengajuan*</label>
          <select
            name="jenis_pengajuan"
            value={formData.jenis_pengajuan}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          >
            <option value="cuti">Cuti</option>
            <option value="izin">Izin</option>
            <option value="lembur">Lembur</option>
          </select>
        </div>

        {formData.jenis_pengajuan === "cuti" && (
          <div>
            <label className="block text-sm font-medium">Jenis Cuti*</label>
            <select
              name="jenis_cuti"
              value={formData.jenis_cuti}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            >
              <option value="">-- Pilih Jenis Cuti --</option>
              <option value="tahunan">Cuti Tahunan</option>
              <option value="melahirkan">Cuti Melahirkan</option>
              <option value="duka">Cuti Duka</option>
            </select>
          </div>
        )}

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
