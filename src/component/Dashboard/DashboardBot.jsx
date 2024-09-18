import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './Dashbot.css';
import { useLoginProvider } from '../../context/LoginContext';

const DashboardBot = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { user } = useLoginProvider();

  const userId = user.uid;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (userId) {
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userTransactions = userData.bankDetails?.transactions || [];
            setTransactions(userTransactions);
          }
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  if(loading){
    return <> <div className="loading-container">
    <div className="loadingio-spinner-dual-ball-nq4q5u6dq7r">
      <div className="ldio-x2uulkbinbj">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div> </>
  }

  return (
    <div className="dashboardbot">
      <h2>Transaction History ↓</h2>
     
        <div className="transaction-table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Transaction Date</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Transaction Mode</th>
                <th>Transaction Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.transactionDate}</td>
                    <td>{transaction.transactionId}</td>
                    <td>${transaction.amount.toFixed(2)}</td>
                    <td>{transaction.mode}</td>
                    <td className={`transaction-type credited`}>Credited</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
};

export default DashboardBot;
