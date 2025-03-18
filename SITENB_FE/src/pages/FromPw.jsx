import { PhotoIcon } from '@heroicons/react/24/solid';
import Navbar from '../components/Navbar';
import { useLocation,  useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

const FromPw = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    jabatan: "",
    nomor_induk_pegawai: "",
    kategori: "",
    sub_kategori: "",
    jenis_tiket: "",
    deskripsi: "",
  });
  const maxCharacters = 255;
  const [unggah_file, setUnggah_file] = useState(null);


  const kategoriData = {
    layanan_pengolahan_data: {
      options: [
        { label: 'Laptop', value: 'laptop' },
        { label: 'Komputer', value: 'komputer' },
        { label: 'Printer', value: 'printer' },
      ],
      jenis: {
        laptop: [
          { label: 'Permohonan', value: 'permohonan' },
          { label: 'Kendala', value: 'kendala' },
        ],
        komputer: [
          { label: 'Permohonan', value: 'permohonan' },
          { label: 'Kendala', value: 'kendala' },
        ],
        printer: [
          { label: 'Permohonan', value: 'permohonan' },
        ],
      },
    },
    layanan_jaringan_internet: {
      options: [
        { label: 'Internet', value: 'internet' },
        { label: 'CCTV', value: 'cctv' },
      ],
      jenis: {
        internet: [
          { label: 'Permohonan', value: 'permohonan' },
        ],
        cctv: [
          { label: 'Kendala', value: 'kendala' },
        ],
      },
    },

   layanan_aplikasi: {
      options: [
        { label: 'Pemasangan', value: 'pemasangan' },
        { label: 'Konsultasi', value: 'konsultasi' },
        { label: 'Unplanned Downtime', value: 'unplanned_downtime' },
        { label: 'Email', value: 'email' },
        { label: 'Penetration Test', value: 'penetration_test' },
      ],
      jenis: {
        pemasangan: [
          { label: 'Permohonan', value: 'permohonan' },
          { label: 'Kendala', value: 'kendala' },
        ],
        konsultasi: [
          { label: 'Permohonan', value: 'permohonan' },
          { label: 'Kendala', value: 'kendala' },
        ],
        unplanned_downtime: [
          { label: 'Kendala', value: 'kendala' },
        ],
        email: [
          { label: 'Permohonan', value: 'permohonan' },
          { label: 'Kendala', value: 'kendala' },
        ],
        penetration_test: [
          { label: 'Permohonan', value: 'permohonan' },
          { label: 'Kendala', value: 'kendala' },
        ],
      },
    },

    layanan_aduan_keamanan_siber: {
      options: [
        { label: 'Kebocoran Data', value: 'kebocoran_data' },
        { label: 'Web Defacement', value: 'web_defacement' },
        { label: 'Denial Of Service', value: 'denial_of_service' },
        { label: 'Unauthorized Access', value: 'unauthorized_access' },
        { label: 'Malicious Code', value: 'malicious_code' },
        { label: 'Unplanned Downtime', value: 'unplanned_downtime' },
      ],
      jenis: {
        kebocoran_data: [
          { label: 'Kendala', value: 'kendala' },
        ],
        web_defacement: [
          { label: 'Kendala', value: 'kendala' },
        ],
        denial_of_service: [
          { label: 'Kendala', value: 'kendala' },
        ],
        unauthorized_access: [
          { label: 'Kendala', value: 'kendala' },
        ],
        malicious_code: [
          { label: 'Kendala', value: 'kendala' },
        ],
        unplanned_downtime: [
          { label: 'Kendala', value: 'kendala' },
        ],
      },
    },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    
    if (e.target.name === 'kategori') {
      setFormData({
        ...formData,
        kategori: e.target.value,
        sub_kategori: '', 
        jenis_tiket: '', 
      });
    }

   
    if (e.target.name === 'sub_kategori') {
      setFormData({
        ...formData,
        sub_kategori: e.target.value,
        jenis_tiket: '', 
      });
    }
  };

  const handleImageChange = (e) => {
    setUnggah_file(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      toast.error("Email tidak valid!");
      setIsSubmitting(false); 
      return;
    }

    const submitData = new FormData();
    submitData.append('nama_lengkap', formData.nama_lengkap);
    submitData.append('email', formData.email);
    submitData.append('jabatan', formData.jabatan);
    submitData.append('nomor_induk_pegawai', formData.nomor_induk_pegawai);
    submitData.append('kategori', formData.kategori);
    submitData.append('sub_kategori', formData.sub_kategori);
    submitData.append('jenis_tiket', formData.jenis_tiket);
    submitData.append('deskripsi', formData.deskripsi);
    if (unggah_file) {
      submitData.append('unggah_file', unggah_file);
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/tickets', submitData, {
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
      toast.error("Email harus menggunakan domain @gmail.com.: " + (error.response ? error.response.data.message : "Kesalahan tidak terduga."));
    } finally {
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
                      value={formData.nama_lengkap}
                      placeholder='Masukan Nama Lengkap Anda'
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

                {/* Input Jabatan */}
                <div className="sm:col-span-3">
                  <label htmlFor="jabatan" className="block text-sm font-medium leading-6 text-gray-900">
                    Jabatan
                  </label>
                  <div className="mt-2">
                    <input
                      id="jabatan"
                      name="jabatan"
                      type="text"
                      required
                      placeholder='Masukan Jabatan Anda'
                      value={formData.jabatan}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/* Input Nomor Induk Pegawai */}
                <div className="sm:col-span-3">
                  <label htmlFor="nomor_induk_pegawai" className="block text-sm font-medium leading-6 text-gray-900">
                    Nomor Induk Pegawai
                  </label>
                  <div className="mt-2">
                    <input
                      id="nomor_induk_pegawai"
                      name="nomor_induk_pegawai"
                      type="text"
                      required
                      placeholder='Masukan NIP Anda'
                      value={formData.nomor_induk_pegawai}
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
                    <select
                      id="kategori"
                      name="kategori"
                      required
                      value={formData.kategori}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="" disabled>Pilih Kategori</option>
                      {Object.keys(kategoriData).map((key) => (
                        <option key={key} value={key}>
                          {key.replace(/_/g, ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>


  {/* Input Sub Kategori */}
                {formData.kategori && (
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
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="" disabled>Pilih Sub Kategori</option>
                        {kategoriData[formData.kategori].options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}


                {/* Input Jenis Tiket */}
                {formData.kategori && (
                  <div className="sm:col-span-3">
                    <label htmlFor="jenis_tiket" className="block text-sm font-medium leading-6 text-gray-900">
                      Jenis Tiket
                    </label>
                    <div className="mt-2">
                      <select
                        id="jenis_tiket"
                        name="jenis_tiket"
                        required
                        value={formData.jenis_tiket}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            jenis_tiket: e.target.value,
                          });
                        }}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="" disabled>Pilih Jenis Tiket</option>
                        {kategoriData[formData.kategori].jenis[formData.sub_kategori]?.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

              
                {/* Input Deskripsi */}
                {/* <div className="sm:col-span-3">
                  <label htmlFor="deskripsi" className="block text-sm font-medium leading-6 text-gray-900">
                    Deskripsi
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="deskripsi"
                      name="deskripsi"
                      required
                      value={formData.deskripsi}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      rows={4}
                    />
                  </div>
                </div> */}
                <div className="sm:col-span-3">
  <label htmlFor="deskripsi" className="block text-sm font-medium leading-6 text-gray-900">
    Deskripsi
  </label>
  <div className="mt-2">
    <textarea
      id="deskripsi"
      name="deskripsi"
      required
      value={formData.deskripsi}
      onChange={handleChange}
      maxLength={255} 
      placeholder='Silahkan Isi Deskripsi'
      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      rows={4}
    />
  </div>
  <p className="text-sm text-gray-500 mt-1">
        {formData.deskripsi.length}/{maxCharacters} Karakter
        </p>
</div>


                {/* Input Unggah File */}
                <div className="sm:col-span-3">
                  <label htmlFor="unggah_file" className="block text-sm font-medium leading-6 text-gray-900">
                    Unggah File
                  </label>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="unggah_file"
                      onChange={handleImageChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/* Tombol Submit */}
                {/* <div className="mt-6">
                  <button
                    type="submit"
                    className="block w-full rounded-md bg-indigo-600 py-1.5 text-white font-semibold shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  >
                    Kirim
                  </button> */}
                        <div className="mt-6 flex items-center justify-end gap-x-6">
            <button  onClick={() => navigate('/TiketPw')} type="button" className="text-sm font-semibold leading-6 text-gray-900">
              Cancel
            </button>
            {/* <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
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
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default FromPw;
