import HeaderImg from "./images/green.jpg";
import LogoImg from "./images/logo up.png";
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

                <img src={LogoImg} alt="" className="img-fluid" style={{height: "190px", width: "100%", objectFit: "cover", borderRadius: "70%"}}/>
                  
                </div>
                <div className="Content">
                  <h2> 
                   
                  Suntem aici pentu  <span>tine</span> !
                  </h2>
                  <Link to="/checkout" className="btn">
        Creaza cererea <span>de concediu</span>
      </Link>
                </div>
            </div>
        </>
    );
};
export default Header;