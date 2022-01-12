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
import MarkAllGradeFinalized from '../../../../components/Grade/MarkAllGradeFinalized';
import axios from 'axios';
import Layout from '../../../../components/Layout';

export default function GradeBoard({ _session, _data, _user }) {
  const [isTeacher, setIsTeacher] = useState(
    _session.user._id == _data.course.owner._id ||
      JSON.stringify(_data.course.teachers).includes(_session.user._id)
  );
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({});

  const [showGradeModal, setShowGradeModal] = useState(false);
  const studentArray = _data.course.studentIds;
  const [assignments, setAssignments] = useState(_data.course.assignments);
  let initialValue = 0;
  let countRow = [];
  studentArray.map((student, key) => {
    let temp = 0;
    {
      assignments.map((assignment, key) => {
        const score = assignment.grades.find((obj) => obj.id === student)?.grade;
        if (!isNaN(score)) temp += score;
      });
    }
    countRow.push(temp);
    // console.log(temp);
  });

  let countCol = [];
  assignments.map((assignment, key) => {
    let temp = 0;
    assignment.grades.map((grade, key) => {
      const score = grade.grade;
      if (!isNaN(score)) temp += score;
    });
    countCol.push(temp);
    // console.log(temp);
  });

  const gradeStudent = assignments.map(
    (assignment) =>
      assignment.grades.find((obj) => obj.id === _user.student && !obj.draft)?.grade ?? 0
  );
  let count = 0;
  if (!isTeacher && gradeStudent.length > 0) count = gradeStudent.reduce((a, b) => a + b);
  else count = 0;

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

      {isTeacher && (
        <div className="flex flex-col mt-4">
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
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      {assignments.map((item, key) => (
                        <th
                          key={item._id}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative"
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
                            {countCol[key]}
                          </div>
                          <MarkAllGradeFinalized
                            courseSlug={_data.course.slug}
                            assignment={item}
                            _session={_session}
                            updateAction={setAssignments}
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentArray.map((item, key) => (
                      <tr key={key}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {countRow[key]}
                        </td>
                        {assignments.map((assignment, key) => (
                          <td
                            key={key}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative"
                          >
                            <InputGradeBoard
                              courseSlug={_data.course.slug}
                              assignment={assignment}
                              _session={_session}
                              item={item}
                              updateAction={setAssignments}
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
      )}

      {!isTeacher && (
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
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      {assignments.map((item, key) => (
                        <th
                          key={item._id}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex items-center">
                            <div className="px-1">
                              {item.name} - {item.point}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {_user.student}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {countRow[key]}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{count}</td>
                      {assignments.map((assignment, key) => (
                        <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assignment.grades.find((obj) => obj.id === _user.student && !obj.draft)
                            ?.grade ?? 0}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
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
GradeBoard.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

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
      const invite = await axios.get(`${BACKEND_URL}/courses/${_data.course._id}/invitation`, {
        headers: {
          Authorization: `Bearer ${_session?.jwt}`,
        },
      });
      if (invite.data.success) {
        _data.course.joinId = invite.data.invitation.inviteCode;
      } else {
        _data.course.joinId = null;
      }
      const _user = await axios.get(BACKEND_URL + ('/users/' + _session?.user?._id), {
        headers: {
          Authorization: `Bearer ${_session?.jwt}`,
        },
      });
      return {
        props: { _session, _data, _user: _user.data.user },
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
