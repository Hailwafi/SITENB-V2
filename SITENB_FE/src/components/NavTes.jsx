import React, { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  FolderIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { FaUserPlus, FaUserTie, FaFileExport ,FaChartBar,FaAlignLeft,FaTicketAlt} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function NavTes({ isOpen, toggleNav }) {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isResourcesOpen2, setIsResourcesOpen2] = useState(false);
  const location = useLocation();

  const role = localStorage.getItem("role") || sessionStorage.getItem("role") || "";

  const navigation = [
    { name: "Dashboard", href: "/Dashboard", role: "admin", icon: HomeIcon },
    // { name: "Tiket", href: "/Dashboard/Tiket", role: "admin", icon: FolderIcon },
    { name: "Pantau pekerjaan", href: "/Dashboard/StaffList", role: "admin", icon: FaUserTie },
    { name: "Users", href: "/Dashboard/ListUser", role: "admin", icon: FaUserPlus },

    { name: "Dashboard", href: "/Leader", role: "kepala_subbag", icon: HomeIcon },
    { name: "Tiket", href: "/Leader/Tiket", role: "kepala_subbag", icon: FolderIcon },
    { name: "Pantau pekerjaan", href: "/Leader/StaffList", role: "kepala_subbag", icon: FaUserTie },

    { name: "Dashboard", href: "/Staff", role: "staff", icon: HomeIcon },
  ];

  const dropdownItems = {
    admin: [
      { name: "Data Absen", href: "/Dashboard/DataAb", icon: FaChartBar },
      { name: "Data Izin/Sakit", href: "/Dashboard/DataSI", icon: FaAlignLeft },
    ],
    kepala_subbag: [
      { name: "Laporan Bulanan", href: "/Leader/LaporanBulanan", icon: FaFileExport },
      { name: "Evaluasi Kinerja", href: "/Leader/EvaluasiKinerja", icon: FaFileExport },
    ],
    staff: [
      { name: "Absensi", href: "/Staff/Absen", icon: FaFileExport },
      { name: "Absensi", href: "/Staff/DataCIL", icon: FaFileExport },
      { name: "Absensi", href: "/Staff/PersentaseAB", icon: FaFileExport },
    ],
  };
  const dropdownItemsAK = {
    admin: [
      { name: "Tiket Pegawai", href: "/Dashboard/TiketPegawai", icon: FaTicketAlt },
      { name: "Tiket Public", href: "/Dashboard/TiketPublic", icon: FaTicketAlt },
    ],
    kepala_subbag: [
      { name: "Laporan Bulanan", href: "/Leader/LaporanBulanan", icon: FaFileExport },
      { name: "Evaluasi Kinerja", href: "/Leader/EvaluasiKinerja", icon: FaFileExport },
    ],
    
  };

  return (
    <div>
      {/* Tombol Toggle (Selalu Muncul) */}
      <div className="fixed top-4 left-4 z-50">
        {!isOpen && (
          <button className="bg-gray-900 text-white p-2 rounded-md" onClick={toggleNav}>
            <Bars3Icon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md transition-all duration-300 ${
          isOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        {/* Header Navbar */}
        <div className="flex items-center justify-between px-4 mt-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="bnpt.png" alt="Logo" className="h-12 w-auto" />
            <h1 className="text-lg font-semibold text-gray-700">SI-TENB</h1>
          </div>

          {/* Tombol Close */}
          <button className="text-gray-700 p-2" onClick={toggleNav}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigasi Menu */}
        <div className="px-4 mt-6">
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
                {index === 0 && dropdownItemsAK[role] && (
                  <div>
                    <button
                      onClick={() => setIsResourcesOpen2(!isResourcesOpen2)}
                      className="flex items-center space-x-3 w-full text-left text-black hover:bg-gray-200 px-3 py-2 rounded-md"
                    >
                      <FolderIcon className="w-5 h-5" />
                      <span>Tiket</span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>

                    {isResourcesOpen2 && (
                      <div className="ml-6 mt-2 space-y-1">
                        {dropdownItemsAK[role].map((item) => (
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
