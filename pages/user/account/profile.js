import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../components/Layout';
import { toast } from 'react-toastify';
import axios from 'axios';
import { updateUser } from '../../../redux/storeManage';

export default function Profile() {
  const dispatch = useDispatch();
  const { user, jwt } = useSelector((state) => state.storeManage);

  const [studentId, setStudentId] = useState(user.student);
  const [name, setName] = useState(user.name);

  const handleSubmit = async () => {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user._id}`,
      { name, student: studentId },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (res.data.success == false) {
      toast.error('StudentId already exists');
    } else {
      let newUser = { ...user };
      newUser.student = studentId;
      newUser.name = name;
      dispatch(updateUser(newUser));
      toast.success('Updated profile');
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full md:w-3/5">
        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>

        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div>
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="text"
                          id="email"
                          value={user.email}
                          disabled
                          className="h-8 p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-300"
                        />
                      </div>

                      <div className="col-span-6">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-8 p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6">
                        <label
                          htmlFor="studentId"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Student Id
                        </label>
                        <input
                          type="text"
                          name="studentId"
                          id="studentId"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          disabled={user.student ? true : false}
                          className={`h-8 p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                            studentId ? 'bg-gray-300' : ''
                          }`}
                        />
                      </div>
                      {/* <div className="col-span-6 text-red-500">{alert}</div> */}
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      onClick={() => handleSubmit()}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Profile.getLayout = function getLayout(page) {
  return <Layout active={'/user/account/profile'}>{page}</Layout>;
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
