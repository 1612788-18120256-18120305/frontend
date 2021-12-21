import { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../lib/Utils';

export default function InputGradeBoard({ courseSlug, assignment, item, _session }) {
  const [grade, setGrade] = useState(assignment.grades.find((obj) => obj.id === item)?.grade);
  async function handleGradeChange(e) {
    const value = e.target.value;
    if (value > 100 || value < 0 || value.length > 3) {
      return;
    }
    setGrade(value);
    const res = await axios.post(
      BACKEND_URL + `/courses/${courseSlug}/assignment/${assignment._id}/grade`,
      { studentId: item, grade: value },
      {
        headers: {
          Authorization: `Bearer ${_session?.jwt}`,
        },
      }
    );
    console.log(res.data);
  }

  return (
    <>
      <input type="number" min="0" max="100" value={grade} onChange={handleGradeChange} />
    </>
  );
}
