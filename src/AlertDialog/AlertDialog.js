import React from 'react';
import './AlertDialog.css';

const AlertDialog = ({ message, onClose }) => {
  return (
    <div className="alert-dialog-overlay">
      <div className="alert-dialog">
        <p className="alert-dialog-message">{message}</p>
        <button className="alert-dialog-button" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default AlertDialog;
