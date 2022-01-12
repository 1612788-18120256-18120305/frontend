import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import AddModal from '../../components/Course/AddModal';
import JoinModal from '../../components/Course/JoinModal';
import CourseCard from '../../components/Course/Card';
import { getSession } from 'next-auth/react';
import { BACKEND_URL } from '../../lib/Utils';
import Layout from '../../components/Layout';

export default function CoursesPage({ _session, _data }) {
  return (
    <>
      {_session && (
        <div className="flex justify-center items-center">
          <AddModal BACKEND_URL={BACKEND_URL} />
          <div className="ml-3" />
          <JoinModal BACKEND_URL={BACKEND_URL} />
        </div>
      )}
      <div className="py-10 sm:px-10 flex justify-center relative">
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
          {_data?.courses?.reverse().map((course, key) => (
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

  const res = await fetch(BACKEND_URL + '/courses', {
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
        props: { _session, _data: null },
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
