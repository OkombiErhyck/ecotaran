import "./signup.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [family, setFamily] = useState(""); // NEW family field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);

  async function registerUser(ev) {
    ev.preventDefault();

    if (!isStrongPassword(password)) {
      setPasswordError(
        "Utilizati minim 8 caractere, o majuscula, o cifra, un caracter special (ex: !#$?)"
      );
      return;
    } else {
      setPasswordError(null);
    }

    try {
      await axios.post("/register", {
        name,
        family, // send family name too
        email,
        password,
      });

      alert("Registration successful. Now you can log in");
      navigate("/login");
    } catch (e) {
      console.error(e);
      alert("Registration failed. Please try again later");
    }
  }

  function isStrongPassword(password) {
    const regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+~])(?=.*[a-zA-Z]).{8,}$/;
    return regex.test(password);
  }

  return (
    <div className="loginbox">
      <div className="logincontent">
        <h2>
          Bine ai <span>venit</span>!
        </h2>
        <form onSubmit={registerUser}>
          <input
            type="text"
            placeholder="Nume utilizator"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <br />
          <br />
          <input
            type="text"
            placeholder="Nume familie"
            value={family}
            onChange={(ev) => setFamily(ev.target.value)}
          />
          <br />
          <br />
          <input
            type="email"
            placeholder="bun@exemplu.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <br />
          <br />
          <input
            type="password"
            placeholder="Parola"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          {passwordError && <p className="error">{passwordError}</p>}
          <br />
          <button className="loginbtn">
            Register<span></span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
