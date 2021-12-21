import { getSession } from 'next-auth/react';
import { BACKEND_URL } from '../../../../lib/Utils';
import { useState } from 'react';
import BC from '../../../../components/Course/BC';
import Alert from '../../../../components/Alert/Alert';
import UploadStudentIdModal from '../../../../components/Modal/UploadStudentIdModal';
import UploadGradeModal from '../../../../components/Modal/UploadGradeModal';
import DownloadGradeTemplateButton from '../../../../components/Grade/DownloadGradeTemplateButton';
import InputGradeBoard from '../../../../components/Grade/InputGradeBoard';
import ExportGradeButton from '../../../../components/Grade/ExportGradeButton';

export default function GradeBoard({ _session, _data }) {
  const [isTeacher, setIsTeacher] = useState(
    _session.user._id == _data.course.owner._id ||
      JSON.stringify(_data.course.teachers).includes(_session.user._id)
  );
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({});

  const [showGradeModal, setShowGradeModal] = useState(false);
  const studentArray = _data.course.studentIds;
  const assignments = _data.course.assignments;
  console.log(assignments);

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
                    {/* <DownloadGradeTemplateButton
                      studentIds={_data.course.studentIds}
                      assignment={_data.course.assignments[0]}
                    /> */}
                    <button
                      className="btn btn-secondary mr-4"
                      onClick={() => setShowGradeModal(true)}
                    >
                      Upload grade
                    </button>
                    <ExportGradeButton course={_data.course} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      StudentID
                    </th>
                    {assignments.map((item) => (
                      <th
                        key={item._id}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          <div className="px-1">
                            {item.name} - {item.point}
                          </div>
                          <div>
                            <DownloadGradeTemplateButton
                              studentIds={_data.course.studentIds}
                              assignment={item}
                            />
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentArray.map((item, key) => (
                    <tr key={key}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item}</td>
                      {assignments.map((assignment, key) => (
                        <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* <input
                            type="text"
                            value={assignment.grades.find((obj) => obj.id === item)?.grade}
                          /> */}
                          <InputGradeBoard
                            courseSlug={_data.course.slug}
                            assignment={assignment}
                            _session={_session}
                            item={item}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <UploadStudentIdModal
        showModal={showModal}
        setShowModal={setShowModal}
        setAlert={setAlert}
        _data={_data}
        _session={_session}
      />
      <UploadGradeModal
        showModal={showGradeModal}
        setShowModal={setShowGradeModal}
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
