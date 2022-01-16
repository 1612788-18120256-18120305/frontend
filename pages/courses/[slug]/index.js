import Link from 'next/link';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import Layout from '../../../components/Layout';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
export default function CoursePage({ course }) {
  const { jwt } = useSelector((state) => state.storeManage);
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

  return (
    <div>
      <div className="flex justify-center">
        <div className="relative">
          <img
            className="rounded-xl"
            src="https://www.gstatic.com/classroom/themes/img_backtoschool.jpg"
          />
          <div className="absolute bottom-1 left-1 md:bottom-5 md:left-5 text-white">
            <div className="text-md md:text-4xl font-bold">{course?.name}</div>
            <div className="text-md md:text-xl">{course?.description}</div>
          </div>
          <div className="absolute bottom-1 right-1 md:bottom-5 md:right-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 md:h-10 md:w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="w-1/2">
          {invite && (
            <div className="card shadow-lg w-64 bg-gray-300">
              <div className="card-body">
                <h2 className="card-title">Classroom Code</h2>
                <div className="flex justify-between item-center">
                  <p className="text-blue-500 text-2xl">{invite}</p>
                  <svg
                    onClick={() => {
                      navigator.clipboard.writeText(invite);
                      toast.success('Copy classroom code successful');
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="flex justify-between item-center pt-3">
                  <p className="text-2xl">Join Link</p>
                  <svg
                    onClick={() => {
                      navigator.clipboard.writeText(
                        process.env.NEXT_PUBLIC_FRONTEND_URL + '/courses/join/' + invite
                      );
                      toast.success('Copy join link successful');
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div className="card shadow-lg w-64 bg-gray-300 my-3">
            <div className="card-body">
              <div className="flex flex-col justify-center">
                <h3 className="font-bold">Grade structure</h3>
                <ul>
                  {course.assignments.length > 0 ? (
                    course.assignments.map((item, index) => (
                      <li key={index}>
                        {item.name}: <span>{item.point}</span>
                      </li>
                    ))
                  ) : (
                    <span>Không có</span>
                  )}
                </ul>
                {invite && (
                  <Link href={`/courses/${course.slug}/grade-structure`}>
                    <a className="mt-3 btn btn-primary w-1/2 mx-auto">Edit</a>
                  </Link>
                )}
                {!invite && (
                  <Link href={`/courses/${course.slug}/grade-viewer`}>
                    <a className="mt-3 btn btn-primary w-1/2 mx-auto">View grade</a>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
CoursePage.getLayout = function getLayout(page) {
  return (
    <Layout active={'/courses'} url={'overview'}>
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
