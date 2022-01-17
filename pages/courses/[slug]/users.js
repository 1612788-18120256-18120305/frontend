import { getSession } from 'next-auth/react';
import { useState } from 'react';
import InviteModal from '../../../components/Course/InviteModal';
import axios from 'axios';
import Layout from '../../../components/Layout';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function Users({ course }) {
  const { jwt, user } = useSelector((state) => state.storeManage);

  const [isTeacher, setIsTeacher] = useState(
    user._id == course.owner._id || JSON.stringify(course.teachers).includes(user._id)
  );
  const [showInviteTeacher, setShowInviteTeacher] = useState(false);
  const [showInviteStudent, setShowInviteStudent] = useState(false);
  // const [inviteError, setInviteError] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleInviteTeacherSubmit() {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/invite`,
      {
        courseId: course._id,
        email,
        type: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (res.data.success) {
      setShowInviteTeacher(false);
      setEmail('');
    } else {
      // setInviteError(res.data.message);
      toast.error(res.data.message);
    }
  }

  async function handleInviteStudentSubmit() {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/invite`,
      {
        courseId: course._id,
        email,
        type: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (res.data.success) {
      setShowInviteStudent(false);
      setEmail('');
    } else {
      // setInviteError(res.data.message);
      toast.error(res.data.message);
    }
  }

  const inviteTeacherContent = (
    <>
      <label className="label">
        <span className="label-text">Email</span>
        <div className="text-red-500"></div>
      </label>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="input input-info input-bordered"
      />
      {/* {inviteError && <p>{inviteError}</p>} */}
    </>
  );
  const inviteTeacherActions = (
    <>
      <button
        onClick={handleInviteTeacherSubmit}
        className="focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
      >
        Invite
      </button>
      <button
        className="focus:outline-none ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
        onClick={() => setShowInviteTeacher(false)}
      >
        Cancel
      </button>
    </>
  );
  const inviteStudentActions = (
    <>
      <button
        onClick={handleInviteStudentSubmit}
        className="focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
      >
        Invite
      </button>
      <button
        className="focus:outline-none ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
        onClick={() => setShowInviteStudent(false)}
      >
        Cancel
      </button>
    </>
  );

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
      {showInviteTeacher && (
        <InviteModal
          header="Invite teacher"
          content={inviteTeacherContent}
          actions={inviteTeacherActions}
        />
      )}
      {showInviteStudent && (
        <InviteModal
          header="Invite student"
          content={inviteTeacherContent}
          actions={inviteStudentActions}
        />
      )}

      <div className="flex justify-center">
        <div className="w-full md:w-3/5">
          <div>
            <div className="border-solid border-b-2 border-blue-500 p-2 flex justify-between items-center">
              <div className="text-3xl">Teacher</div>
              {isTeacher && (
                <button onClick={() => setShowInviteTeacher(true)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </button>
              )}
            </div>
            {course.teachers.map((teacher, key) => (
              <div className="p-2 flex items-center" key={key}>
                <img
                  className="rounded-full h-12"
                  src="https://lh3.googleusercontent.com/a/default-user=s75-c"
                />
                <div className="p-2">
                  {teacher.name} ({teacher.email})
                </div>
              </div>
            ))}
          </div>
          <div className="py-2">
            <div className="border-solid border-b-2 border-blue-500 p-2 flex justify-between items-center">
              <div className="text-3xl">Student</div>
              <div className="flex justify-center items-center">
                <div className="text-3xl px-2">{course.students.length} students</div>
                {isTeacher && (
                  <button onClick={() => setShowInviteStudent(true)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {course.students.map((student, key) => (
              <div className="p-2 flex items-center" key={key}>
                <img
                  className="rounded-full h-12"
                  src="https://lh3.googleusercontent.com/a/default-user=s75-c"
                  alt="a"
                />
                <div className="p-2">
                  {student.name} ({student.email})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
Users.getLayout = function getLayout(page) {
  return (
    <Layout active={'/courses'} url={'users'}>
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
