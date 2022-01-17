import React, { useState } from 'react';
import UploadModal from './UploadModal';
import axios from 'axios';
import Papa from 'papaparse';
import Router from 'next/router';
import { toast } from 'react-toastify';

const UploadStudentIdModal = ({ showModal, setShowModal, slug, jwt }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleCSVFileSubmit(event) {
    event.preventDefault();
    if (!selectedFile) {
      return;
    }
    setLoading(true);
    Papa.parse(selectedFile, {
      complete: async (result) => {
        const data = result.data;
        const studentIds = data.map((student) => {
          return student.StudentId.toString();
        });
        // ignore empty rows
        const filteredStudentIds = studentIds.filter((studentId) => {
          return studentId !== '';
        });

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${slug}/assignment/studentid`,
          {
            studentIds: filteredStudentIds,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        setLoading(false);
        setShowModal(false);
        toast.success('Upload successfully!')
        // setAlert({ show: true, type: 'alert-success', message: 'Upload successfully!' });
        // setTimeout(() => {
        //   setAlert({});
        // }, 3000);
        Router.reload(window.location.pathname);
      },
      header: true,
    });
  }

  return (
    <UploadModal
      selectedFile={selectedFile}
      setSelectedFile={setSelectedFile}
      showModal={showModal}
      setShowModal={setShowModal}
      handleCSVFileSubmit={handleCSVFileSubmit}
      loading={loading}
      name={'uploadStudentId'}
    />
  );
};

export default UploadStudentIdModal;
