import { getSession } from 'next-auth/react';
import { BACKEND_URL } from '../../../lib/Utils';
import { useState } from 'react';
import InviteModal from '../../../components/Course/InviteModal';
import axios from 'axios';
import BC from '../../../components/Course/BC';
import Papa from 'papaparse';
import Modal from '../../../components/Modal/Modal';

export default function Users({ _session, _data }) {
  const [isTeacher, setIsTeacher] = useState(
    _session.user._id == _data.course.owner._id ||
      JSON.stringify(_data.course.teachers).includes(_session.user._id)
  );
  const [showInviteTeacher, setShowInviteTeacher] = useState(false);
  const [showInviteStudent, setShowInviteStudent] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [email, setEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  async function handleInviteTeacherSubmit() {
    const invitation = await axios.post(
      `${BACKEND_URL}/courses/invite`,
      {
        courseId: _data.course._id,
        email,
        type: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${_session?.jwt}`,
        },
      }
    );
    if (invitation.data.success) {
      setShowInviteTeacher(false);
      setEmail('');
    } else {
      setInviteError(invitation.data.message);
    }
  }

  async function handleInviteStudentSubmit() {
    const invitation = await axios.post(
      `${BACKEND_URL}/courses/invite`,
      {
        courseId: _data.course._id,
        email,
        type: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${_session?.jwt}`,
        },
      }
    );
    if (invitation.data.success) {
      setShowInviteStudent(false);
      setEmail('');
    } else {
      setInviteError(invitation.data.message);
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
      {inviteError && <p>{inviteError}</p>}
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

  function changeHandler(event) {
    console.log(event.target);
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  }

  function handleCSVFileSubmit(event) {
    event.preventDefault();
    Papa.parse(selectedFile, {
      complete: async (result) => {
        const data = result.data;
        const studentIds = data.map((student) => {
          return student.StudentId.toString();
        });
        console.log(studentIds);
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
      },
      header: true,
    });
  }

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
      {_data && (
        <>
          <div className="flex justify-center mb-2">
            <BC _data={_data} active="users" />
          </div>
          <div className="flex justify-center">
            <div className="w-full md:w-3/5">
              <div>
                <div className="border-solid border-b-2 border-blue-500 p-2 flex justify-between items-center">
                  <div className="text-3xl">Giáo Viên</div>
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
                {_data.course.teachers.map((teacher, key) => (
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
                  <div className="text-3xl">Học Sinh</div>
                  <div className="flex justify-center items-center">
                    <div className="text-3xl px-2">{_data.course.students.length} sinh viên</div>
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
                <div className="flex justify-center mt-4">
                  <a
                    href={'/list_student_template.csv'}
                    className="btn btn-primary mr-4"
                    download="Template"
                  >
                    Download CSV
                  </a>
                  <form onSubmit={handleCSVFileSubmit}>
                    <input type="file" onChange={changeHandler} />
                    <button className="btn">Submit</button>
                  </form>
                  <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    Open modal
                  </button>
                </div>
                {_data.course.students.map((student, key) => (
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
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugit, necessitatibus nemo!
        Distinctio deserunt assumenda possimus odio officia commodi, ad iusto doloremque. Commodi
        aut veritatis quos harum velit obcaecati fuga pariatur!
      </Modal>
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
