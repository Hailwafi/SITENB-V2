import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from "react";


import NavbarDb from "./components/NavbarDb";
import NavTes from "./components/NavTes";

import withAuthenticationAdmin from './service/withAuthenticationAdmin'; 
import withAuthenticationLeader from './service/withAuthenticationLeader'; 
import withAuthenticationStaff from './service/withAuthenticationStaff'; 

// Lazy load halaman-halaman
const Index = lazy(() => import('./pages'));
const Sign = lazy(() => import('./pages/Sign'));
const Ch_pass = lazy(() => import('./pages/Ch_pass'));
const Ck_Tiket = lazy(() => import('./pages/Ck_Tiket'));
const TokenFrom = lazy(() => import('./pages/TokenFrom'));
const Ft_pass = lazy(() => import('./pages/Ft_pass'));

const From = lazy(() => import('./pages/From'));
const FromPb = lazy(() => import('./pages/FromPb'));
const FromPw = lazy(() => import('./pages/FromPw'));

const Dashboard = lazy(() => import('./pages/Dashboard/Index'));

const Staff = lazy(() => import('./pages/Dashboard/Staff/Index'));
// const Notification = lazy(() => import('./pages/Notification'));


const TaskPw = lazy(() => import('./pages/Dashboard/Staff/TaskPw'));
const TaskPb = lazy(() => import('./pages/Dashboard/Staff/TaskPb'));
const TaskList = lazy(() => import('./pages/Dashboard/Staff/TaskList'));
const Absen = lazy(() => import('./pages/Dashboard/Staff/Absen'));
const PengajuanCIL = lazy(() => import('./pages/Dashboard/Staff/PengajuanCIL'));
const DataCIL = lazy(() => import('./pages/Dashboard/Staff/DataCIL'));
const PersentaseAB = lazy(() => import('./pages/Dashboard/Staff/PersentaseAB'));

const TiketPb = lazy(() => import('./pages/TiketPb'));
const TiketPw = lazy(() => import('./pages/TiketPw'));

const Tiket = lazy(() => import('./pages/Dashboard/Tiket'));
const TiketPegawai = lazy(() => import('./pages/Dashboard/TiketPegawai'));
const TiketPublic = lazy(() => import('./pages/Dashboard/TiketPublic'));
const StaffList = lazy(() => import('./pages/Dashboard/StaffList'));
const StaffDetail = lazy(() => import('./pages/Dashboard/StaffDetail'));
const DataAb = lazy(() => import('./pages/Dashboard/DataAb'));
const DetailAbPg = lazy(() => import('./pages/Dashboard/DetailAbPg'));
const DataSI = lazy(() => import('./pages/Dashboard/DataSI'));
const DetailSI = lazy(() => import('./pages/Dashboard/DetailSI'));

const WorkStaff = lazy(() => import('./pages/Dashboard/Admin/WorkStaff'));
const ListUser = lazy(() => import('./pages/Dashboard/Admin/ListUser'));
const TambahUser = lazy(() => import('./pages/Dashboard/Admin/TambahUser'));

// Komponen utama
const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/TiketPb" element={<TiketPb />} />
          <Route path="/TiketPw" element={<TiketPw />} />
          <Route path="/From" element={<From />} />
          <Route path="/FromPb" element={<FromPb />} />
          <Route path="/FromPw" element={<FromPw />} />
          <Route path="/TokenFrom" element={<TokenFrom />} />
          <Route path="/Ft_pass" element={<Ft_pass />} />
          <Route path="/Ch_pass" element={<Ch_pass />} />
          <Route path="/Ck_Tiket/:kodetiket" element={<Ck_Tiket />} />
          <Route path="/Sign" element={<Sign />} />
          <Route path="/Dashboard/*" element={<AdminLayout />} />
          <Route path="/Leader/*" element={<LeaderLayout />} />
          <Route path="/Staff/*" element={<StaffLayout />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

// Admin Layout
const AdminLayout = withAuthenticationAdmin(() => {
  const [isOpen, setIsOpen] = useState(true); 
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen transition-all">
      <NavTes isOpen={isOpen} toggleNav={() => setIsOpen(!isOpen)} />

     <div
        className={`transition-all duration-300 flex-1 ${
          isOpen ? "ml-64" : "ml-0 mx-auto"
        } md:ml-64 max-w-4xl w-full`}
      >

        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/WorkStaff" element={<WorkStaff />} />
            <Route path="/ListUser" element={<ListUser />} />
            <Route path="/TambahUser" element={<TambahUser />} />
            <Route path="/Tiket" element={<Tiket />} />
            <Route path="/TiketPegawai" element={<TiketPegawai />} />
            <Route path="/TiketPublic" element={<TiketPublic />} />
            <Route path="/StaffList" element={<StaffList />} />
            <Route path="/StaffDetail/:id" element={<StaffDetail />} />
            <Route path="/DataAb" element={<DataAb />} />
            <Route path="/DataSI" element={<DataSI />} />
            <Route path="/DetailSI" element={<DetailSI />} />
            <Route path="/DetailAbPg" element={<DetailAbPg />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
});


// Leader Layout
const LeaderLayout = withAuthenticationLeader(() => (
  <>
    <NavbarDb />
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Tiket" element={<Tiket />} />
        <Route path="/TiketPegawai" element={<TiketPegawai />} />
        <Route path="/TiketPublic" element={<TiketPublic />} />
        <Route path="/StaffList" element={<StaffList />} />
        <Route path="/StaffDetail/:id" element={<StaffDetail />} />
      </Routes>
    </Suspense>
  </>
));

// Staff Layout
// const StaffLayout = withAuthenticationStaff(() => (
//   <>
//     <NavTes />
//     <Suspense fallback={<div>Loading...</div>}>
//       <Routes>
//         <Route path="/" element={<Staff />} />
//         <Route path="/TaskPw" element={<TaskPw />} />
//         <Route path="/TaskPb" element={<TaskPb />} />
//         <Route path="/TaskList" element={<TaskList />} />
//       </Routes>
//     </Suspense>
//   </>
// ));

const StaffLayout = withAuthenticationStaff(() => {
  const [isOpen, setIsOpen] = useState(true); 
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen transition-all">
      <NavTes isOpen={isOpen} toggleNav={() => setIsOpen(!isOpen)} />

     <div
        className={`transition-all duration-300 flex-1 ${
          isOpen ? "ml-64" : "ml-0 mx-auto"
        } md:ml-64 max-w-4xl w-full`}
      >

        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
          <Route path="/" element={<Staff />} />
        <Route path="/TaskPw" element={<TaskPw />} />
        <Route path="/Absen" element={<Absen />} />
        <Route path="/TaskPb" element={<TaskPb />} />
        <Route path="/TaskList" element={<TaskList />} />
        <Route path="/PengajuanCIL" element={<PengajuanCIL />} />
        <Route path="/DataCIL" element={<DataCIL />} />
        <Route path="/PersentaseAB" element={<PersentaseAB />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
});

export default App;
