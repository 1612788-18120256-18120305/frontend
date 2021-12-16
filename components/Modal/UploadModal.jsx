import React, { useState } from 'react';
import Modal from './Modal';

const UploadModal = ({
  selectedFile,
  setSelectedFile,
  showModal,
  setShowModal,
  handleCSVFileSubmit,
  loading,
}) => {
  const [isFilePicked, setIsFilePicked] = useState(false);

  const modalActions = (
    <>
      <button
        type="submit"
        form="uploadCsvForm"
        className={`btn btn-primary ${loading ? 'loading' : ''}`}
      >
        Upload
      </button>
      <a href="#" className="btn btn-outline btn-secondary" onClick={() => setShowModal(false)}>
        Close
      </a>
    </>
  );

  function changeHandler(event) {
    console.log(event.target);
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  }

  return (
    <Modal show={showModal} onClose={() => setShowModal(false)} actions={modalActions}>
      <form id="uploadCsvForm" onSubmit={handleCSVFileSubmit}>
        <div className="flex justify-center mt-8">
          <div className="max-w-2xl rounded-lg shadow-xl bg-gray-50">
            <div className="m-4">
              <label className="inline-block mb-2 text-gray-500">Please upload file as csv</label>
              <div className="flex items-center justify-center flex-col w-full">
                <label className="flex flex-col w-full h-32 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                      Attach a file
                    </p>
                  </div>
                  <input type="file" className="opacity-0" onChange={changeHandler} accept=".csv" />
                </label>
                <div>
                  {selectedFile && <p className="textarea-info mt-4">{selectedFile.name}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UploadModal;
