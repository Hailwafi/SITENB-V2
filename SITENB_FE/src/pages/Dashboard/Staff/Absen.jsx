import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const Absen = () => {
  const [time, setTime] = useState(new Date());
  const [statusWaktu, setStatusWaktu] = useState("");
  const [location, setLocation] = useState({ lat: null, lon: null });
  const webcamRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const jakartaTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      });
      setTime(new Date(jakartaTime));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    });
  }, []);

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    // Ubah base64 ke Blob
    const blob = await (await fetch(imageSrc)).blob();

    // Ambil token dari localStorage
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Token tidak ditemukan. Harap login ulang.");
      return;
    }

    // Buat FormData
    const formData = new FormData();
    formData.append("foto", blob, "absen.jpg");
    formData.append("status", statusWaktu.toLowerCase()); // contoh: "masuk"
    formData.append("latitude", location.lat);
    formData.append("longitude", location.lon);

    try {
      const response = await axios.post("http://localhost:8000/api/absen", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Data absen berhasil dikirim!");
      console.log(response.data);
    } catch (error) {
      console.error("Gagal mengirim absen:", error);
      alert("Gagal mengirim absen. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold text-gray-700 mb-2">Absen</h1>
      <p className="text-gray-500 mb-6">Silahkan Absen Masuk dan Keluar dengan Tepat Waktu!!</p>

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
          <button
            onClick={handleCapture}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium"
          >
            Ambil Foto
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500 font-medium">Jam</p>
            <p className="text-3xl font-bold text-gray-800 tracking-widest">
              {time.toLocaleTimeString("id-ID", { hour12: false })}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500 font-medium">Status Waktu</p>
            <p className="text-2xl font-bold text-indigo-600">{statusWaktu}</p>
          </div>

          <div className="text-sm text-gray-600">
            <p className="mb-1">
              <span className="text-blue-600 font-bold">&lt; 08:00</span> = Masuk
            </p>
            <p className="mb-1">
              <span className="text-red-500 font-bold">&gt; 08:00</span> = Terlambat
            </p>
            <p>
              <span className="text-indigo-600 font-bold">16:00</span> = Pulang
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Absen;
