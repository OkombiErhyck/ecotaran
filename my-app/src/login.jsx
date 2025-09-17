import { Navigate } from 'react-router-dom';
import "./signup.css";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from './UserContext';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post("/login", { email, password });
      setUser(data);
      setRedirect(true);
    } catch (e) {
      alert("Login failed");
    }
  }

  if (redirect) {
    return <Navigate to={'/despre'} />;
  }

  return (
    <>
      <div className="top"></div>
      <div className="loginbox">
        <div className="logincontent">
          <h2>Bine ai <span>revenit</span>!</h2>
          <form onSubmit={handleLoginSubmit}>
            <br />
            <input
              type="email"
              placeholder="bun@exemplu.com"
              value={email}
              onChange={ev => setEmail(ev.target.value)}
            />
            <br /><br />
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="parola"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "gray"
                }}
              >
                  {showPassword ? "👁": "👁"}
              </button>
            </div>
            <br /><br />
            <button className="loginbtn">Logheaza-te<span> </span></button>
          </form>
          <a style={{ color: 'gray' }} href='/reset-password'>Ai uitat parola?</a>
        </div>
      </div>
    </>
  );
};

export default Login;
