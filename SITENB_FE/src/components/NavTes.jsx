import React, { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  FolderIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { FaUserPlus, FaUserTie, FaFileExport } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function NavTes({ isOpen, toggleNav }) {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const location = useLocation();

  // Ambil role dari data login (localStorage atau sessionStorage)
  const role = localStorage.getItem("role") || sessionStorage.getItem("role") || "";

  const navigation = [
    { name: "Dashboard", href: "/Dashboard", role: "admin", icon: HomeIcon },
    { name: "Tiket", href: "/Dashboard/Tiket", role: "admin", icon: FolderIcon },
    { name: "Pantau pekerjaan", href: "/Dashboard/StaffList", role: "admin", icon: FaUserTie },
    { name: "Users", href: "/Dashboard/ListUser", role: "admin", icon: FaUserPlus },

    { name: "Dashboard", href: "/Leader", role: "kepala_subbag", icon: HomeIcon },
    { name: "Tiket", href: "/Leader/Tiket", role: "kepala_subbag", icon: FolderIcon },
    { name: "Pantau pekerjaan", href: "/Leader/StaffList", role: "kepala_subbag", icon: FaUserTie },

    { name: "Dashboard", href: "/Staff", role: "staff", icon: HomeIcon },
  ];

  // Isi dropdown berdasarkan role yang login
  const dropdownItems = {
    admin: [
      { name: "Data Absen", href: "/Admin/DataAbsen", icon: FaFileExport },
      { name: "Data Izin/Sakit", href: "/Admin/Data_Izin_Sakit", icon: FaFileExport },
      { name: "Rekap", href: "/Admin/Rekap", icon: FaFileExport },
    ],
    kepala_subbag: [
      { name: "Laporan Bulanan", href: "/Leader/LaporanBulanan", icon: FaFileExport },
      { name: "Evaluasi Kinerja", href: "/Leader/EvaluasiKinerja", icon: FaFileExport },
    ],
    staff: [
      { name: "Jadwal Kerja", href: "/Staff/JadwalKerja", icon: FaFileExport },
      { name: "Presensi", href: "/Staff/Presensi", icon: FaFileExport },
    ],
  };

  return (
    <div>
      {/* Toggle Button */}
      <div className="fixed top-4 left-4 z-50">
        <button className="bg-gray-900 text-white p-2 rounded-md" onClick={toggleNav}>
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md transition-all duration-300 ${
          isOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        
        <div className="px-4 mt-10">
          <div className="flex items-center gap-3 mb-6">
            <img src="bnpt.png" alt="Logo" className="h-12 w-auto" />
            <h1 className="text-lg font-semibold text-gray-700">SI-TENB</h1>
          </div>

          {/* Navigasi Menu */}
          {navigation
            .filter((item) => item.role === role)
            .map((item, index, arr) => (
              <React.Fragment key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-black hover:bg-red-500 hover:text-white ${
                    location.pathname === item.href ? "bg-red-500 text-white" : ""
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>

                {/* Dropdown Ditempatkan Setelah "Dashboard" */}
                {index === 0 && dropdownItems[role] && (
                  <div>
                    <button
                      onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                      className="flex items-center space-x-3 w-full text-left text-black hover:bg-gray-200 px-3 py-2 rounded-md"
                    >
                      <FolderIcon className="w-5 h-5" />
                      <span>Data</span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>

                    {isResourcesOpen && (
                      <div className="ml-6 mt-2 space-y-1">
                        {dropdownItems[role].map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-center space-x-3 text-black hover:bg-gray-200 px-3 py-2 rounded-md"
                          >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}
