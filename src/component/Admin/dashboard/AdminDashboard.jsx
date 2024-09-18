import React, { useState, useEffect } from 'react';
import { useAdminProvider } from '../../../context/AdminContext';
import { db } from '../../../firebase/firebaseConfig';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import UpdateUserModal from './UpdateUserModal';
import TransactionModal from './TransactionModal'; // Import the new TransactionModal
import styles from './AdminDashboard.css';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { admin } = useAdminProvider();
  const [users, setUsers] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);
        const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const handleTransactionClick = (user) => {
    setSelectedUser(user);
    setShowTransactionModal(true);
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setShowTransactionModal(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = async (userId, updatedData) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        personalInfo: {
          name: updatedData.name,
          email: updatedData.email,
          phone: updatedData.phone,
        },
        dob: updatedData.dob,
        bankDetails: {
          accountNumber: updatedData.accountNumber,
          accountBalance: updatedData.accountBalance,
        },
      });
      setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, ...updatedData } : user));
      toast.success("Updated successfully!");
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("Failed to update user.");
    }
  };

  const handleTransaction = async (userId, { amount, mode }) => {
    try {
      const user = users.find(user => user.id === userId);
      const currentBalance = user.bankDetails?.accountBalance || 0;
      // const newBalance = mode === 'Credit' ? currentBalance + amount : currentBalance - amount;
      const newBalance = currentBalance + amount;
  
      if (newBalance < 0) {
        toast.error("Insufficient funds.");
        return;
      }
  
      const transactionId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
  
      const transactionDate = new Date().toISOString().split('T')[0];
  
      const newTransaction = {
        transactionId,
        amount,
        mode,
        transactionDate,
      };
  
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        'bankDetails.accountBalance': newBalance,
        'bankDetails.transactions': [...user.bankDetails.transactions, newTransaction],
      });
  
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? {
                ...user,
                bankDetails: {
                  ...user.bankDetails,
                  accountBalance: newBalance,
                  transactions: [...user.bankDetails.transactions, newTransaction],
                },
              }
            : user
        )
      );
  
      toast.success(`Transaction successful! New balance: $${newBalance}`);
      handleCloseModal();
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast.error("Failed to process transaction.");
    }
  };
  

  return (
    <div className='admin-dashboard'>
      <header>
        <h1>Admin Dashboard</h1>
        <div>
          <h2>Hi {admin.name}</h2>
          <h3>Role: {admin.role}</h3>
        </div>
      </header>
      <main>
        <h2>User Details</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Account Number</th>
              <th>Account Balance</th>
              <th>DOB</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.personalInfo?.name || 'N/A'}</td>
                <td>{user.personalInfo?.email || 'N/A'}</td>
                <td>{user.personalInfo?.phone || 'N/A'}</td>
                <td>{user.bankDetails?.accountNumber || 'N/A'}</td>
                <td>{user.bankDetails?.accountBalance || 0}</td>
                <td>{user.dob || 'N/A'}</td>
                <td>
                  <button onClick={() => handleUpdateClick(user)}>Update</button>
                  <button onClick={() => handleTransactionClick(user)}>Add Money</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showUpdateModal && selectedUser && (
          <UpdateUserModal
            user={selectedUser}
            onClose={handleCloseModal}
            onUpdate={handleUpdateUser}
          />
        )}

        {showTransactionModal && selectedUser && (
          <TransactionModal
            user={selectedUser}
            onClose={handleCloseModal}
            onTransaction={handleTransaction}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
