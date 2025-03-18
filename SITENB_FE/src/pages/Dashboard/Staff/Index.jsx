
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarDb from '../../../components/NavbarDb';

const Index = () => {
  
  const [Total_tiket, setTotal_tiket] = useState(0);
  const [Totaljumlah_tiket_pegawai_bnpt, setTotaljumlah_tiket_pegawai_bnpt] = useState(0);
  const [Totaljumlah_tiket_publik, setTotaljumlah_tiket_publik] = useState(0);
  const [Totaltotal_tugas, setTotaltotal_tugas] = useState(0);
  const [Totaltiket_selesai, setTotaltiket_selesai] = useState(0);

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/staff/staff-dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
    
      const {total_tiket, jumlah_tiket_pegawai_bnpt, jumlah_tiket_publik,total_tugas,tiket_selesai} = response.data;

      setTotal_tiket(total_tiket);
      setTotaljumlah_tiket_pegawai_bnpt(jumlah_tiket_pegawai_bnpt);
      setTotaljumlah_tiket_publik(jumlah_tiket_publik);
      setTotaltotal_tugas(total_tugas);
      setTotaltiket_selesai(tiket_selesai);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);

  return (
    
        <>
        {/* <NavbarDb/> */}
        <NavbarDb/>
            <div className="col-lg-9 mt-10  items-center justify-center gap-x-6  pt-14">
            <div className="row x-gap-20 y-gap-20 items-center p-3 mb-20 filter-items">
              
         
    
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 p-4 ">
                <a
                  className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border bg-customBlue rounded-md hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Tiket.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <div className='text-white'>
                    <p className="text-center">{Total_tiket}</p>
                  <span>Total Tiket</span>
                  </div>
                </a>
                <a
                href="/Staff/TaskPw"
                  className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border bg-customBlue rounded-md hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Tiket.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <div className='text-white'>
                    <p className="text-center">{Totaljumlah_tiket_pegawai_bnpt}</p>
                  <span>Tiket Pegawai BNPT</span>
                  </div>
                </a>
                <a
                href="/Staff/TaskPb"
                  className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border bg-customBlue rounded-md hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Tiket.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <div className='text-white'>
                    <p className="text-center">{Totaljumlah_tiket_publik}</p>
                  <span>Tiket Public</span>
                  </div>
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5 p-4 ">
                     
<table class="items-center border-spacing-none border border-slate-500">
  <thead>
    <tr>
      <th class="border bg-customAbu py-4 text-white">Jumlah Tugas</th>
    
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="text-center py-14">{Totaltotal_tugas}</td>
     
    </tr>
  </tbody>
</table>
<table class="border-spacing-none border border-slate-500 ">
  <thead>
    <tr>
      <th class="border bg-customAbu py-4 text-white">Jumlah Tugas Selesai</th>
    
    </tr>
  </thead>
  <tbody>
    <tr>
     
      <td class="text-center py-14 ">{Totaltiket_selesai}</td>
     
    </tr>
  </tbody>
</table>

                {/* <a
                  className="flex flex-col items-center  p-5 text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors"
                >
                   <span>Pemasangan</span>
                 
                  <span>1</span>
                </a> */}
            
             
              </div>
            </div>
          </div>

    
      </>
  )
}

export default Index
