import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

function Modal({ show, onClose, children }) {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  console.log(show);
  const handleClose = () => {
    onClose();
  };

  const modalContent = show ? (
    <div className={styles.modal_overlay_custom}>
      <div className={styles.modal_box}>
        {children}
        <div className="modal-action">
          <a href="#" className="btn btn-primary">
            Import
          </a>
          <a href="#" className="btn" onClick={handleClose}>
            Close
          </a>
        </div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
  } else {
    return null;
  }
}

export default Modal;
