
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Navbar from '../components/Navbar';

const From = () => {
  return (
    <>
      <Navbar />
     <div className="relative isolate mt-10 px-6 pt-14 lg:px-52">
    <form>
      <div className="space-y-12">
      <h2 className=" text-xl text-center font-semibold leading-7 text-gray-900">Silahkan lengkapi formulir di bawah ini</h2>
          
          <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="border-b border-gray-900/10 pb-12">

          <div className="mt-10 grid grid-cols-3 gap-x-6 gap-y-8">
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
              Nama
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
               Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

          
            <div className="sm:col-span-3">
              <label htmlFor="position" className="block text-sm font-medium leading-6 text-gray-900">
              Jabatan
              </label>
              <div className="mt-2">
                <select
                  id="position"
                  name="position"
                  type="position"
                  autoComplete="position"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option>Public</option>
                  <option>Kariyawan</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
               No Induk Pegawai
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            
        
            <div className="col-span-3">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
              Kategori
              </label>
              <div className="mt-2">
                <select
                  id="category"
                  name="category"
                  type="text"
                  autoComplete="category"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                   <option>Layanan Pengolah Data</option>
                   <option>Layanan Jaringan Internet</option>
                </select>
              </div>
            </div>

            <div className="col-span-3">
              <label htmlFor="ticket" className="block text-sm font-medium leading-6 text-gray-900">
              Jenis Ticket
              </label>
              <div className="mt-2">
                <select
                  id="ticket"
                  name="ticket"
                  type="text"
                  autoComplete="ticket"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option>r</option>
                  <option>r</option>
                </select>
              </div>
            </div>

            <div className="col-span-3">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
              Sub Kategori
              </label>
              <div className="mt-2">
                <select
                  id="category"
                  name="category"
                  type="text"
                  autoComplete=""
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                   <option>r</option>
                   <option>r</option>
                </select>
              </div>
            </div>
            <div className="col-span-3">
            <label htmlFor="Bukti Jabatan" className="block text-sm font-medium leading-6 text-gray-900">
            Unggah file 
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
              Deskripsi
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder='Deskripsi'
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
            </div>

          </div>
        </div>

      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Ajukan
        </button>
      </div>
    </form>
    </div>
    </>
   
  )
}
export default From