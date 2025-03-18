// App.js
import React, { useState } from 'react';
import FormModal from '../components/FormModal';

const Notification = () => {
  const [isForm1Open, setIsForm1Open] = useState(false);
  const [isForm2Open, setIsForm2Open] = useState(false);

  const openForm1 = () => setIsForm1Open(true);
  const closeForm1 = () => setIsForm1Open(false);

  const openForm2 = () => setIsForm2Open(true);
  const closeForm2 = () => setIsForm2Open(false);

  const handleForm1Submit = (e) => {
    e.preventDefault();
    console.log('Formulir 1 submitted');
    closeForm1();
  };

  const handleForm2Submit = (e) => {
    e.preventDefault();
    console.log('Formulir 2 submitted');
    closeForm2();
  };

  return (
    <div className="App">
      <h1>Beberapa Pop-up Form di Satu Halaman</h1>

      {/* Tombol untuk menampilkan pop-up Form 1 */}
      <button
        onClick={openForm1}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Tampilkan Formulir 1
      </button>

      {/* Tombol untuk menampilkan pop-up Form 2 */}
      <button
        onClick={openForm2}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Tampilkan Formulir 2
      </button>

      {/* Pop-up Form 1 */}
      <FormModal isOpen={isForm1Open} onClose={closeForm1} title="Profile anda">
        <form onSubmit={handleForm1Submit}>
          <label className="block mb-2">
            Nama:
         
          </label>
          <label className="block mb-4">
            Email:
          
          </label>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      </FormModal>

      {/* Pop-up Form 2 */}
      <FormModal isOpen={isForm2Open} onClose={closeForm2} title="Formulir 2">
        <form onSubmit={handleForm2Submit}>
          <label className="block mb-2">
            Username:
            <input
              type="text"
              name="username"
              className="border border-gray-300 rounded p-2 w-full"
            />
          </label>
          <label className="block mb-4">
            Password:
            <input
              type="password"
              name="password"
              className="border border-gray-300 rounded p-2 w-full"
            />
          </label>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      </FormModal>
    </div>
  );
};

export default Notification;
