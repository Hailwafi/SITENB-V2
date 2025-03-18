import React from 'react';

const FormModal = ({ isOpen, onClose, title, children, onSave }) => {
  if (!isOpen) return null; 
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg grid grid-cols-2 gap-5">
        <h2 className="text-lg font-bold mb-4 col-span-2">{title}</h2> 
        
   
        <div className="col-span-2">
          {children}
        </div>
        
        <div className="flex justify-end gap-4 col-span-2 mt-4"> 
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={onSave}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
