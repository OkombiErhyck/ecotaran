import { useState } from 'react';
import axios from 'axios';
import "./signup.css";

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleResetPassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/reset-password', { email, newPassword });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  }

  return (
    <>
    <div className="top"></div>
   <div className="loginbox">
        <div className="logincontent"> 
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        
        <input type="email" placeholder='bun@exemplu.com' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br></br><br></br>
        
        <input type="password" placeholder='parola noua' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <br></br><br></br>
         
        <input type="password" placeholder='confirma parola' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <br></br><br></br>
        <button className="loginbtn" type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
      </div>
    </div>
    </>
  );
}

export default ResetPassword;