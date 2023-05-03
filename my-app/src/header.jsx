import HeaderImg from "./images/eco.jpeg";
import LogoImg from "./images/New_Project_17.png";
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

                <img src={LogoImg} alt="" className="img-fluid" style={{height: "190px", width: "100%", objectFit: "cover"}}/>
                  
                </div>
                <div className="Content">
                  <h2> 
                   
                  Gusturi din <span>copilarie</span> !
                  </h2>
                  <Link to="/IndexPage" className="btn">
        Vezi toate <span>produsele</span>
      </Link>
                </div>
            </div>
        </>
    );
};
export default Header;