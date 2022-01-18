import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getSession } from 'next-auth/react';
import GradeReviewCard from '../../../../components/common/GradeReviewCard';
import Layout from '../../../../components/Layout';
import { useSelector } from 'react-redux';

const Assignment = ({ assignment, slug, reviewRequests }) => {
  const { jwt } = useSelector((state) => state.storeManage);
  //console.log(_session);
  const [grade, setGrade] = React.useState(0);
  const [message, setMessage] = React.useState('');

  const onChangeGrade = (e) => {
    const value = e.target.value;
    if (value > 100 || value < 0) return;
    setGrade(e.target.value);
  };
  const hasPendingReview = reviewRequests.some((review) => review.status === 0);

  const onSubmitReview = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${slug}/assignment/${assignment._id}/review`,
      {
        expectedGrade: grade,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (data.success) {
      toast.success('Request submitted successfully');
      setGrade(0);
      setMessage('');
    } else {
      toast.error('Request review failed');
    }
  };

  return (
    <div className="container px-40">
      <h2 className="text-4xl font-bold text-blue-700">{assignment.name}</h2>
      <p className="mt-1 text-gray-400">{new Date(assignment.createdAt).toLocaleString()}</p>
      <p className="font-bold">Ratio: {assignment.point}</p>
      <p className="font-bold">Point: {assignment.grades?.grade}</p>
      {!hasPendingReview && (
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-8"
          onSubmit={onSubmitReview}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Expected grade
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="grade"
              type="number"
              placeholder="Grade"
              value={grade}
              onChange={onChangeGrade}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Message
            </label>
            <textarea
              className="
              form-control
              block
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
            "
              id="message"
              rows="3"
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      )}
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

export default Assignment;
Assignment.getLayout = function getLayout(page) {
  return (
    <Layout active={'/courses'} url={'grade-viewer'}>
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
