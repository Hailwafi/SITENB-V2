import React from 'react'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from "react-icons/ai";

import { format } from 'date-fns';

const Ck_Tiket = () => {
  const formatString = (str) => {
    return str.replace(/_/g, ' ');
  };
 const navigate = useNavigate();
  const location = useLocation();
  const { ticketData } = location.state || {};
  if (!ticketData) {
    return <p>Data tiket tidak tersedia. Coba ulangi pencarian.</p>;
  }

  const formattedDate = ticketData?.data?.created_at 
  ? format(new Date(ticketData.data.created_at), 'dd MMMM yyyy') 
  : 'Tanggal tidak tersedia';

  return (
    <>
    <Navbar/>
   <div className='relative isolate px-6 pt-14 lg:px-8'>
    <div className='space-y-12'>

    <div className="relative isolate mt-10 lg:px-8">
          <div>
            <div className="space-y-12">
            {/* <h2 className=" text-xl text-center font-semibold leading-7 text-gray-900">Silahkan lengkapi formulir di bawah ini</h2>
                 */}
                {/* <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" /> */}
              <div className="border-b border-gray-900/10 pb-12">
              
              {/* grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 p-4 */}
                <div className="mt-10 grid grid-cols-3  gap-x-6 gap-y-8 sm:grid-cols-9 ">
        
                  <div className="sm:col-span-3">
                    <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
                    Tanggal  :
                    </label>
                    <div className="mt-2">
                      <div
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                    
                        readOnly
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                         {formattedDate}
                      </div>
                    </div>
                  </div>
      
                  <div className="sm:col-span-3">
                    <label htmlFor="account" className="block text-sm font-medium leading-6 text-gray-900">
        Nama

                    </label>
                    <div className="relative mt-2">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
   
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
  </div>
  <div
    id="name"
    name="name"
    type="text"
    autoComplete="name"
    className="block w-full pl-10 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
  >
     {ticketData.data.nama_lengkap}
    </div>
</div>

                  </div>
      
                  <div className="sm:col-span-3">
  <label htmlFor="nip" className="block text-sm font-medium leading-6 text-gray-900">
    NIP :
  </label>
  <div className="mt-2">
    {ticketData?.data?.nomor_induk_pegawai ? (
      <div
        id="nip"
        name="nip"
        type="text"
        autoComplete="nip"
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        {ticketData.data.nomor_induk_pegawai}
      </div>
    ) : (
      <div
        id="nip"
        className="block w-full rounded-md border-0 py-1.5 text-gray-500 bg-gray-100 sm:text-sm sm:leading-6"
        disabled
      >
       Not Available
      </div>
    )}
 </div>
</div>

                  {/* <div className="sm:col-span-3">
                    <label htmlFor="nip" className="block text-sm font-medium leading-6 text-gray-900">
                    NIP        :
                    </label>
                    <div className="mt-2">
                      <div
                        id="nip"
                        name="nip"
                        type="text"
                        
                        autoComplete="nip"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
     {ticketData.data.nip}

                    </div>
                    </div>
                  </div> */}

                  <div className="sm:col-span-3">
                    <label htmlFor="tiket" className="block text-sm font-medium leading-6 text-gray-900">
                    Kode tiket  :
                    </label>
                    <div className="mt-2">
                      <div
                        id="tiket"
                        name="tiket"
                        type="text"
                        autoComplete="tiket"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
 {ticketData.data.kode_tiket}
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                     Email
                    </label>
                    <div className="relative mt-2">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
   
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
</svg>

  </div>
  {/* <div
    id="email"
    name="email"
    type="text"
    autoComplete="email"
    className="block w-full pl-10 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
       {ticketData.data.email}
  </div> */}
  <input
    id="email"
    name="email"
    type="password"
    autoComplete="email"
    className="block w-full pl-10 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={ticketData.data.email}disabled/>
</div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Status       :
                    </label>
                    <div className="mt-2">
                      <div
                        id="email"
                        name="email"
                        type="text"
                        autoComplete="email"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        {ticketData.data.status}
                          </div>
                    </div>
                  </div>
                 
              
                  {/* <div className="sm:col-span-3">
                    <label htmlFor="position" className="block text-sm font-medium leading-6 text-gray-900">
                    Jabatan
                    </label>
                    <div className="mt-2">
                      <select
                        id="position"
                        name="position"
                        type="position"
                        autoComplete="position"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option>Public</option>
                        <option>Kariyawan</option>
                      </select>
                    </div>
                  </div> */}
      
     
                </div>
              </div>
      
            </div>
      
          
          </div>
          </div>

          <div className="relative isolate mt-10 px-6 pt-14 lg:px-8">
    <div>
      <div className="space-y-12">

        <div className="border-b border-gray-900/10 pb-12">
          <div className="">
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              Kategori :
              </label>
              <div className="mt-2">
                <div
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
      {formatString(ticketData.data.kategori)}
              </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Sub Kategori :
              </label>
              <div className="mt-2">
                <div
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                       {ticketData.data.sub_kategori}
              </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Jenis tiket :
              </label>
              <div className="mt-2">
                <div
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                       {ticketData.data.jenis_tiket}
                  
              </div>
              </div>
            </div>

       
        
            {/* <div className="col-span-full">
  <label htmlFor="Lampiran dokumen" className="block text-sm font-medium leading-6 text-gray-900">
    Lampiran dokumen:
  </label>
  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
    <div className="text-center">
      {ticketData?.data?.unggah_file ? (
        <img
          // src={ticketData.data.unggah_file}
         src={`http://127.0.0.1:8000/${ticketData.unggah_file}`} alt="Lampiran dokumen"
          className="mx-auto h-48 w-48 object-cover rounded-lg"
        />
      ) : (
        <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
      )}
    
    </div>
</div>
</div>
     */}
{/* <div className="col-span-full">
  <label htmlFor="Lampiran dokumen" className="block text-sm font-medium leading-6 text-gray-900">
    Lampiran dokumen:
  </label>
  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
    <div className="text-center">
      {ticketData?.data?.unggah_file ? (
        <img
          src={`http://127.0.0.1:8000/${ticketData.data.unggah_file}`} 
          alt="Lampiran dokumen"
          className="mx-auto h-48 w-48 object-cover rounded-lg"
        />
      ) : (
        <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
      )}
    </div>
  </div>
</div> */}
{/* <div>



      {ticketData ? (
        <div>
          <h1>Detail Tiket</h1>
          <p>Kode Tiket: {ticketData.kode_tiket}</p>
          <p>Nama Lengkap: {ticketData.nama_lengkap}</p>
          <p>Deskripsi: {ticketData.deskripsi}</p>

    
          {ticketData.unggah_file ? (
            <img
            src={`http://127.0.0.1:8000/storage/${ticketData.unggah_file}`}
              className="mx-auto h-48 w-48 object-cover rounded-lg"
            />
          ) : (
            <p>Foto tidak tersedia</p>
          )}
        </div>
      ) : (
        <p>Data tiket tidak tersedia</p>
      )}
    </div> */}
{/* 
<div className="col-span-full">
  <label htmlFor="Lampiran dokumen" className="block text-sm font-medium leading-6 text-gray-900">
    Lampiran dokumen:
  </label>
  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
    <div className="text-center">
      {ticketData?.data?.unggah_file ? (
        <a 
          href={`http://127.0.0.1:8000/${ticketData.data.unggah_file}`} 
          target="_blank" // Membuka di tab baru
          rel="noopener noreferrer" // Keamanan tambahan
        >
          <img
            src={`http://127.0.0.1:8000/${ticketData.data.unggah_file}`} 
            alt="Lampiran dokumen"
            className="mx-auto h-48 w-48 object-cover rounded-lg"
          />
        </a>
      ) : (
        <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
      )}
    </div>
  </div>
</div> */}


{/* <div className="col-span-full">
  <label htmlFor="Lampiran dokumen" className="block text-sm font-medium leading-6 text-gray-900">
    Lampiran dokumen:
  </label>
  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
    <div className="text-center">
      {ticketData?.data?.unggah_file ? (
        <a 
          href={`http://127.0.0.1:8000/storage/${ticketData.data.unggah_file}`} 
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={`http://127.0.0.1:8000/storage/${ticketData.data.unggah_file}`} 
            alt="Lampiran dokumen"
            className="mx-auto h-48 w-48 object-cover rounded-lg"
          />
        </a>
      ) : (
        <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
      )}
    </div>
  </div>
</div> */}


            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
              Deskripsi
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder='Deskripsi'
                  value={ticketData?.data?.deskripsi || ''}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                  readOnly 
                />
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
         href="/"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
      Buat tiket baru 
        </button>
      </div> */}
      
    
    </div> 
     <div className="mt-6 flex items-center justify-end gap-x-6">
  <button
    onClick={() => navigate('/')}
    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
  >
    <AiOutlineArrowLeft />
    Kembali

    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 h-5 w-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg> */}

  </button>
</div>
    </div>
    </div>
   </div>

    </>

  )
}

export default Ck_Tiket
