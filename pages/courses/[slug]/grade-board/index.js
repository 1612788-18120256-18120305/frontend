import { getSession } from 'next-auth/react';
import { BACKEND_URL } from '../../../../lib/Utils';
import { useState } from 'react';
import BC from '../../../../components/Course/BC';
import Alert from '../../../../components/Alert/Alert';
import UploadStudentIdModal from '../../../../components/Modal/UploadStudentIdModal';
import DownloadGradeTemplateButton from '../../../../components/Grade/DownloadGradeTemplateButton';

export default function GradeBoard({ _session, _data }) {
  const [isTeacher, setIsTeacher] = useState(
    _session.user._id == _data.course.owner._id ||
      JSON.stringify(_data.course.teachers).includes(_session.user._id)
  );
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({});

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
                    <button className="btn btn-secondary mr-4" onClick={() => setShowModal(true)}>
                      Upload CSV
                    </button>
                    <DownloadGradeTemplateButton
                      studentIds={_data.course.studentIds}
                      assignment={_data.course.assignments[0]}
                    />
                    <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
                      Upload grade
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <UploadStudentIdModal
        showModal={showModal}
        setShowModal={setShowModal}
        setAlert={setAlert}
        _data={_data}
        _session={_session}
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
