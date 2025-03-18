import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const StaffDetail = () => {
  const { id } = useParams();
  const [staffDetail, setStaffDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/admin/staff-tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStaffDetail(response.data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };

    fetchStaffData();
  }, [id]);

  const isImageFile = (filePath) => {
    const ext = filePath.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
};

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (!staffDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative px-4 pt-24 sm:px-6 lg:px-8">
      <a
        href="/Dashboard/Tiket"
        className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-blue-300 inline-flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="sr-only">Search</span>
      </a>

      <div className="flex justify-between items-center w-full mt-4">
      <div className="flex flex-col">
  <a>{staffDetail.judul}</a>
  <a>Total Tugas :{staffDetail.total_tugas}</a>
</div>

        <form className="flex items-center w-full sm:max-w-xs">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-2.5"
              placeholder="Cari tiket berdasarkan nama"
              value={searchTerm}
              onChange={handleSearch}
              required
            />
          </div>
          <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </form>
        
      </div>
      <div className="overflow-x-auto shadow-md sm:rounded-lg mt-4">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">No</th>
              <th scope="col" className="px-6 py-3">Tanggal</th>
              <th scope="col" className="px-6 py-3">Bukti Pengerjaan</th>
              <th scope="col" className="px-6 py-3">Kategori</th>
              <th scope="col" className="px-6 py-3">Jenis Tiket</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {staffDetail.success && staffDetail.data.length > 0 ? (
              staffDetail.data.map((work, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4">{work.tanggal}</td>
                  {isImageFile(work.bukti_pengerjaan) && (
                                                <div className="px-6 py-4 ">
                                                    <a
                                                        href={work.bukti_pengerjaan}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-block rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                                    >
                                                        Lihat Foto
                                                    </a>
                                                </div>
                                            )}
                  <td className="px-6 py-4">{work.kategori}</td>
                  <td className="px-6 py-4">{work.jenis_tiket}</td>
                  <td className="px-6 py-4">{work.status}</td>
                </tr>
              ))
            ) : (
              
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  Tidak ada pekerjaan yang ditemukan untuk staf ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffDetail;
