import React from 'react';

function Alert({ alert }) {
  if (alert.show) {
    return (
      <div
        style={{
          position: 'fixed',
          margin: 'auto',
          right: '16px',
          bottom: '16px',
          zIndex: '10',
          display: 'block',
        }}
        className={`alert ${alert.type ? alert.type : ''}`}
      >
        <label>{alert.message}</label>
      </div>
    );
  } else {
    return null;
  }
}

export default Alert;
