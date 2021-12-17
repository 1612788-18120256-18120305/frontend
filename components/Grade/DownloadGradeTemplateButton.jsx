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
    console.log(csv);
    var BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([BOM, csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${assignment._id}.csv`;
    link.click();
  };

  return (
    <button className="btn btn-primary mr-4" onClick={handleFileDowload}>
      Download grade template
    </button>
  );
};

export default DownloadGradeTemplateButton;
