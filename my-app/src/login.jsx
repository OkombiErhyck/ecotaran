import { Navigate } from 'react-router-dom';
import "./signup.css";
import {useContext, useState} from "react";
import axios from "axios";
import { UserContext } from './UserContext';



function Login(){
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [redirect, setRedirect] = useState(false);
 const {setUser} = useContext(UserContext);
 async function handleLoginSubmit(ev) {
     ev.preventDefault();
     try {
           const {data} = await axios.post("/login", {email,password} );
           setUser(data);
           
           
           setRedirect(true);
 } catch (e) {
  alert("Login failed");
 }

 }
 if (redirect) {
  return <Navigate to={'/userpage'}/>;
 }

   return(
    <>
    <div className="top"></div>
   <div className="loginbox">
        <div className="logincontent">
          <h2> 
           
          Bine ai <span>revenit</span>!
          </h2>
          <form onSubmit={handleLoginSubmit}>
          <br></br>
      <input type="email" placeholder="bun@exemplu.com" value={email} onChange={ev => setEmail(ev.target.value)}/>
      <br></br><br></br>
      <input type="password" placeholder="parola" value={password} onChange={ev => setPassword(ev.target.value)}/>
      <br></br><br></br>
      <button  className="loginbtn">Logheaza-te<span> </span></button>
    </form>
     <a style={{color:'gray'}} href='/reset-password'>Ai uitat parola?</a>
        </div>
        
    </div>
</>
     );
};


export default Login; 