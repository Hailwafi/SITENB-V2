import React, { useState, useEffect } from 'react';
import NavbarDb from '../../components/NavbarDb';
import { FaTicketAlt } from 'react-icons/fa';

const navigation = [
  { name: 'Tiket Pegawai BNPT', href: '/Dashboard/TiketPegawai', role: 'admin' },
  { name: 'Tiket Public BNPT', href: '/Dashboard/TiketPublic', role: 'admin' },
  { name: 'Tiket Pegawai BNPT', href: '/Leader/TiketPegawai', role: 'kepala_subbag' },
  { name: 'Tiket Public BNPT', href: '/Leader/TiketPublic', role: 'kepala_subbag' },
];

const Tiket = () => {
  const [role, setRole] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* <NavbarDb />   */}
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8 text-center">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Pilih Tiket</h2>
        <div className="grid gap-4">
          {navigation
            .filter((item) => item.role === role)
            .map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center justify-center w-full px-6 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
              >
                <FaTicketAlt className="mr-2 text-xl" />
                {item.name}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Tiket;
