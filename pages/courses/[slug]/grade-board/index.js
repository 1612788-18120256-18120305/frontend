import { getSession } from 'next-auth/react';
import { BACKEND_URL } from '../../../../lib/Utils';
import { useState } from 'react';
import axios from 'axios';
import BC from '../../../../components/Course/BC';
import Papa from 'papaparse';
import Alert from '../../../../components/Alert/Alert';
import UploadModal from '../../../../components/Modal/UploadModal';

export default function GradeBoard({ _session, _data }) {
  const [isTeacher, setIsTeacher] = useState(
    _session.user._id == _data.course.owner._id ||
      JSON.stringify(_data.course.teachers).includes(_session.user._id)
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

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
      <UploadModal
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        showModal={showModal}
        setShowModal={setShowModal}
        handleCSVFileSubmit={handleCSVFileSubmit}
        loading={loading}
      />
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
