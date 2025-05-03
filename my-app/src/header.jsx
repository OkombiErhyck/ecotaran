import HeaderImg from "./images/green.jpg";
import LogoImg from "./images/logo up.png";
import Logoccg from "./images/logo ccg.jpg";
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
                            <img src={LogoImg} alt="Logo" className="logo-img" />
                        </div>
                        <div className="logo-side back">
                           
                        </div>
                    </div>
                </div>
                <div className="Content">
                  <h2> 
                    Suntem aici pentru <span>tine</span> !
                  </h2>
                  <Link to="/checkout" className="btn">
                    Creeaza cererea <span>de concediu</span>
                  </Link>
                </div>
            </div>
        </>
    );
};

export default Header;
