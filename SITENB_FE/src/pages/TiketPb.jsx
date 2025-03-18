import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import Navbar from '../components/Navbar';

import { useNavigate } from 'react-router-dom';

const TiketPb = () => {

 const navigate = useNavigate();

 const handleButtonClick = (data) => {
  navigate('/FromPb', { state: { ...data } });
};

  return (
    <>
      <div className='relative isolate px-4 pt-24 sm:px-6 lg:px-8'>
        <Navbar/>


  <div className='flex justify-between items-center'>
    <a href="/" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-1 focus:outline-none focus:ring-blue-300 inline-flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z" clipRule="evenodd" />
      </svg>
      <span className="sr-only">Search</span>
    </a>
    <span className="text-3xl  font-bold  leading-6 text-gray-900 mx-auto text-center">Layanan Tiket Publik</span>
  </div>



  <div className="col-lg-9 text-lg font-bold pt-24 ">
                <h4 className='text-justify'>Sebelum melanjutkan ke form pengisian tiket, mohon pilih layanan yang akan Anda ajukan terlebih dahulu. Pastikan Anda memilih kategori yang sesuai agar laporan dapat diproses dengan tepat.</h4>
                <br/>
                <h4 className=''>Layanan aduan keamanan siber</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 p-4">
                <button
                onClick={() => handleButtonClick({
                  kategori: 'layanan_aduan_keamanan_siber',
                  jenis_tiket: 'kendala',
                  sub_kategori: 'Kebocoran Data',
                })}
 className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Kebocoran Data.png"
                    alt="Logo"
                    className="w-11  h-11   mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Kebocoran Data</span>
                </button>
                <button
                       onClick={() => handleButtonClick({
                        kategori: 'layanan aduan keamanan siber',
                        jenis_tiket: 'kendala',
                        sub_kategori: 'Web Defacement',
                      })}
                  className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Web Defacement.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Web Defacement</span>
                </button>
                <button
                       onClick={() => handleButtonClick({
                        kategori: 'layanan aduan keamanan siber',
                        jenis_tiket: 'kendala',
                        sub_kategori: 'Denial Of Service',
                      })}
                  className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Denial Of Service.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Denial Of Service</span>
                </button>
                <button
                       onClick={() => handleButtonClick({
                        kategori: 'layanan aduan keamanan siber',
                        jenis_tiket: 'kendala',
                        sub_kategori: 'Unauthorized Access',
                      })}
                  className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Unauthorized Access.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Unauthorized Access</span>
                </button>
                <button
                       onClick={() => handleButtonClick({
                        kategori: 'layanan aduan keamanan siber',
                        jenis_tiket: 'kendala',
                        sub_kategori: 'Malicious Code',
                      })}
                  className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Malicious Code.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Malicious Code</span>
                </button>
                <button
                       onClick={() => handleButtonClick({
                        kategori: 'layanan aduan keamanan siber',
                        jenis_tiket: 'kendala',
                        sub_kategori: 'Unplanned Downtime',
                      })}
                  className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Unplanned Downtime.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <span>Unplanned Downtime</span>
                </button>
              </div>
      </div>
    </>
  );
};

export default TiketPb;
