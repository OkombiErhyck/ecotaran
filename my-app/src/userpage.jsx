import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Anunt from "./images/add.png";
import toate from "./images/grid.png";
import display from "./images/display.png";
import businessman from "./images/businessman.png";
import PlacesPage from "./images/approved.png";
import Logout from "./images/logout.png";
import setting from "./images/setting.png";
import "./userpage.css";
import { UserContext } from "./UserContext";

function Userpage() {
  const { ready, user, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);
  const [showModificaButtons, setShowModificaButtons] = useState(false);

  if (!ready) return "loading...";
  if (ready && !user) return <Navigate to={"/login"} />;
  if (redirect) return <Navigate to={redirect} />;

  async function logout() {
    await axios.post("/logout");
    setUser(null);
    setRedirect("/");
  }

  return (
    <>
      <div className="userbox">
        <div className="usercontent">
          <h1>
            Bine ai venit, <span style={{ color: "var(--main)" }}>{user.name}</span>
          </h1>

          <div className="details container">
            <div className="row">
              {/* Normal Buttons */}
              <div className="col-lg-4 col-xs-6">
                <div className="box card-body p-0 shadow-sm mb-5">
                  <div className="box_content">
                    <a href="/orders">
                      <img src={toate} className="img-fluid" alt="" />
                      <button className="btn1">Concedii</button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-xs-6">
                <div className="box card-body p-0 shadow-sm mb-5">
                  <div className="box_content">
                    <a href="/despre">
                      <img src={businessman} className="img-fluid" alt="" />
                      <button className="btn1">Personal Ro</button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-xs-6">
                <div className="box card-body p-0 shadow-sm mb-5">
                  <div className="box_content">
                    <a href="/lactate">
                      <img src={businessman} className="img-fluid" alt="" />
                      <button className="btn1">Personal Strain</button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-xs-6">
                <div className="box card-body p-0 shadow-sm mb-5">
                  <div className="box_content">
                    <a href="/IndexPage">
                      <img src={display} className="img-fluid" alt="" />
                      <button className="btn1">Vezi Cazari</button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-xs-6">
                <div className="box card-body p-0 shadow-sm mb-5">
                  <div className="box_content">
                    <a href="/plescoi">
                      <img src={display} className="img-fluid" alt="" />
                      <button className="btn1">Flota</button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-xs-6">
                <div className="box card-body p-0 shadow-sm mb-5">
                  <div className="box_content">
                    <a href="/vegan">
                      <img src={display} className="img-fluid" alt="" />
                      <button className="btn1">Companii</button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-xs-6">
                <div className="box card-body p-0 shadow-sm mb-5">
                  <div className="box_content">
                    <a href="/write">
                      <img src={Anunt} className="img-fluid" alt="" />
                      <button className="btn1">Adauga</button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Toggle Modifica Section */}
              <div className="col-lg-4 col-xs-6">
                <div className="box card-body p-0 shadow-sm mb-5">
                  <div className="box_content">
                    <img src={setting} className="img-fluid" alt="" />
                    <button
                      className="btn1"
                      onClick={() => setShowModificaButtons(!showModificaButtons)}
                    >
                      Modifică
                    </button>
                  </div>
                </div>
              </div>

              {/* Modifica Buttons with Transition */}
              <div
                className={`modifica-section-wrapper ${
                  showModificaButtons ? "open" : ""
                }`}
              >
                <div className="modifica-section row w-100 m-0">
                  <div className="col-lg-4 col-xs-6">
                    <div className="box card-body p-0 shadow-sm mb-5">
                      <div className="box_content">
                        <a href="/Placespage">
                          <img src={PlacesPage} className="img-fluid" alt="" />
                          <button className="btn1">Modificari Cazari</button>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-xs-6">
                    <div className="box card-body p-0 shadow-sm mb-5">
                      <div className="box_content">
                        <a href="/miere">
                          <img src={PlacesPage} className="img-fluid" alt="" />
                          <button className="btn1">Modifica Flota</button>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-xs-6">
                    <div className="box card-body p-0 shadow-sm mb-5">
                      <div className="box_content">
                        <a href="/details">
                          <img src={businessman} className="img-fluid" alt="" />
                          <button className="btn1">Modifica Angajati</button>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-xs-6">
                    <div className="box card-body p-0 shadow-sm mb-5">
                      <div className="box_content">
                        <a href="/legume">
                          <img src={PlacesPage} className="img-fluid" alt="" />
                          <button className="btn1">Modif Companii</button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <div className="col-lg-4 col-xs-6">
                <div
                  onClick={logout}
                  className="box card-body p-0 shadow-sm mb-5"
                >
                  <div className="box_content">
                    <img src={Logout} className="img-fluid" alt="" />
                    <button onClick={logout} className="btn1">
                      Iesire din Cont
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Userpage;
