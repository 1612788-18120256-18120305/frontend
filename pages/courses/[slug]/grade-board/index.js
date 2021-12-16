import { getSession } from 'next-auth/react';
import { BACKEND_URL } from '../../../../lib/Utils';
import { useState } from 'react';
import axios from 'axios';
import BC from '../../../../components/Course/BC';
import Papa from 'papaparse';
import Modal from '../../../../components/Modal/Modal';
import Alert from '../../../../components/Alert/Alert';

export default function GradeBoard({ _session, _data }) {
  const [isTeacher, setIsTeacher] = useState(
    _session.user._id == _data.course.owner._id ||
      JSON.stringify(_data.course.teachers).includes(_session.user._id)
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

  function changeHandler(event) {
    console.log(event.target);
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  }

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

  return (
    <>
      {_data && (
        <>
          <div className="flex justify-center mb-2">
            <BC _data={_data} active="grade-board" />
          </div>
          <div className="flex justify-center">
            <div className="w-full md:w-3/5">
              <div className="py-2">
                {isTeacher && (
                  <div className="flex justify-center mt-4">
                    <a
                      href={'/list_student_template.csv'}
                      className="btn btn-primary mr-4"
                      download="Template"
                    >
                      Download CSV
                    </a>
                    <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
                      Upload CSV
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
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
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                        Attach a file
                      </p>
                    </div>
                    <input
                      type="file"
                      className="opacity-0"
                      onChange={changeHandler}
                      accept=".csv"
                    />
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
      <Alert alert={alert} />
    </>
  );
}

export async function getServerSideProps(ctx) {
  const _session = await getSession(ctx);

  const res = await fetch(BACKEND_URL + ('/courses/' + ctx.query.slug), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${_session?.jwt}`,
    },
  });
  if (res.ok) {
    const _data = await res.json();
    if (_data.success) {
      return {
        props: { _session, _data },
      };
    } else {
      return {
        redirect: {
          permanent: false,
          destination: '/courses',
        },
      };
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/login',
      },
    };
  }
}
