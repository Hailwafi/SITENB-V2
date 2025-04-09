import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/NavbarDb";
import Footer from "./components/Footer";

import Index from "./pages";

import Sign from "./pages/Sign"
import Ch_pass from "./pages/Ch_pass"
import Ck_Tiket from "./pages/Ck_Tiket"
import Ft_pass from "./pages/Ft_pass"

import From from "./pages/From"
import FromPb from "./pages/FromPb"
import Dashboard from "./pages/Dashboard"

import FormModal from "./components/FormModal"
import  Notification from "./pages/Notification"
import NavbarDb from "./components/NavbarDb";
import Tes from "./pages/Tes"
import Tes2 from "./pages/tes2"
import Tes3 from "./pages/tes3"

import ProductTable from "./pages/Dashboard/Staff/ProductTable"

import Task from "./pages/Dashboard/Staff/Task"

import TiketPb from "./pages/TiketPb"
import TiketPw from "./pages/TiketPw"


import Tiket from "./pages/Dashboard/Tiket"
import TiketPegawai from "./pages/Dashboard/TiketPegawai"
import TiketPublic from "./pages/Dashboard/TiketPublic"


import WorkStaff from "./pages/Dashboard/Admin/WorkStaff"
import ListUser from "./pages/Dashboard/Admin/ListUser"
import TambahUser from "./pages/Dashboard/Admin/TambahUser"



function App(){


  return (
<>
<BrowserRouter>
{/* api navbar */}
      {/* <div className="">
      
      <NavbarDb role={userRole}/>
        <div className="">
          <Routes>
            {userRole === 'customer' && (
              <>
             
              </>
            )}

          </Routes>
        </div>
      </div> */}


<Routes>
  <Route path="/" element={<Index/>}/>
  <Route path="/Dashboard" element={<Dashboard/>}/>
  <Route path="/Sign" element={<Sign/>}/>
  <Route path="/Ft_pass" element={<Ft_pass/>}/>
  <Route path="/Ch_pass" element={<Ch_pass/>}/>
  <Route path="/Ck_Tiket" element={<Ck_Tiket/>}/>
  <Route path="/From" element={<From/>}/>
  <Route path="/FromPb" element={<FromPb/>}/>
   <Route path="/Tes" element={<Tes/>}/>
  <Route path="/Tes2" element={<Tes2/>}/>
  <Route path="/Tes3" element={<Tes3/>}/>
  <Route path="/FormModal" element={<FormModal/>}/>
  <Route path="/Notification" element={<Notification/>}/>
  <Route path="/Task" element={<Task/>}/>
  <Route path="/ProductTable" element={<ProductTable/>}/> 
  <Route path="/Tiket" element={<Tiket/>}/> 
  <Route path="/TiketPegawai" element={<TiketPegawai/>}/> 
  <Route path="/TiketPublic" element={<TiketPublic/>}/> 
  <Route path="/WorkStaff" element={<WorkStaff/>}/> 
  <Route path="/ListUser" element={<ListUser/>}/> 
  <Route path="/TambahUser" element={<TambahUser/>}/> 
  <Route path="/TiketPb" element={<TiketPb/>}/> 
  <Route path="/TiketPw" element={<TiketPw/>}/> 
</Routes>
</BrowserRouter>
</>
  );
}

export default App
