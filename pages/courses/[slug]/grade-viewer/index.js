import { getSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import Layout from '../../../../components/Layout';
import axios from 'axios';

const GradeViewer = ({ assignments, slug }) => {
  let count = 0;
  let total = 0;
  assignments.forEach((element) => {
    total += element.point;
  });
  assignments.forEach((element) => {
    element.percent = (element.point / total) * 100;
  });
  assignments.forEach((element) => {
    count += ((element.grades[0]?.grade ?? 0) * element.percent) / 100;
  });
  count = Math.round(count * 100) / 100;

  return (
    <div className="flex flex-col">
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
                    Average
                  </th>
                  {assignments.map((item, key) => (
                    <th
                      key={item._id}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        <div className="px-1">
                          <Link href={`/courses/${slug}/assignments/${item._id}`}>
                            <a>
                              {item.name} - {item.point}
                            </a>
                          </Link>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{count}</td>
                  {assignments.map((assignment, key) => (
                    <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.grades[0]?.grade ?? undefined}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeViewer;
GradeViewer.getLayout = function getLayout(page) {
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
