import React from 'react';
import Papa from 'papaparse';

const DownloadGradeTemplateButton = ({ studentIds, assignment }) => {
  const handleFileDowload = (e) => {
    e.preventDefault();
    const csvObject = {
      fields: ['StudentId', assignment.name, assignment._id],
      data: studentIds.map((studentId) => [studentId]),
    };
    const csv = Papa.unparse(csvObject);
    var BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([BOM, csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${assignment._id}.csv`;
    link.click();
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 cursor-pointer"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      onClick={handleFileDowload}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
    // <button className="btn btn-primary mr-4" onClick={handleFileDowload}>
    //   Download grade template
    // </button>
  );
};

export default DownloadGradeTemplateButton;
