import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import PopUp from './PopUp';
import axios from 'axios';

const navigation = [
  { name: 'Dashboard', href: '/Dashboard', role: 'admin' },
  { name: 'Tiket', href: '/Dashboard/Tiket', role: 'admin' },
  { name: 'Pantau pekerjaan', href: '/Dashboard/StaffList', role: 'admin' },
  { name: 'Users', href: '/Dashboard/ListUser', role: 'admin' },
  
  { name: 'Dashboard', href: '/Leader', role: 'kepala_subbag' },
  { name: 'Tiket', href: '/Leader/Tiket', role: 'kepala_subbag' },
  { name: 'Pantau pekerjaan', href: '/Leader/StaffList', role: 'kepala_subbag' },
  
  { name: 'Dashboard', href: '/Staff', role: 'staff' },
  // { name: 'Tugas Masuk', href: '/Staff/TaskList', role: 'staff' },
];

const NavbarDb = () => {
  const [role, setRole] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [profileImage, setProfileImage] = useState('/default-profile.png');
  const [username, setName] = useState('Your Name');
  const [email, setEmail] = useState('your.email@example.com');
  const [userRole, setUserRole] = useState('User Role');

 
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/admin/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { username, email, role, profile_picture_url } = response.data.data;
      setName(username);
      setEmail(email);
      setUserRole(role);
      setProfileImage(profile_picture_url || '/default-profile.png'); 
    } catch (error) {
      console.error('Gagal mengambil detail pengguna:', error);
    }
  };

  const openProfil = () => setIsOpen(true);
  const closeProfil = () => setIsOpen(false);
  const openLogOut = () => setIsOpen3(true);
  const closeLogOut = () => setIsOpen3(false);

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); 
      };
      reader.readAsDataURL(file);
      updateProfilePicture(file); 
    }
  };

  // const handleDeleteProfile = async () => {
  //   if (window.confirm("Are you sure you want to delete your profile?")) {
  //     try {
  //       const response = await axios.delete(`http://127.0.0.1:8000/api/admin/profile/delate-profile${userId}`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`, 
  //         },
  //       });
  //       alert("Profile deleted successfully!");
  //       if (onDeleteSuccess) onDeleteSuccess();
  //     } catch (error) {
  //       console.error("Failed to delete profile:", error);
  //       alert("Failed to delete profile. Please try again.");
  //     }
  //   }
  // };

  const handleDeleteProfile = async (userId) => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.delete(`http://127.0.0.1:8000/api/admin/profile/delete-picture/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log(response.data); 
      alert("Profile picture deleted successfully!");
    } catch (error) {
      console.error('Gagal menghapus gambar profil:', error);
  
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'Failed to delete profile picture. Please try again.'}`);
      } else {
        alert("Failed to delete profile picture. Please check your network connection.");
      }
    }
  };
  
  
  

  const updateProfilePicture = async (newProfilePicture) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('profile_picture', newProfilePicture);

      const response = await axios.post('http://127.0.0.1:8000/api/admin/profile/change-picture', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      fetchUserDetails();
    } catch (error) {
      console.error('Gagal memperbarui gambar profil:', error);
      setProfileImage('/default-profile.png');
    }
  };

  return (
    <div className="bg-white navbar">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="bg-white flex items-center justify-between p-4 lg:px-8 fixed w-full transition-all">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center">
              <img alt="BNPT Logo" src="/bnpt.png" className="h-16 w-auto rounded-full" />
              <span className="ml-3 text-xl font-bold text-gray-900">SI-TENB</span>
            </a>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Buka menu utama</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation
              .filter((item) => item.role === role) 
              .map((item) => (
                <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                  {item.name}
                </a>
              ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white">
                  {/* <img src={profileImage} alt="Profile" className="h-14 w-14 rounded-full" /> */}
                  <img
  src={`http://127.0.0.1:8000${profileImage}`}
  alt="Profile"
  className="h-12 w-12 rounded-full object-cover sm:h-16 sm:w-16"
/>


                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
                <MenuItem>
                  <button onClick={openProfil} className="block px-4 py-2 text-sm text-gray-700">
                    Profil Anda
                  </button>
                </MenuItem>
                <MenuItem>
                  <button onClick={openLogOut} className="block px-4 py-2 text-sm text-gray-700">
                    Keluar
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </nav>

        {/* Menu mobile */}
        <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5 flex items-center">
                <img alt="BNPT Logo" src="/bnpt.png" className="h-20 w-auto" />
                <span className="ml-3 text-xl font-bold text-gray-900">SI-TENB</span>
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Tutup menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-700">
                <div className="space-y-2 py-6">
                  {navigation
                    .filter((item) => item.role === role) 
                    .map((item) => (
                      <a key={item.name} href={item.href} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        {item.name}
                      </a>
                    ))}
                </div>
                <div className="py-6">
                  <button
                    onClick={openProfil}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                  >
                    Profil Anda
                  </button>
                  <button
                    onClick={openLogOut}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>

        <PopUp
            isOpen3={isOpen3}
            onClose3={closeLogOut}
            title3="Konfirmasi Log Out"
            children3={<p>Apakah Anda yakin ingin logout?</p>}
            modalStyle3="border border-red-500"
          />
       
        {/* <PopUp isOpen={isOpen} closePopUp={closeProfil} fetchUserDetails={fetchUserDetails}>
          <div className="flex flex-col items-center">
            <img src={profileImage} alt="Profile" className="h-32 w-32 rounded-full mb-4" />
            <input type="file" accept="image/*" onChange={handleProfileImageChange} className="mt-2" />
            <h2 className="text-lg font-bold">{username}</h2>
            <p className="text-sm text-gray-600">{email}</p>
            <p className="text-sm text-gray-600">{userRole}</p>
          </div>
        </PopUp> */}

{/* <PopUp
            isOpen={isOpen}
            onClose={closeProfil}
            title="Profile Anda"
            children={
              <div className="flex flex-col items-center box-border">
                <img    src={`http://127.0.0.1:8000${profileImage}`}
 alt="" className="h-16 w-16 rounded-full mb-4" />
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="mb-4"
                />
                <button className="mt-4 px-4 py-2 text-blue-800 rounded" onClick={() => updateProfilePicture()}>
                  Delate Profile
                </button>
                <div className="text-center">
                  <label className="block mb-2">Nama: {username}</label>
                  <label className="block mb-1">Email: {email}</label>
                  <label className="block mb-4">Role: {userRole}</label>
                </div>
              </div>
            }
            modalStyle1="border border-blue-500"
          /> */}

<PopUp
  isOpen={isOpen}
  onClose={closeProfil}
  title="Profile Anda"
  children={
    <div className="flex flex-col items-center box-border p-6 bg-white rounded-lg">
      <img
        src={`http://127.0.0.1:8000${profileImage}`}
        alt="Profile"
        className="h-20 w-20 rounded-full border-2 border-blue-500 shadow-md mb-4"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleProfileImageChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {/* <button
        className="mt-4 px-6 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
        onClick={() => handleDeleteProfile()}
      >
        Delete Profile
      </button> */}
      <div className="text-center mt-6">
        <p className="text-gray-700 text-lg font-semibold mb-1">Nama: {username}</p>
        <p className="text-gray-500 text-sm mb-1">Email: {email}</p>
        <p className="text-gray-500 text-sm">Role: {userRole}</p>
      </div>
    </div>
  }
  modalStyle1="border border-blue-500"
/>


{/* <PopUp
  isOpen={isOpen}
  onClose={closeProfil}
  title="Profil Anda"
  children={
    <div className="flex flex-col items-center">
      <img
        src={profileImage}
        alt=""
        className="h-16 w-16 rounded-full mb-4"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleProfileImageChange}
        className="mb-4"
      />
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        // onClick={deleteProfilePicture}
      >
        Hapus Foto Profil
      </button>
      <div className="text-center">
        <label className="block mb-2">Nama: {username}</label>
        <label className="block mb-1">Email: {email}</label>
        <label className="block mb-4">Role: {userRole}</label>
      </div>
    </div>
  }
/> */}

{/* <PopUp
  isOpen={isOpen}
  onClose={closeProfil}
  title="Profile Anda"
  children={
    <div className="flex flex-col items-center box-border">
      <img 
        src={profileImage} 
        alt="Profile" 
        className="h-16 w-16 rounded-full mb-4" 
        onError={() => setProfileImage('/default-profile.png')} 
      />
      
      <input
        type="file"
        accept="image/*"
        onChange={handleProfileImageChange}
        className="mb-4"
      />

      <button 
        className="mt-4 px-4 py-2 text-blue-800 rounded" 
        onClick={() => setProfileImage('/default-profile.png')}>
        Delete Profile
      </button>
      
      <div className="text-center">
        <label className="block mb-2">Nama: {username}</label>
        <label className="block mb-1">Email: {email}</label>
        <label className="block mb-4">Role: {userRole}</label>
      </div>
    </div>
  }
  modalStyle1="border border-blue-500"
/> */}


      </header>
    </div>
  );
};

export default NavbarDb;
