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
      color: "#ffffffff",
      backgroundColor: "rgba(126, 123, 123, 0.5)", // semi-transparent
      width: "180px",
      height: "170px",
      borderRadius: "50%", // perfect circle
      display: "flex",
    
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center"
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
