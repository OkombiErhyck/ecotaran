import "./signup.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup(){
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null); // Add state for password error message
  
  async function registerUser(ev) {
    ev.preventDefault();
    
    // Check if password meets requirements
    if (!isStrongPassword(password)) {
      setPasswordError("Utilizati minim 8 caractere, o majuscula, o cifra, un caracter special(ex: !#$?)");
      return;
    } else {
      setPasswordError(null);
    }
    
    try{
      await axios.post("/register", {
        name,
        email,
        password,
      });     
      
      alert("Registration successful. Now you can log in");
      
      navigate("/login");
      
    } catch (e) {
      alert("Registration failed. Please try again later");
    }
  }
  
  // Function to check if password is strong
  function isStrongPassword(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+~])(?=.*[a-zA-Z]).{8,}$/;
    return regex.test(password);
  }

  return(
    <>
      <div className="loginbox">
        <div className="logincontent">
          <h2>Bine ai <span>venit</span>!</h2>
          <form onSubmit={registerUser}>
            <br></br>
            <input type="text" placeholder="nume utilizator" value={name} onChange={ev => setName(ev.target.value)}/>
            <br></br><br></br>
            <input type="email" placeholder="bun@exemplu.com"  value={email} onChange={ev => setEmail(ev.target.value)}/>
            <br></br><br></br>
            <input type="password" placeholder="parola"  value={password} onChange={ev => setPassword(ev.target.value)}/>
            {passwordError && <p className="error">{passwordError}</p>} {/* Display error message if password is not strong */}
            <br></br> 
            <button className="loginbtn">Register<span></span></button>
          </form>   
        </div>    
      </div>
    </>
  );
};

export default Signup;
