
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import NavbarDb from '../../components/NavbarDb';
import { AiFillTool } from "react-icons/ai";

const Index = () => {
  
  const [Totaltickets_menunggu_pengerjaan, setTotaltickets_menunggu_pengerjaan] = useState(0);
  const [Totaltickets_proses, setTotaltickets_proses] = useState(0);
  const [Totaltickets_selesai, setTotaltickets_selesai] = useState(0);
  const [Totaltickets_pegawai, setTotaltickets_pegawai] = useState(0);
  const [Totaltickets_publik, setTotaltickets_publik] = useState(0);
  const [Totalticket, setTotalticket] = useState(0);
  const [Totaljumlah_kendala, setTotaljumlah_kendala] = useState(0);
  const [Totaljumlah_permohonan, setTotaljumlah_permohonan] = useState(0);

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
    
      const { ticket_menunggu_pengerjaan, ticket_proses, ticket_selesai, ticket_pegawai,ticket_publik ,total_ticket,jumlah_kendala,jumlah_permohonan} = response.data.data;

      setTotaltickets_menunggu_pengerjaan(ticket_menunggu_pengerjaan);
      setTotaltickets_proses(ticket_proses);
      setTotaltickets_selesai(ticket_selesai);
      setTotaltickets_pegawai(ticket_pegawai);
      setTotaltickets_publik(ticket_publik);
      setTotalticket(total_ticket);
      setTotaljumlah_kendala(jumlah_kendala);
      setTotaljumlah_permohonan(jumlah_permohonan);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);

  return (
    
        <>
        {/* <NavbarDb/> */}
        {/* <NavbarDb/> */}
            <div className="col-lg-9 mt-10 flex items-center justify-center gap-x-6  pt-14">
            <div className="row x-gap-20 y-gap-20 items-center p-3 mb-20 filter-items">
              
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 p-4">
               <a
  className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border bg-customRed rounded-md  hover:bg-blue-100 transition-colors"
>
  <img
    src="src/img/Waiting.png"
    alt="Logo"
    className="w-16 h-16 mb-4 md:mb-0 md:mr-4"
  />
 <div className='text-white'>
 <p className="text-center">{Totaltickets_menunggu_pengerjaan}</p>
   <span>Tiket Menunggu Pengerjaan</span>
 </div>
 <div>
  
  {/* <div className="text-center mb-2 text-lg font-bold">Teks di atas</div>
  <span>Laptop</span> */}
</div>

</a>

                <a
                  className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border bg-customOrange rounded-md hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Proses.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <div className='text-white'>
                    <p className="text-center">{Totaltickets_proses}</p>
                  <span>Tiket Proses Pengerjaan</span>
                  </div>
                </a>
                <a
                  className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border bg-customGreen rounded-md hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Tes.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <div className='text-white'>
                    
                    <p className="text-center">{Totaltickets_selesai}</p>
                  <span>Tiket Selesai</span>
                  </div>
                </a>
              </div>

     

    
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
                    <p className="text-center">{Totalticket}</p>
                  <span>Total Tiket</span>
                  </div>
                </a>

                <a
                  className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border bg-customBlue rounded-md hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Tiket.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <div className='text-white'>
                    <p className="text-center">{Totaltickets_pegawai}</p>
                  <span>Tiket Pegawai BNPT</span>
                  </div>
                </a>



                <a
                  className="flex flex-col md:flex-row items-center p-5 text-lg font-medium border bg-customBlue rounded-md hover:bg-blue-100 transition-colors"
                >
                  <img
                    src="src/img/Tiket.png"
                    alt="Logo"
                    className="w-11 h-11 mb-4 md:mb-0 md:mr-4"
                  />
                  <div className='text-white'>
                    <p className="text-center">{Totaltickets_publik}</p>
                  <span>Tiket Public</span>
                  </div>
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5 p-4 ">
                
              {/* <a
  className="flex flex-col items-center text-lg font-medium border border-gray-300 rounded-md bg-white hover:bg-blue-100 transition-colors py-11  "
>
  <div className="bg-slate-600 w-full p-2 rounded-md mb-2 ">
    <h2 className="text-white text-xl font-bold text-center">Pemasangan</h2>
  </div>
  <span>1</span>
</a> */}

<table class="items-center border-spacing-none border border-slate-500">
  <thead>
    {/* <tr>
      <th class="border bg-customAbu py-4 text-white">Jumlah tiket Kendala</th>
    
    </tr> */}

      <th className="border bg-customAbu py-4 text-white flex items-center gap-2">
    <AiFillTool className="text-xl" />
    Jumlah tiket Kendala
  </th>
  </thead>
  <tbody>
    <tr>
      <td class="text-center py-14">{Totaljumlah_kendala}
        
      </td>
     
    </tr>
  </tbody>
</table>
<table class="border-spacing-none border border-slate-500 ">
  <thead>
    <tr>
      <th class="border bg-customAbu py-4 text-white">Jumlah tiket Permohonan</th>
    
    </tr>
  </thead>
  <tbody>
    <tr>
     
      <td class="text-center py-14 ">{Totaljumlah_permohonan}</td>
     
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
