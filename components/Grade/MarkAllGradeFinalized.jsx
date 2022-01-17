import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function MarkAllGradeFinalized({ courseSlug, assignment, jwt, updateAction }) {
  async function handleFinalizedAllGrade() {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${courseSlug}/assignment/${assignment._id}/finalizemultiple`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (res.status === 200) {
      // refetch all assignments
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${courseSlug}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      updateAction(res.data.course.assignments);
      toast.success('Mark all grade finalized');
    }
  }

  return (
    <>
      <div className="dropdown dropdown-left absolute top-0 right-0">
        <button
          tabIndex="0"
          className="finalgrade-btn rounded-full p-1 hover:bg-gray-50 active:bg-gray-150"
        >
          <svg focusable="false" width="24" height="24" viewBox="0 0 24 24" className="NMm5M">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
          </svg>
        </button>
        <ul
          tabIndex="0"
          className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 z-50"
        >
          <li className="z-50">
            <a onClick={handleFinalizedAllGrade}>Mark all as finalized</a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default MarkAllGradeFinalized;
