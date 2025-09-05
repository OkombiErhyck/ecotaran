import HeaderImg from "./images/green.jpg";
import adauga from "./images/fruits.png";
 
import "./header.css";
import { Link } from "react-router-dom";


const Header = () => {
    return (
        <>
            <div className="header">
                <div className="img">
                    <div>
                         <img src={HeaderImg} alt=""/>
                    </div>
                    <div className="Overlay"></div>   
                </div>
                <div className="logo">
                    <div className="logo-container">
                        <div className="logo-side front">
                           <div className="logo-side front">
  <span
    className="logo-img"
    style={{
      fontSize: "4rem",
      fontWeight: "bold",
      color: "#000000ff",
      backgroundColor: "rgba(133, 133, 133, 0.61)", // semi-transparent black
      padding: "60px 40px",
      borderRadius: "50%", // makes it round
      display: "inline-block",
      textAlign: "center",
      lineHeight: "1"
    }}
  >
OEA
  </span>
</div>


                        </div>
                        <div className="logo-side back">
                           
                        </div>
                    </div>
                </div>
                <div className="Content">
                  <h2> 
                    Suntem aici pentru <span>tine</span> !
                  </h2>
                  <Link to="/login" className="btn">
                   Incepe <span>activitatea</span>
                  </Link>
                </div>
            </div>
        </>
    );
};

export default Header;
