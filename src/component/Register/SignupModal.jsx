import React, { useState } from 'react';
import './SignupModal.css';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig'; 
import { toast } from 'react-toastify';

const SignupModal = ({ onClose }) => {
  const [dob, setDob] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');
  
  // Security questions and answer
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  
  // SSN state
  const [ssn, setSsn] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const billingAddress = {
      houseNumber,
      street,
      city,
      state,
      zip,
      country,
    };

    try {
      // Ensure a user is logged in
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;

        // Save additional info to Firestore
        await setDoc(doc(db, 'users', userId), {
          dob,
          billingAddress,
          securityQuestion,
          securityAnswer,
          ssn,  
        }, { merge: true });

        console.log('Profile updated with DOB, Billing Address, Security Question, and SSN');
        onClose(); 
        toast.success("Profile updated with DOB, Billing Address, Security Question, and SSN");

      } else {
        console.error("No user is found");
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Complete Your Profile</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
        <div className="formelement">
          <label>
            Date of Birth
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </label>
          <h2>Billing Address ↓</h2>
          <label>
            House Number
            <input
              type="text"
              placeholder="House Number"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              required
            />
          </label>
          <label>
            Street
            <input
              type="text"
              placeholder="Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
            />
          </label>
          <label>
            City
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </label>
          <label>
            State
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </label>
          <label>
            Zip Code
            <input
              type="text"
              placeholder="Zip Code"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
            />
          </label>
          <label>
            Country
            <input
              type="text"
              value={country}
              disabled 
            />
          </label>

          {/* Security Question Section */}
          <h2>Security Questions ↓</h2>
          <label>
            Select a Security Question
            <select
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              required
            >
              <option value="" disabled>Select a question</option>
              <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
              <option value="What was the name of your first pet?">What was the name of your first pet?</option>
              <option value="What was your first car?">What was your first car?</option>
              <option value="What elementary school did you attend?">What elementary school did you attend?</option>
              <option value="In what city were you born?">In what city were you born?</option>
            </select>
          </label>
          <label>
            Answer
            <input
              type="text"
              placeholder="Answer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
          </label>

          {/* SSN Section */}
          <label>
            Social Security Number (SSN)
            <input
              type="text"
              placeholder="SSN"
              value={ssn}
              onChange={(e) => setSsn(e.target.value)}
              required
            />
          </label>
      
          </div>

          <button type="submit" className="sign-in-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
