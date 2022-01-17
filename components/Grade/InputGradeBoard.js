import { useState } from 'react';
import axios from 'axios';

export default function InputGradeBoard({ courseSlug, assignment, item, jwt, updateAction }) {
  const oldGrade = assignment.grades.find((obj) => obj.id === item);

  const [grade, setGrade] = useState(oldGrade?.grade ?? 0);
  async function handleGradeChange(e) {
    const value = e.target.value;
    if (value > 100 || value < 0 || value.length > 3) {
      return;
    }
    setGrade(value);
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${courseSlug}/assignment/${assignment._id}/grade`,
      { studentId: item, grade: value },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
  }

  async function handleFinalizedGrade() {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${courseSlug}/assignment/${assignment._id}/finalize`,
      { studentId: item },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    // refetch all assignments
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${courseSlug}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    updateAction(res.data.course.assignments);
  }

  return (
    <>
      <div className="dropdown dropdown-left absolute top-0 right-0">
        <button
          tabIndex="0"
          className="finalgrade-btn bg-white rounded-full p-1 hover:bg-gray-50 active:bg-gray-150"
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
            <a onClick={handleFinalizedGrade}>Mark finalized</a>
          </li>
        </ul>
      </div>
      <input
        className={`${oldGrade?.draft ? '' : 'text-green-600 font-bold'}`}
        type="number"
        min="0"
        max="100"
        value={grade}
        placeholder="..."
        onChange={handleGradeChange}
      />
    </>
  );
}
