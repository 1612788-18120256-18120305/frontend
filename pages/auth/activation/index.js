import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Activation({ data }) {
  useEffect(() => {
    toast.success(data.message);
  }, []);

  return (
    <>
      <div className="flex justify-center min-h-screen items-center bg-gradient-to-tl from-green-400 to-indigo-900">
        <div className="flex flex-col w-full max-w-md px-4 py-8 bg-gray-100 rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
          <div className="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white"></div>
          <div className="">
            <div>
              <div className="flex w-full">
                <div className=" text-red-500 py-2 px-4 w-full text-center text-xl font-bold">
                  {data.message}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-6">
            <a className="inline-flex items-center text-xs font-thin text-center text-gray-500 hover:text-gray-700 dark:text-gray-100 dark:hover:text-white">
              <span className="ml-2">Go to</span>
              <Link href="/auth/login">
                <div className="px-1 text-blue-500 cursor-pointer">Login</div>
              </Link>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const _session = await getSession(ctx);

  if (!_session) {
    const activationCode = ctx.query.activationCode;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/activation/${activationCode}`
    );
    if (res.data.success) {
      return {
        props: { data: res.data },
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
