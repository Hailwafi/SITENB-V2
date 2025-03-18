import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LogOut from '../pages/LogOut'

const PopUp = ({
  isOpen,       
  isOpen2,      
  isOpen3,      
  onClose,      
  onClose2,     
  onClose3,     
  title,        
  title2,       
  title3,       
  children,     
  children2,    
  children3,    
  showSaveButton,  
  modalStyle1,       
  modalStyle2,       
  modalStyle3        
}) => {
  
    const { logout, loading } = LogOut();

  const renderTes = (isOpen, onClose, title, children, showSaveButton, customStyle, extraButtons) => {
    return (
      isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className={`bg-white p-6 rounded shadow-lg ${customStyle}`}>
            <h2 className="text-lg font-bold mb-4">{title}</h2>
            {children}
            <div className="flex justify-end space-x-4 gap-5">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
              >
                Tutup
              </button>

              {showSaveButton && (
                <button
                  type="button"
                  onClick={onClose} 
                  className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                >
                  Save
                </button>
              )}

         
              {extraButtons && extraButtons}
            </div>
          </div>
        </div>
      )
    );
  };

  return (
    <>
  
      {renderTes(isOpen, onClose, title, children, false, modalStyle1)}

      {renderTes(isOpen2, onClose2, title2, children2, true, modalStyle2)}

    
      {renderTes(isOpen3, onClose3, title3, children3, false, modalStyle3, (
        <div className="flex justify-end space-x-4 gap-5">
          <button
            type="button"
            // onClick={onClose3} // 
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          >
      {loading ? 'Logging out...' : 'Logout'}
          </button>
          <ToastContainer
                  position="top-center"
                  autoClose={2000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
          {/* <button
            type="button"
            onClick={onClose3}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Save
          </button> */}
        </div>
      ))}
    </>
  );
};

export default PopUp;
