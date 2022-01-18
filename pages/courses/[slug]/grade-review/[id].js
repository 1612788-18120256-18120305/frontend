import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getSession } from 'next-auth/react';
import GradeReviewCard from '../../../../components/common/GradeReviewCard';
import Layout from '../../../../components/Layout';
import { useSelector } from 'react-redux';
import router from 'next/router';

const GradeReviewDetail = ({ assignment, slug, review }) => {
  const { jwt } = useSelector((state) => state.storeManage);

  async function handleReject() {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${slug}/assignment/${assignment._id}/review/${review._id}/finalize`,
      {
        grade: review.actualGrade,
        approve: false,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (res.data.success) {
      toast.success('Rejected');
      router.push(`/courses/${slug}/grade-review`);
    }
  }

  async function handleAccept() {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${slug}/assignment/${assignment._id}/review/${review._id}/finalize`,
      {
        grade: review.expectedGrade,
        approve: true,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (res.data.success) {
      toast.success('Accept');
      router.push(`/courses/${slug}/grade-review`);
    }
  }

  return (
    <div className="container px-40">
      <h2 className="text-4xl font-bold text-blue-700">{assignment.name}</h2>
      <p className="mt-1 text-gray-400">{new Date(assignment.createdAt).toLocaleString()}</p>
      <p className="font-bold">Ratio: {assignment.point}</p>
      {review.status == 0 && (
        <div className="flex mt-2">
          <div
            onClick={() => handleAccept()}
            className="flex justify-center items-center cursor-pointer bg-green-500 rounded-xl p-2 text-white font-bold w-24 mx-1"
          >
            Accept
          </div>
          <div
            onClick={() => handleReject()}
            className="flex justify-center items-center cursor-pointer bg-red-500 rounded-xl p-2 text-white font-bold w-24 mx-1"
          >
            Reject
          </div>
        </div>
      )}

      <GradeReviewCard review={review} jwt={jwt} slug={slug} assignmentId={assignment._id} />
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

  if (!res.data.success) {
    return {
      redirect: {
        permanent: false,
        destination: '/courses',
      },
    };
  }

  const review = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${ctx.query.slug}/assignment/${ctx.query.assignmentId}/review/${ctx.query.id}`,
    {
      headers: {
        Authorization: `Bearer ${_session.jwt}`,
      },
    }
  );

  if (!review.data.success) {
    return {
      redirect: {
        permanent: false,
        destination: '/courses',
      },
    };
  }

  return {
    props: {
      assignment: res.data.assignments,
      review: review.data.review,
      slug: ctx.query.slug,
    },
  };
}
