import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import UploadStudentIdModal from '../../../../components/Modal/UploadStudentIdModal';
import UploadGradeModal from '../../../../components/Modal/UploadGradeModal';
import DownloadGradeTemplateButton from '../../../../components/Grade/DownloadGradeTemplateButton';
import InputGradeBoard from '../../../../components/Grade/InputGradeBoard';
import ExportGradeButton from '../../../../components/Grade/ExportGradeButton';
import MarkAllGradeFinalized from '../../../../components/Grade/MarkAllGradeFinalized';
import axios from 'axios';
import Layout from '../../../../components/Layout';
import { useSelector } from 'react-redux';

export default function GradeBoard({ course }) {
  const { jwt, user } = useSelector((state) => state.storeManage);
  const [invite, setInvite] = useState();

  useEffect(() => {
    async function getCourseInvite(id) {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${id}/invitation`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (res.data.success) setInvite(res.data.invitation.inviteCode);
    }
    getCourseInvite(course._id);
  }, []);

  const [isTeacher, setIsTeacher] = useState(
    user._id == course.owner._id || JSON.stringify(course.teachers).includes(user._id)
  );
  const [showModal, setShowModal] = useState(false);

  const [showGradeModal, setShowGradeModal] = useState(false);
  const studentArray = course.studentIds;
  const [assignments, setAssignments] = useState(course.assignments);
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
      assignment.grades.find((obj) => obj.id === user.student && !obj.draft)?.grade ?? 0
  );
  let count = 0;
  if (!isTeacher && gradeStudent.length > 0) count = gradeStudent.reduce((a, b) => a + b);
  else count = 0;

  return (
    <>
      {isTeacher && (
        <>
          <div className="flex justify-center">
            <div className="w-full md:w-3/5">
              <div className="py-2">
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
                  <ExportGradeButton course={course} />
                </div>
              </div>
            </div>
          </div>
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
                                  studentIds={course.studentIds}
                                  assignment={item}
                                />
                              </div>
                              {countCol[key]}
                            </div>
                            <MarkAllGradeFinalized
                              courseSlug={course.slug}
                              assignment={item}
                              jwt={jwt}
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
                                courseSlug={course.slug}
                                assignment={assignment}
                                jwt={jwt}
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
          <UploadStudentIdModal
            showModal={showModal}
            setShowModal={setShowModal}
            jwt={jwt}
            slug={course.slug}
          />
          <UploadGradeModal
            showModal={showGradeModal}
            setShowModal={setShowGradeModal}
            jwt={jwt}
            slug={course.slug}
          />
        </>
      )}
    </>
  );
}
GradeBoard.getLayout = function getLayout(page) {
  return (
    <Layout active={'/courses'} url={'grade-board'}>
      {page}
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const _session = await getSession(ctx);

  if (!_session) {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/login',
      },
    };
  }

  const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${ctx.query.slug}`, {
    headers: {
      Authorization: `Bearer ${_session.jwt}`,
    },
  });

  if (res.data.success) {
    return {
      props: { course: res.data.course },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/courses',
      },
    };
  }
}
