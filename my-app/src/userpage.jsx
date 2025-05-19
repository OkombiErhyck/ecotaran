import React from "react";
import Anunt from "./images/add.png";
import toate from "./images/grid.png";
import PlacesPage from "./images/approved.png";
import Logout from "./images/logout.png";
import "./userpage.css";
import { UserContext } from "./UserContext";
import { useContext } from "react";
 import axios from "axios";
import { useState } from "react";
import { Navigate, redirect } from "react-router-dom";



function Userpage(){
    const {ready,user,setUser} = useContext(UserContext);
    const [redirect,setRedirect] = useState(null);
if (!ready) {

    return "loading...";
}

if (ready && !user) {
    return <Navigate to={"/login"}/>
}

async function logout() {
   await axios.post("/logout");
   setUser(null)
   setRedirect("/");
    
}
if (redirect) {
    return<Navigate to={redirect}/>
}

   return(
    <>
     
     <div className="userbox">
        <div className="usercontent">
          <h1>Bine ai venit,<span style={{color:"var(--main)"}}>  {user.name}</span> </h1>

          <div className="details container">
                <div className="row">
                    
                     


                    

                    <div className="col-lg-4 col-xs-6">
                       <div className="box card-body p-0  shadow-sm mb-5">
                          
                           <div className="box_content">
                           <a href="/orders">
                           <img src={toate} className="img-fluid" alt=""/>
                          
                               <button className="btn1">Concedii</button>
                           </a>
                           </div>
                       </div>
                    </div>


                     <div className="col-lg-4 col-xs-6">
                       <div className="box card-body p-0  shadow-sm mb-5">
                          
                           <div className="box_content">
                           <a href="/IndexPage">
                           <img src={PlacesPage} className="img-fluid" alt=""/>
                          
                               <button className="btn1">Evidenta angajati</button>
                           </a>
                           </div>
                       </div>
                    </div>


<div className="col-lg-4 col-xs-6">
                       <div className="box card-body p-0  shadow-sm mb-5">
                          
                           <div className="box_content">
                           <a href="/placespage">
                           <img src={Anunt} className="img-fluid" alt=""/>
                          
                               <button className="btn1"> Locatie angajati</button>
                           </a>
                           </div>
                       </div>
                    </div>



                    <div className="col-lg-4 col-xs-6">
                       <div onClick={logout} className="box card-body p-0  shadow-sm mb-5">
                           
                           <div className="box_content">
                           <img src={Logout} className="img-fluid" alt=""/>
                            <button onClick={logout} className="btn1">Iesire din Cont</button>
                           </div>
                       </div>
                    </div>

                    

                </div>
            </div>
     
        </div>
        
    </div>
</>
     );
};


export default Userpage;
