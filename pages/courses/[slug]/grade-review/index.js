import axios from 'axios';
import moment from 'moment';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../../../components/Layout';
import Link from 'next/link';

export default function GradeReview({ assignments, slug }) {
  const { jwt } = useSelector((state) => state.storeManage);
  const [gradeReviews, setGradeReviews] = useState([]);

  async function getGradeReview(assignment) {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${slug}/assignment/${assignment._id}/review`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (res.data.success) {
      return res.data.gradeReviews;
    }
    return null;
  }

  useEffect(() => {
    function getArrayReviews() {
      const arr = assignments.map(async (assignment) => {
        const data = await getGradeReview(assignment);
        if (data.length > 0) {
          //arrayGradeReviews.push(...data);
          return data;
        }
      });
      Promise.all(arr).then((data) => {
        let arrayGradeReviews = [];
        data.forEach((item) => {
          if (item !== undefined) {
            arrayGradeReviews = [...arrayGradeReviews, ...item];
          }
        });
        setGradeReviews(arrayGradeReviews ?? []);
      });
    }
    getArrayReviews();
  }, []);

  return (
    <div className="flex flex-col justify-center">
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
                    StudentId
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Message
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Time
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gradeReviews
                  .filter((gradeReview) => gradeReview.status == 0)
                  .map((gradeReview, key) => (
                    <tr key={key}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {gradeReview.studentId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{gradeReview.message}</div>
                        <div className="text-sm text-gray-500">
                          Actual Grade: {gradeReview.actualGrade}, Expected Grade:{' '}
                          {gradeReview.expectedGrade}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`${gradeReview.status == 0 && 'bg-yellow-500'} 
                        ${gradeReview.status == 1 && 'bg-green-500'} 
                        ${
                          gradeReview.status == 2 && 'bg-red-500'
                        } flex-col px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white`}
                        >
                          {gradeReview.status == 0 && 'Pending'}
                          {gradeReview.status == 1 && 'Accept'}
                          {gradeReview.status == 2 && 'Reject'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {moment
                          .tz(Date.parse(gradeReview.createdAt), 'Asia/Ho_Chi_Minh')
                          .format('HH:mm:ss DD/MM/YYYY')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/courses/${slug}/grade-review/${gradeReview._id}?assignmentId=${gradeReview.assignmentId}`}
                        >
                          <a className="text-indigo-600 hover:text-indigo-900">View Detail</a>
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

GradeReview.getLayout = function getLayout(page) {
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
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${ctx.query.slug}/assignment`,
    {
      headers: {
        Authorization: `Bearer ${_session.jwt}`,
      },
    }
  );

  if (res.data.success) {
    return {
      props: { assignments: res.data.assignments, slug: ctx.query.slug },
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
