import React from 'react';
import Papa from 'papaparse';

const ExportGradeButton = ({ course }) => {
  const assignments = course.assignments.map((assignment) => assignment.name);
  const header = ['StudentId', ...assignments];
  const data = course.studentIds.map((studentId) => {
    const grades = course.assignments.map(
      (assignment) => assignment.grades.find((grade) => grade.id === studentId)?.grade ?? 0
    );
    return [studentId, ...grades];
  });

  const handleExport = (e) => {
    e.preventDefault();
    const csvObject = {
      fields: header,
      data,
    };
    const csv = Papa.unparse(csvObject);
    var BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([BOM, csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${course.name}.csv`;
    link.click();
  };

  return (
    <button className="btn btn-primary mr-4" onClick={handleExport}>
      Export grade
    </button>
  );
};

export default ExportGradeButton;
