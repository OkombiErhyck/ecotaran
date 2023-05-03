
import "./header2.css";
import background from "./images/mag.jpg";

const Header2 = () => {
    return (
        <>
  <div className="header2" style={{ position: "relative" }}>
  <div
    className="background-image"
    style={{ backgroundImage: `url(${background})` }}
  ></div>

  <div className="content">
    <div className="row no-gutters" id="contact-info-bg-1">
      <div className="col-sm-5 offset-sm-1 p-5 text-light">
        <h2>Program</h2>
        <br />
        <h4>In timpul saptamanii</h4>
        <p>08:00 - 20:00</p>
        <br />
        <h4>In weekend</h4>
        <p>12:00 – 14:00</p>
      </div>
      <div className="col-sm-6 p-5 text-light" id="contact-info-bg-2">
        <h2>Contact</h2>
        <br />
        <br />
        <h4>email</h4>
        <p>ecotaran@gmail.com</p>
        <br />
      </div>
    </div>
  </div>
</div>

 
        </>
    );
};
export default Header2;