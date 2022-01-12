import React from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../../lib/Utils';
import { getSession } from 'next-auth/react';
import Layout from '../../../components/Layout';

const JoinCourse = ({ success, error, course }) => {
  if (success) {
    return <div>Success!</div>;
  } else {
    return <div className="flex justify-center">Error: {error}</div>;
  }
};

export const getServerSideProps = async (ctx) => {
  const _session = await getSession(ctx);
  const code = ctx.query.invite;
  try {
    const res = await axios.get(`${BACKEND_URL}/courses/join/${code}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${_session?.jwt}`,
      },
    });
    if (res.data.success) {
      return {
        redirect: {
          destination: `/courses/${res.data.course.slug}`,
          permanent: false,
        },
      };
    } else {
      return {
        props: {
          success: false,
          error: res.data.message,
        },
      };
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
};

export default JoinCourse;

JoinCourse.getLayout = function getLayout(page) {
  return <Layout active={'/courses'}>{page}</Layout>;
};
