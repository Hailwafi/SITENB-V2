import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import Navbar from '../components/Navbar';

import { useNavigate } from 'react-router-dom';

const TiketPw = () => {

  const navigate = useNavigate();

  const handleButtonClick = (data) => {
   navigate('/FromPw', { state: { ...data } });
 };
 
  return (
    <>
      <div className='relative isolate px-4 pt-24 sm:px-6 lg:px-8'>
        <Navbar />


  <div className='flex justify-between items-center'>
    <a href="/" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-blue-300 inline-flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z" clipRule="evenodd" />
      </svg>
      <span className="sr-only">Search</span>
    </a>
    <span className="text-3xl  font-bold  leading-6 text-gray-900 mx-auto text-center">Layanan Tiket Pegawai</span>
  </div>



  <div className="col-lg-9 text-lg font-bold pt-24 ">
                <h4 className='text-justify'>Sebelum melanjutkan ke form pengisian tiket, mohon pilih layanan yang akan Anda ajukan terlebih dahulu. Pastikan Anda memilih kategori yang sesuai agar laporan dapat diproses dengan tepat.</h4>
                
              </div>
       
              <div className="col-lg-9 mt-10 flex items-center justify-center gap-x-6">
            <div className="row x-gap-20 y-gap-20 items-center p-3 mb-20 filter-items">
              {/* Layanan Pengolah Data */}
              <div className="col-lg-9 text-lg font-bold">
                <h4>Layanan Pengolah Data</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 p-4">
                <button 
                 onClick={() => handleButtonClick({
                  kategori: 'Layanan Pengolah Data',
                  jenis_tiket: 'kendala',
                  sub_kategori: 'Laptop',
                })}
                 className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Laptop.png"
                    alt="Logo"
                    className="w-16 h-16 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Laptop</span>
                </button>
                <button
                    onClick={() => handleButtonClick({
                      kategori: 'Layanan Pengolah Data',
                      jenis_tiket: 'kendala',
                      sub_kategori: 'Laptop',
                    })}
                     className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Computer.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Komputer</span>
                </button>

                <a
                  href="/FromPw" className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Printer.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Printer</span>
                </a>
              </div>

              {/* Layanan Jaringan Internet */}

              <div className="col-lg-9 text-lg font-bold">
                <h4>Layanan Jaringan Internet</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 p-4">
                <a
                  href="/FromPw" className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Internet.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Internet</span>
                </a>
                <a
                  href="/FromPw" className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Cctv.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Cctv</span>
                </a>
              </div>

              {/* Layanan Aplikasi */}
              <div className="col-lg-9 text-lg font-bold">
                <h4>Layanan Aplikasi </h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 p-4">
                <a
                  href="/FromPw" className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Installation.png"
                    alt="Logo"
                    className="w-11  h-11   mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Pemasangan</span>
                </a>
                <a
                  href="/FromPw" className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Consultation.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Konsultasi</span>
                </a>
                <a
                  href="/FromPw" className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Unplanned Downtime.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Unplanned Downtime</span>
                </a>
                <a
                  href="/FromPw" className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Email.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Email</span>
                </a>
                <a
                  href="/FromPw" className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Peneration Test.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Peneration  Test</span>
                </a>
              </div>

              {/* Layanan Layanan Aduan Keamanan Siber */}

              <div className="col-lg-9 text-lg font-bold">
                <h4>Layanan Layanan Aduan Keamanan Siber </h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 p-4">
                <a
                  href="/FromPw" className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Kebocoran Data.png"
                    alt="Logo"
                    className="w-11  h-11   mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Kebocoran Data</span>
                </a>
                <a
                  href="/FromPw" className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Web Defacement.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Web Defacement</span>
                </a>
                <a
                  href="/FromPw" className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Denial Of Service.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Denial Of Service</span>
                </a>
                <a
                  href="/FromPw" className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Unauthorized Access.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Unauthorized Access</span>
                </a>
                <a
                  href="/FromPw" className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Malicious Code.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Malicious Code</span>
                </a>
                <a
                  href="/FromPw" className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Unplanned Downtime.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Unplanned Downtime</span>
                </a>
              </div>
            </div>
          </div>
        {/* <div className="flex justify-between items-center w-full">
          <p></p>
          <form className="flex items-center w-full sm:max-w-xs">
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </div>
              <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="cari tiket berdasarkan nama" required />
            </div>
            <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>
        </div> */}
      </div>
    </>
  );
};

export default TiketPw;
