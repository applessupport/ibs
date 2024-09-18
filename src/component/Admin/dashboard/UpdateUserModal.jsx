import React, { useState } from 'react';
import styles from './UpdateUserModal.css'; 

const UpdateUserModal = ({ user, onClose, onUpdate }) => {
  const [updatedUser, setUpdatedUser] = useState({
    name: user.personalInfo?.name || '',
    email: user.personalInfo?.email || '',
    phone: user.personalInfo?.phone || '',
    dob: user.dob || '',
    accountNumber: user.bankDetails?.accountNumber || '',
    accountBalance: user.bankDetails?.accountBalance || 0,
    mode: 'Cash',  // Default mode is "Cash"
  });

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate(user.id, updatedUser);
    onClose();
  };

  return (
    <div className='modal'>
      <div className='modalContent'>
        <h2>Update User</h2>
        <form>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={updatedUser.name}
            onChange={handleChange}
          />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            onChange={handleChange}
          />
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={updatedUser.phone}
            onChange={handleChange}
          />
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={updatedUser.dob}
            onChange={handleChange}
          />
          <label>Account Number:</label>
          <input
            type="text"
            name="accountNumber"
            value={updatedUser.accountNumber}
            onChange={handleChange}
          />
          <label>Account Balance:</label>
          <input
            type="number"
            name="accountBalance"
            value={updatedUser.accountBalance}
            onChange={handleChange}
          />
          <label>Transaction Amount:</label>
          <input
            type="number"
            name="transactionAmount"
            value={updatedUser.transactionAmount}
            onChange={handleChange}
          />
          <label>Mode:</label>
          <div className='select-container'>
            <select
              name="mode"
              value={updatedUser.mode}
              onChange={handleChange}
              className='select'

            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </form>
        <button onClick={handleSubmit}>Update</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UpdateUserModal;
