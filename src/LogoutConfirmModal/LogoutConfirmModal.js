import React from 'react';
import './LogoutConfirmModal.css';

const LogoutConfirmModal = ({ show, onClose, onConfirm }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                {/* <h2>Confirm Logout</h2> */}
                <p>Are you sure you want to log out?</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onClose}>No</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmModal;