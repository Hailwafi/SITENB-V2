import { PhotoIcon } from '@heroicons/react/24/solid';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useState, useEffect } from 'react';

const FormPb = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    kategori: "",
    jenis_tiket: "",
    sub_kategori: "",
    deskripsi: "",
  });
  const maxCharacters = 255;

  const [unggah_file, setUnggah_file] = useState(null);

  useEffect(() => {
    if (location.state) {
      setFormData({
        kategori: location.state.kategori || '',
        jenis_tiket: location.state.jenis_tiket || '',
        sub_kategori: location.state.sub_kategori || '',
        deskripsi: '',
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5242880) { // Batasi ukuran file maksimal 1MB
      toast.error("Ukuran file terlalu besar. Maksimal 1MB.");
      return;
    }
    setUnggah_file(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      toast.error("Email tidak valid!");
      return;
    }

    const submitData = new FormData();
    submitData.append('nama_lengkap', formData.nama_lengkap);
    submitData.append('email', formData.email);
    submitData.append('kategori', formData.kategori);
    submitData.append('jenis_tiket', formData.jenis_tiket);
    submitData.append('sub_kategori', formData.sub_kategori);
    submitData.append('deskripsi', formData.deskripsi);
    if (unggah_file) {
      submitData.append('unggah_file', unggah_file);
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/publiks', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        toast.success('Pengajuan berhasil!');
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        toast.error(`Error: ${response.data.message || "Terjadi kesalahan."}`);
      }
    } catch (error) {
      console.error("Error :", error.response ? error.response.data : error);
      toast.error("Terjadi kesalahan: " + (error.response ? error.response.data.message : "Kesalahan tidak terduga."));
    }finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <Navbar />
      <div className="relative isolate mt-10 px-6 pt-14 lg:px-52">
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <h2 className="text-xl text-center font-semibold leading-7 text-gray-900">
              Silahkan lengkapi formulir di bawah ini
            </h2>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 gap-x-6 gap-y-8">
                {/* Input Nama */}
                <div className="sm:col-span-3">
                  <label htmlFor="nama_lengkap" className="block text-sm font-medium leading-6 text-gray-900">
                    Nama
                  </label>
                  <div className="mt-2">
                    <input
                      id="nama_lengkap"
                      name="nama_lengkap"
                      type="text"
                      required
                      placeholder='Masukan Nama Lengkap Anda'
                      value={formData.nama_lengkap}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/* Input Email */}
                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder='Masukan Email Anda'
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/* Input Kategori */}
                <div className="sm:col-span-3">
                  <label htmlFor="kategori" className="block text-sm font-medium leading-6 text-gray-900">
                    Kategori
                  </label>
                  <div className="mt-2">
                    <input
                      id="kategori"
                      name="kategori"
                      type="text"
                      required
                      readOnly
                      value={formData.kategori.replace(/_/g, ' ')}  
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/* Input Jenis Tiket */}
                <div className="sm:col-span-3">
                  <label htmlFor="jenis_tiket" className="block text-sm font-medium leading-6 text-gray-900">
                    Jenis Tiket
                  </label>
                  <div className="mt-2">
                    <input
                      id="jenis_tiket"
                      name="jenis_tiket"
                      type="text"
                      required
                      readOnly
                      value={formData.jenis_tiket}
                      onChange={(e) => setFormData({ ...formData, jenis_tiket: e.target.value })}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/* Input Sub Kategori */}
                <div className="sm:col-span-3">
                  <label htmlFor="sub_kategori" className="block text-sm font-medium leading-6 text-gray-900">
                    Sub Kategori
                  </label>
                  <div className="mt-2">
                    <select
                      id="sub_kategori"
                      name="sub_kategori"
                      required
                      value={formData.sub_kategori}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                         <option>Kebocoran Data</option>
                         <option>Web Defacement</option>
                         <option>Denial Of Service</option>
                         <option>Unauthorized Access</option>
                         <option>Malicious Code</option>
                         <option>Unplanned Downtime</option>
                      </select>
                  </div>
                </div>

                {/* Input Deskripsi */}
                <div className="sm:col-span-3">
                  <label htmlFor="deskripsi" className="block text-sm font-medium leading-6 text-gray-900">
                    Deskripsi
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="deskripsi"
                      name="deskripsi"
                      required
                      value={formData.deskripsi || ""} // Pastikan deskripsi selalu memiliki nilai string
                      onChange={handleChange}
                      maxLength={255} 
                      placeholder='Silahkan Isi Deskripsi'
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      {(formData.deskripsi || "").length}/{maxCharacters} Karakter
                    </p>
                  </div>
                </div>

                {/* Upload File */}
                {/* <div className="sm:col-span-3">
                  <label htmlFor="unggah_file" className="block text-sm font-medium leading-6 text-gray-900">
                    Unggah File
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label htmlFor="unggah_file" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                          <span>Upload a file</span>
                          <input
                            id="unggah_file"
                            name="unggah_file"
                            type="file"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 1MB</p>
                    </div>
                  </div>
                </div> */}
 <div className="sm:col-span-3">
                  <label htmlFor="unggah_file" className="block text-sm font-medium leading-6 text-gray-900">
                    Unggah File
                  </label>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="unggah_file"
                      required
                      onChange={handleImageChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
              Batal
            </button>
            {/* <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Ajukan
            </button> */}

<button
                type="submit"
                disabled={isSubmitting} 
                className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  isSubmitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
                }`}
              >
                {isSubmitting ? 'Memproses...' : 'Ajukan'}
              </button>

          </div>
        </form>
      </div>
    </>
  );
};

export default FormPb;
