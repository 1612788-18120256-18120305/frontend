import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Fragment, memo, useEffect, useState } from 'react';
import { Popover, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon, BellIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import axios from 'axios';
import { io } from 'socket.io-client';
import moment from 'moment-timezone';
import { useDispatch, useSelector } from 'react-redux';
import { updateJwt, updateNotification, updateUser } from '../../redux/storeManage';
import { toast } from 'react-toastify';

// const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);
// socket.on('notice', (data) => {
//   console.log(data);
// });

function Header({ active, url }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { user, jwt, notification } = useSelector((state) => state.storeManage);
  if (jwt == 'null') {
    dispatch(updateJwt(session.jwt));
    dispatch(updateUser(session.user));
  }

  function handleSignOut() {
    signOut({ redirect: false });

    router.push('/auth/login');
    return;
  }

  useEffect(() => {
    getNotification(jwt);
  }, []);

  async function getNotification(jwt) {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notification`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (res.data.success == true)
        dispatch(updateNotification(res.data.filterNotification.reverse()));
    } catch (error) {
      console.log(error);
    }
  }

  async function markAsRead(notificationId) {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/${notificationId}/viewed`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (res.data.success == true) {
      // toast.success(res.data.message);
      await getNotification(jwt);
    } else toast.error(res.data.message);
  }

  return (
    <Popover className="sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="-mr-2 -my-2 md:hidden">
            <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>

          <>
            {active == '/courses' && url && (
              <Popover.Group as="nav" className="hidden md:flex space-x-10">
                <Link href={`/courses/${router.query.slug}`}>
                  <a
                    className={`text-base font-medium text-gray-500 hover:text-gray-900 ${
                      url == 'overview' && 'border-b-2 border-gray-500'
                    }`}
                  >
                    Overview
                  </a>
                </Link>
                <Link href={`/courses/${router.query.slug}/users`}>
                  <a
                    className={`text-base font-medium text-gray-500 hover:text-gray-900 ${
                      url == 'users' && 'border-b-2 border-gray-500'
                    }`}
                  >
                    Users
                  </a>
                </Link>
                <Link href={`/courses/${router.query.slug}/grade-structure`}>
                  <a
                    className={`text-base font-medium text-gray-500 hover:text-gray-900 ${
                      url == 'grade-structure' && 'border-b-2 border-gray-500'
                    }`}
                  >
                    Grade Structure
                  </a>
                </Link>
                <Link href={`/courses/${router.query.slug}/grade-board`}>
                  <a
                    className={`text-base font-medium text-gray-500 hover:text-gray-900 ${
                      url == 'grade-board' && 'border-b-2 border-gray-500'
                    }`}
                  >
                    Grade Board
                  </a>
                </Link>
                <Link href={`/courses/${router.query.slug}/grade-viewer`}>
                  <a
                    className={`text-base font-medium text-gray-500 hover:text-gray-900 ${
                      url == 'grade-viewer' && 'border-b-2 border-gray-500'
                    }`}
                  >
                    Grade Viewer
                  </a>
                </Link>
              </Popover.Group>
            )}

            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                    <span className="sr-only">Open plus menu</span>
                    <BellIcon className="w-8 h-8 rounded-full" />
                    <div className="bg-red-500 w-5 h-5 text-white rounded-full">
                      {notification.filter((item) => item.viewed == false).length}
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="max-h-48 overflow-auto origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {notification?.map((noti, key) => (
                      <Menu.Item key={key}>
                        {({ active }) => (
                          <div className="flex items-center justify-between border-b-2 text-sm p-4 hover:bg-gray-100 ">
                            <Link href="#">
                              <div className={`block text-gray-700`}>
                                <div className={`${noti.viewed == false ? 'text-red-500' : ''}`}>
                                  {noti.course}
                                </div>
                                <div className="font-bold">{noti.message}</div>
                                <div className="">
                                  {moment
                                    .tz(Date.parse(noti.createdAt), 'Asia/Ho_Chi_Minh')
                                    .format('DD/MM/YYYY HH:mm:ss')}
                                </div>
                              </div>
                            </Link>
                            {noti.viewed == false && (
                              <div className="cursor-pointer" onClick={() => markAsRead(noti._id)}>
                                Mark as read
                              </div>
                            )}
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                    {notification.length == 0 ? (
                      <Menu.Item>
                        {({ active }) => (
                          <Link href="#">
                            <div
                              className={`hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700 cursor-pointer`}
                            >
                              <div className="font-bold">Empty</div>
                            </div>
                          </Link>
                        )}
                      </Menu.Item>
                    ) : (
                      ''
                    )}
                  </Menu.Items>
                </Transition>
              </Menu>

              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-white">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://lh3.googleusercontent.com/a/default-user=s75-c"
                      alt=""
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link href="/user/account/profile">
                          <a
                            href="#"
                            className="hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700"
                          >
                            Profile
                          </a>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <div
                          className="hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                          onClick={() => handleSignOut()}
                        >
                          Logout
                        </div>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="fixed top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50"
        >
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="py-6 px-5 space-y-6">
              <div className="flex items-center justify-between">
                <Link href="/">
                  <a>
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                      alt="Workflow"
                    />
                  </a>
                </Link>
                <div className="-mr-2">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <Link href="/">
                  <a className="text-base font-medium text-gray-900 hover:text-gray-700">Home</a>
                </Link>
                <Link href="/courses">
                  <a className="text-base font-medium text-gray-900 hover:text-gray-700">Courses</a>
                </Link>
              </div>
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://lh3.googleusercontent.com/a/default-user=s75-c"
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">{user.name}</div>
                    <div className="text-sm font-medium leading-none text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link href="/user/account/profile">
                    <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
                      Profile
                    </div>
                  </Link>
                  <div
                    onClick={() => handleSignout()}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Logout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

export default memo(Header);
