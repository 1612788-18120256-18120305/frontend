import React, { useState } from 'react';
import { BACKEND_URL } from '../../lib/Utils';
import UploadModal from './UploadModal';
import axios from 'axios';
import Papa from 'papaparse';

const UploadStudentIdModal = ({ showModal, setShowModal, setAlert, _data, _session }) => {
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
        const res = await axios.post(
          `${BACKEND_URL}/courses/${_data.course.slug}/assignment/studentid`,
          {
            studentIds: studentIds,
          },
          {
            headers: {
              Authorization: `Bearer ${_session?.jwt}`,
            },
          }
        );
        console.log(res.data);
        setLoading(false);
        setShowModal(false);
        setAlert({ show: true, type: 'alert-success', message: 'Upload successfully!' });
        setTimeout(() => {
          setAlert({});
        }, 3000);
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
