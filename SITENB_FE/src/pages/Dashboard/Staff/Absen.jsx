import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { motion } from "framer-motion"; // Mengimpor framer-motion

const Absen = () => {
  const [time, setTime] = useState(new Date());
  const [statusWaktu, setStatusWaktu] = useState("");
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [absenData, setAbsenData] = useState(null); // State untuk data absen
  const [message, setMessage] = useState(""); // Pesan dari API
  const [fotoUrl, setFotoUrl] = useState(""); // URL foto absen
  const [previewData, setPreviewData] = useState(null); // Data yang akan ditampilkan sebagai preview
  const webcamRef = useRef(null);

  // Update waktu setiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      const jakartaTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      });
      setTime(new Date(jakartaTime));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Tentukan status waktu berdasarkan jam
  useEffect(() => {
    const hour = time.getHours();
    const minute = time.getMinutes();
    const totalMinutes = hour * 60 + minute;

    if (totalMinutes < 480) {
      setStatusWaktu("Masuk");
    } else if (totalMinutes >= 480 && totalMinutes < 960) {
      setStatusWaktu("Terlambat");
    } else {
      setStatusWaktu("Pulang");
    }
  }, [time]);

  // Ambil lokasi menggunakan geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    });
  }, []);

  // Fungsi untuk menangani foto dan pengiriman absen
  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
  
    if (!imageSrc) {
      alert("Gagal mengambil gambar. Pastikan kamera aktif.");
      return;
    }
  
    const blob = await (await fetch(imageSrc)).blob();
  
    if (location.lat === null || location.lon === null) {
      alert("Lokasi tidak tersedia. Pastikan GPS aktif.");
      return;
    }
  
    let status = "";
    if (statusWaktu === "Masuk") {
      status = "masuk";
    } else if (statusWaktu === "Terlambat") {
      status = "masuk";
    } else {
      status = "keluar";
    }
  
    const formData = new FormData();
    formData.append("status", status);
    formData.append("latitude", location.lat);
    formData.append("longitude", location.lon);
  
    // Tambahkan file blob dengan nama file dan tipe
    const file = new File([blob], "absen_foto.jpg", { type: "image/jpeg" });
    formData.append("foto", file); // ini penting agar backend mengenali sebagai file
  
    console.log("Data yang akan dikirim ke backend:");
    console.log({
      status,
      latitude: location.lat,
      longitude: location.lon,
      foto: imageSrc,
    });
  
    setPreviewData({
      status,
      latitude: location.lat,
      longitude: location.lon,
      fotoUrl: imageSrc,
    });
  
    const confirmSend = window.confirm("Apakah Anda yakin ingin mengirim data absen?");
    if (confirmSend) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Token tidak ditemukan. Harap login ulang.");
          return;
        }
  
        const response = await axios.post("http://127.0.0.1:8000/api/staff/absen", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
  
        if (response.status === 201) {
          alert("Data absen berhasil dikirim!");
          setMessage(response.data.message);
          setFotoUrl(response.data.foto_url);
          setAbsenData(response.data.data.absen);
        } else {
          alert("Terjadi kesalahan saat mengirim data absen.");
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          console.error("Validasi gagal:", error.response.data.errors);
          alert("Validasi gagal. Periksa data yang dikirim.");
        } else {
          console.error("Gagal mengirim absen:", error);
          alert("Gagal mengirim absen. Silakan coba lagi.");
        }
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <motion.h1
        className="text-xl font-bold text-gray-700 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Absen
      </motion.h1>
      <motion.p
        className="text-gray-500 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Silahkan Absen Masuk dan Keluar dengan Tepat Waktu!!
      </motion.p>

      {/* Menampilkan pesan sukses */}
      {message && (
        <motion.p
          className="text-green-500 font-medium mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {message}
        </motion.p>
      )}

      {/* Menampilkan Preview Data */}
      {previewData && (
        <motion.div
          className="bg-white p-6 rounded-xl shadow text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h3 className="text-lg font-semibold text-gray-700">Preview Data Absen</h3>
          <p className="text-gray-500 mt-2">Status: {previewData.status}</p>
          <p className="text-gray-500 mt-2">Latitude: {previewData.latitude}</p>
          <p className="text-gray-500 mt-2">Longitude: {previewData.longitude}</p>
          <div className="mt-4">
            <img
              src={previewData.fotoUrl}
              alt="Preview Foto Absen"
              className="rounded-lg"
              width="200"
            />
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="font-semibold text-gray-700 mb-4">Silahkan Absen {statusWaktu}</p>
          <div className="flex justify-center mb-4">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-lg w-full max-w-xs"
            />
          </div>
          <motion.button
            onClick={handleCapture}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium"
            whileHover={{ scale: 1.1 }} // Animasi saat hover
            whileTap={{ scale: 0.9 }} // Animasi saat tap
          >
            Ambil Foto
          </motion.button>
        </div>

        <div className="space-y-6">
          <motion.div
            className="bg-white p-6 rounded-xl shadow text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="text-gray-500 font-medium">Jam</p>
            <p className="text-3xl font-bold text-gray-800 tracking-widest">
              {time.toLocaleTimeString("id-ID", { hour12: false })}
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="text-gray-500 font-medium">Status Waktu</p>
            <p className="text-2xl font-bold text-indigo-600">{statusWaktu}</p>
          </motion.div>

          {absenData && (
            <motion.div
              className="bg-white p-6 rounded-xl shadow text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <p className="text-gray-500 font-medium">Hasil Absen</p>
              <img
                src={fotoUrl} // Menampilkan foto menggunakan foto_url
                alt="Foto Absen"
                className="rounded-lg mt-4"
              />
              <p className="text-2xl font-bold text-gray-800 mt-4">Keterangan: {absenData.keterangan}</p>
              <p className="text-sm text-gray-600 mt-2">
                Waktu Absen: {absenData.waktu_absen}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Absen;
