import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getSession } from 'next-auth/react';
import GradeReviewCard from '../../../../components/common/GradeReviewCard';
import Layout from '../../../../components/Layout';
import { useSelector } from 'react-redux';

const GradeReviewDetail = ({ assignment, slug, reviewRequests }) => {
  const { jwt } = useSelector((state) => state.storeManage);

  return (
    <div className="container px-40">
      <h2 className="text-4xl font-bold text-blue-700">{assignment.name}</h2>
      <p className="mt-1 text-gray-400">{new Date(assignment.createdAt).toLocaleString()}</p>
      <p className="font-bold">Ratio: {assignment.point}</p>
      <div className="flex mt-2">
        <div className="flex justify-center items-center bg-green-500 rounded-xl p-2 text-white font-bold w-24 mx-1">
          Accept
        </div>
        <div className="flex justify-center items-center bg-red-500 rounded-xl p-2 text-white font-bold w-24 mx-1">
          Reject
        </div>
      </div>

      {reviewRequests.map((request) => (
        <GradeReviewCard
          key={request._id}
          review={request}
          jwt={jwt}
          slug={slug}
          assignmentId={assignment._id}
        />
      ))}
    </div>
  );
};

export default GradeReviewDetail;
GradeReviewDetail.getLayout = function getLayout(page) {
  return (
    <Layout active={'/courses'} url={'grade-review'}>
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

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${ctx.query.slug}/assignment/${ctx.query.assignmentId}`,
    {
      headers: {
        Authorization: `Bearer ${_session.jwt}`,
      },
    }
  );

  const gradeReviewRes = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${ctx.query.slug}/assignment/${ctx.query.assignmentId}/review`,
    {
      headers: {
        Authorization: `Bearer ${_session.jwt}`,
      },
    }
  );

  return {
    props: {
      assignment: res.data.assignments,
      reviewRequests: gradeReviewRes.data.gradeReviews,
      slug: ctx.query.slug,
    },
  };
}
