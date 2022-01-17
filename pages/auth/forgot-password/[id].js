import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function ResetPassword({ data, forgotPasswordCode }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleSubmit() {
    if (password == '' || confirmPassword == '') {
      toast.error('Password required');
    } else if (password !== confirmPassword) {
      toast.error('Passwords are not the same!');
    } else {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password/${forgotPasswordCode}`,
          { email: data.email, password }
        );
        if (res.data.success) {
          toast.success(res.data.message);
          router.push('/auth/login');
          return;
        } else {
          toast.error(res.data.message);
          console.log(res.data.message);
        }
      } catch (error) {
        toast.error(error.toString());
        console.error(error);
      }
    }
  }

  return (
    <div className="flex justify-center min-h-screen items-center bg-gradient-to-tl from-green-400 to-indigo-900">
      <div className="flex flex-col w-full max-w-md px-4 py-8 bg-gray-100 rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
        <div className="self-center mb-6 text-xl font-bold text-gray-600 sm:text-2xl dark:text-white">
          {data.email}
        </div>

        <div className="">
          <div>
            <div className="flex flex-col mb-2">
              <div className="flex relative ">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <svg
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z"></path>
                  </svg>
                </span>
                <input
                  type="password"
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <div className="flex relative ">
                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  <svg
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z"></path>
                  </svg>
                </span>
                <input
                  type="password"
                  className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex w-full">
              <button
                onClick={() => handleSubmit()}
                className="py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              >
                Reset password
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-6">
          <a
            href="#"
            target="_blank"
            className="inline-flex items-center text-xs font-thin text-center text-gray-500 hover:text-gray-700 dark:text-gray-100 dark:hover:text-white"
          >
            <span className="ml-2">Go to</span>
            <Link href="/auth/login">
              <div className="px-1 text-blue-500">Login</div>
            </Link>
          </a>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const _session = await getSession(ctx);
  if (!_session) {
    const forgotPasswordCode = ctx.params.id;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password/${forgotPasswordCode}`
    );
    if (res.data.success) {
      return {
        props: { data: res.data, forgotPasswordCode },
      };
    } else {
      return {
        redirect: {
          permanent: false,
          destination: '/auth/login',
        },
      };
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: '/courses',
    },
  };
}
