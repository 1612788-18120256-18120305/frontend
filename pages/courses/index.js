import AddModal from '../../components/Course/AddModal';
import JoinModal from '../../components/Course/JoinModal';
import CourseCard from '../../components/Course/Card';
import { getSession } from 'next-auth/react';
import { BACKEND_URL } from '../../lib/Utils';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { updateCourses } from '../../redux/storeManage';
import axios from 'axios';
import { useEffect } from 'react';

export default function CoursesPage() {
  const dispatch = useDispatch();
  const { jwt, courses } = useSelector((state) => state.storeManage);

  useEffect(() => {
    async function getCourses() {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/courses`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (res.data.success) return dispatch(updateCourses(res.data.courses.reverse()));
    }
    if (courses.length == 0) {
      getCourses();
    }
  }, []);

  return (
    <>
      <div className="flex justify-center items-center">
        <AddModal BACKEND_URL={BACKEND_URL} />
        <div className="ml-3" />
        <JoinModal BACKEND_URL={BACKEND_URL} />
      </div>

      <div className="py-10 sm:px-10 flex justify-center relative">
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
          {courses.map((course, key) => (
            <CourseCard key={key} course={course} />
          ))}
        </div>
      </div>
    </>
  );
}
CoursesPage.getLayout = function getLayout(page) {
  return <Layout active={'/courses'}>{page}</Layout>;
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
  return {
    props: {},
  };
}
