import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { UserContextProvider } from './UserContext';
import { CartProvider } from "./CartContext";
import './App.css';



const Navbar = lazy(() => import('./navbar'));

const Footer = lazy(() => import('./footer/footer'));
const Home = lazy(() => import('./home'));
const Login2 = lazy(() => import('./login2'));
const Userpage2 = lazy(() => import('./userpage2'));
const About = lazy(() => import('./about'));
const Login = lazy(() => import('./login'));
const Signup = lazy(() => import('./signup'));
const Userpage = lazy(() => import('./userpage'));
const Write = lazy(() => import('./write/Write'));
const PlacesPage = lazy(() => import('./PlacesPage'));
const IndexPage = lazy(() => import('./IndexPage'));
const PlacePage = lazy(() => import('./PlacePage'));
const ResetPassword = lazy(() => import('./reset-password'));
const Despre = lazy(() => import('./despre'));
const CookiePolicyPopup = lazy(() => import('./CookiePolicyPopup'));
const Details = lazy(() => import('./details'));
const Categorii = lazy(() => import('./categorii'));
const Legume = lazy(() => import('./legume'));
const Fructe = lazy(() => import('./fructe'));
const Lactate = lazy(() => import('./lactate'));
const Carne = lazy(() => import('./Carne'));
const Vegan = lazy(() => import('./vegan'));
const CamaraEco = lazy(() => import('./camaraeco'));
const Ecopack = lazy(() => import('./ecopack'));
const Bauturi = lazy(() => import('./bauturi'));
const Miere = lazy(() => import('./miere'));
const orders2 = lazy(() => import('./orders2'));
const Fainoase = lazy(() => import('./fainoase'));
const Plescoi = lazy(() => import('./plescoi'));
const CartPage = lazy(() => import('./CartPage'));
const Checkout = lazy(() => import('./checkout'));
const Orders = lazy(() => import('./orders'));
const Details2 = lazy(() => import('./details2'));
const CartLink = lazy(() => import('./CartLink'));
const Placesearch = lazy(() => import('./placesearch'));

axios.defaults.baseURL = 'https://ecotaran-nigs.vercel.app';
axios.defaults.withCredentials = true;

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (place) => {
    setCart((prevCart) => [...prevCart, place]);
  };

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const [previousOrders, setPreviousOrders] = useState([]);

  const handleSetPreviousOrders = (orders) => {
    setPreviousOrders(orders);
  };

  useEffect(() => {
    // Preload components here
    Promise.all([
      import('./navbar'),
      import('./footer/footer'),
      import('./home'),
      import('./login2'),
      import('./userpage2'),
      import('./about'),
      import('./ecopack'),
      import('./login'),
      import('./signup'),
      import('./userpage'),
      import('./write/Write'),
      import('./PlacesPage'),
      import('./IndexPage'),
      import('./PlacePage'),
      import('./reset-password'),
      import('./despre'),
      import('./CookiePolicyPopup'),
      import('./details'),
      import('./categorii'),
      import('./legume'),
      import('./fructe'),
      import('./lactate'),
      import('./Carne'),
      import('./vegan'),
      import('./camaraeco'),
      import('./bauturi'),
      import('./miere'),
      import('./orders2'),
      import('./fainoase'),
      import('./plescoi'),
      import('./CartPage'),
      import('./checkout'),
      import('./orders'),
      import('./details2'),
      import('./CartLink'),
      import('./placesearch')
    ]).catch((error) => {
      console.error('Error preloading components:', error);
    });
  }, []);

  return (
    <div className='App'>
      <UserContextProvider>
        <Router>
          <CartProvider>
            <Suspense fallback={<div className="splash-screen">
    <h1><span style={{color:"green"}}>UP </span><span style={{color:"green"}}>Recruitment</span> </h1>
      <div className="road">
        <div className="center-line"></div>
      </div>
      
     
      
    </div>
    }>
              <Navbar cartItems={cart} />
              <Routes>
                <Route path='/details' element={<Details />} />
                <Route path='/CartLink' element={<CartLink />} />
                <Route path='/Write' element={<Write />} />
                <Route path='/Write/:id' element={<Write />} />
                <Route path='/' element={<Home />} />
                <Route path='/userpage' element={<Userpage />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/details2' element={<Details2 />} />
                <Route path='/PlacesPage' element={<PlacesPage />} />
                <Route path='/Login2' element={<Login2 />} />
                <Route path='/orders2' element={<orders2 />} />
                <Route path='/Userpage2' element={<Userpage2 />} />
                <Route path='/IndexPage' element={<IndexPage />} />
                <Route
                  path='/place/:id'
                  element={<PlacePage addToCart={addToCart} />}
                />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/despre' element={<Despre />} />
           
                <Route path='/categorii' element={<Categorii />} />
                <Route path='/legume' element={<Legume />} />
                <Route path='/fructe' element={<Fructe />} />
                <Route path='/lactate' element={<Lactate />} />
                <Route path='/Carne' element={<Carne />} />
                <Route path='/ecopack' element={<Ecopack />} />
                <Route path='/vegan' element={<Vegan />} />
                <Route path='/camaraeco' element={<CamaraEco />} />
                <Route path='/bauturi' element={<Bauturi />} />
                <Route path='/miere' element={<Miere />} />
                <Route path='/fainoase' element={<Fainoase />} />
                <Route path='/plescoi' element={<Plescoi />} />
                <Route path='/CartPage' element={<CartPage cart={cart} />} />
                <Route path='/placesearch' element={<Placesearch />} />
                <Route
                  path="/checkout"
                  element={<Checkout setPreviousOrders={handleSetPreviousOrders} />}
                />
                <Route path="/orders" element={<Orders orders={previousOrders} />} />
              </Routes>
              
            </Suspense>
          </CartProvider>
        </Router>
      </UserContextProvider>
    </div>
  );
}

export default App;
