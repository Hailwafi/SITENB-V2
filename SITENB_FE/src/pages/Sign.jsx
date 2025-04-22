import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from "react-google-recaptcha";

const Sign = () => {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      toast.error('Silakan verifikasi reCAPTCHA terlebih dahulu.');
      return;
    }

    try {
      // Mengirim data login ke server
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        username,
        password,
        'g-recaptcha-response': recaptchaToken 
      });

      // // Jika login berhasil, menyimpan token dan role ke localStorage
      // const token = response.data.token;
      // localStorage.setItem('token', token);
      console.log(response.data);


      localStorage.setItem('token', response.data.token);
      // localStorage.setItem('user_id', user_id);  // Menyimpan user_id
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('permissions', JSON.stringify(response.data.permissions));
      
      const { role } = response.data; 
      
      if (role === 'admin') {
        toast.success('Login berhasil! Mengarahkan ke halaman admin...');
        setTimeout(() => {
          navigate("/Dashboard");
        }, 1000);
      } else if (role === 'kepala_subbag') {
        toast.success('Login berhasil! Mengarahkan ke halaman kepala subbag...');
        setTimeout(() => {
          navigate("/Leader"); 
        }, 3000);
      } else if (role === 'staff') {
        toast.success('Login berhasil! Mengarahkan ke halaman Staff...');
        setTimeout(() => {
          navigate("/Staff");
        }, 3000);
      } else {
        toast.error('Peran tidak dikenal. Silakan hubungi administrator.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';
      toast.error(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="" src="bnpt.png" className="mx-auto h-20 w-auto" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="Masukan Email anda"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div> */}

            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="Masukan Username Anda"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="/Ft_pass" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Masukan Password Anda"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                />
                <button className='absolute inset-y-0 right-0 flex items-center pr-3' type="button" onClick={togglePasswordVisibility}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <ReCAPTCHA  sitekey="6Lf7tUsqAAAAANhzmdnQqygsGgRqinNjtUaUQ36u" onChange={(token) => setRecaptchaToken(token)} />

            <div>
              <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Sign in
              </button>
              <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sign;
