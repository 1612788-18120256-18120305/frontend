import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

function Modal({ show, onClose, children, actions }) {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  const handleClose = () => {
    onClose();
  };

  const modalContent = show ? (
    <div className={styles.modal_overlay_custom} onClick={onClose}>
      <div className={styles.modal_box} onClick={(e) => e.stopPropagation()}>
        {children}
        <div className="modal-action">{actions}</div>
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
