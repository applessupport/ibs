import React, { useState } from 'react';
import './LoginPage.css';
import { useLoginProvider } from '../../context/LoginContext'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,sendEmailVerification } from 'firebase/auth';
import { db, auth } from '../../firebase/firebaseConfig';
import { toast } from 'react-toastify';
import { doc, setDoc } from 'firebase/firestore';
import vc2 from '../../assets/img/vc2.png';
import SignupModal from './SignupModal';
import Banner from '../Banner/Banner'
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const { login } = useLoginProvider(); 
  const [isSignUp, setIsSignUp] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  
const generateBankDetails = () => {
  const generateRandomNumber = () => {
    return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(); // Generates a 16-digit number
  };

  const currentDate = new Date().toISOString().split('T')[0]; 

  const mockBankDetails = {
    accountNumber: generateRandomNumber(),
    accountBalance: parseFloat((0 * 10000).toFixed(2)), 
    accountOpeningDate: currentDate, 
    transactions: [], 
  };

  return mockBankDetails;
};

const handleSignUp = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    toast.success('Check Your Inbox to verify Your Mail');
    await sendEmailVerification(user);
    
    // Generate bank details after sign-up
    const bankDetails = generateBankDetails();
  
    await setDoc(doc(db, 'users', user.uid), {
      bankDetails: bankDetails,
      personalInfo: {
        name: name, // Assuming fullName is coming from the form
        email: email,
        phone: phone // Assuming phoneNumber is also a form field
      }
    }, { merge: true });
    
    setIsSignUp(false);
    setShowSignupModal(true);
  } catch (error) {
    setError(error.message);
    toast.error(error.message);
  }
};

 
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
      const user = userCredential.user;
  
      if (user.emailVerified) {
        const token = await user.getIdToken(); 
        toast.success('Successfully Signed In');
        console.log("uid--->",user);
        login(user.email, user.displayName || name, user.uid);
        navigate('/banking/dashboard');
      } else {
        setError('Kindly verify your email to proceed.');
        toast.error('Kindly verify your email to proceed.');
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        setError('User not found. Kindly sign up.');
        toast.error('User not found. Kindly sign up.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
        toast.error('Incorrect password. Please try again.');
      } else {
        setError(error.message);
        toast.error(error.message);
      }
      setIsSignUp(true); 
    }
  };
  

  const closeModal = () => {
    setShowSignupModal(false);
  };

  return (
    <>
      <div className="register-page">
        <div className="promotion-section">
          <img src={vc2} alt="" />
          <h2>Enjoy <span className="offer-amount">Contactless Banking</span> With Us</h2>
        </div>
        <div className="login-section">
          {isSignUp ? (
            <>
              <h2>Sign Up</h2>
              <form className="signup-form login-form" onSubmit={handleSignUp}>
                <label>
                  Name
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label>
                  Phone Number
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <button type="submit" className="sign-in-btn">Sign Up</button>
                {error && <p className="error">{error}</p>}
              </form>
              <div className="form-links">
                <a href onClick={handleSignInClick}>Already have an account? Sign in.</a>
              </div>
            </>
          ) : (
            <>
              <h2>Welcome</h2>
              <form className="login-form" onSubmit={handleSignIn}>
                <label>
                  Email
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <div className="login-options">
                  <label>
                    <input type="checkbox" /> <span> Remember me</span>
                  </label>
                </div>
                <button type="submit" className="sign-in-btn">Sign in</button>
                {error && <p className="error">{error}</p>}
                <div className="form-links">
                  <a href>Forgot username/password?</a>
                  <a href onClick={handleSignUpClick}>Not Enrolled? Sign Up Now.</a>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      <Banner />
      {showSignupModal && <SignupModal onClose={closeModal} />}
    </>
  );
};

export default LoginPage;
