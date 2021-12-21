import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../lib/Utils';

function MarkAllGradeFinalized({ courseSlug, assignment, _session, updateAction }) {
  async function handleFinalizedAllGrade() {
    const res = await axios.post(
      BACKEND_URL + `/courses/${courseSlug}/assignment/${assignment._id}/finalizemultiple`,
      {},
      {
        headers: {
          Authorization: `Bearer ${_session?.jwt}`,
        },
      }
    );
    if (res.status === 200) {
      // refetch all assignments
      const res = await fetch(BACKEND_URL + ('/courses/' + courseSlug), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${_session?.jwt}`,
        },
      });
      const data = await res.json();
      updateAction(data.course.assignments);
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
