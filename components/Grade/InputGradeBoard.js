import { useState } from 'react';

export default function InputGradeBoard({ assignment, item }) {
  const [grade, setGrade] = useState(assignment.grades.find((obj) => obj.id === item)?.grade);

  return (
    <>
      <input type="number" min="0" max="100" value={grade} onChange={(e) => setGrade(e.target.value)} />
    </>
  );
}
