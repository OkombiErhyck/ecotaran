import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { UserContextProvider } from './UserContext';
import SplashScreen from './SplashScreen';

import './App.css';

const Navbar = lazy(() => import('./navbar'));
const Footer = lazy(() => import('./footer/footer'));
const Home = lazy(() => import('./home'));
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
const Bauturi = lazy(() => import('./bauturi'));
const Miere = lazy(() => import('./miere'));
const Fainoase = lazy(() => import('./fainoase'));
const Plescoi = lazy(() => import('./plescoi'));
const CartPage = lazy(() => import('./CartPage'));
const Checkout = lazy(() => import('./checkout'));
const Orders = lazy(() => import('./orders'));
const Details2 = lazy(() => import('./details2'));


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


  return (
    <div className='App'>
      <UserContextProvider>
        <Suspense >
          <Router>
            <Navbar />
            <Routes>
              <Route path='/details' element={<Details />} />
              <Route path='/Write' element={<Write />} />
              <Route path='/Write/:id' element={<Write />} />
              <Route path='/' element={<Home />} />
              <Route path='/userpage' element={<Userpage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/details2' element={<Details2 />} />
              <Route path='/PlacesPage' element={<PlacesPage />} />
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
              <Route path='/vegan' element={<Vegan />} />
              <Route path='/camaraeco' element={<CamaraEco />} />
              <Route path='/bauturi' element={<Bauturi />} />
              <Route path='/miere' element={<Miere />} />
              <Route path='/fainoase' element={<Fainoase />} />
              <Route path='/plescoi' element={<Plescoi />} />
              <Route
                path='/CartPage'
                element={<CartPage cart={cart} />}
              />
             <Route
              path="/checkout"
              element={<Checkout setPreviousOrders={handleSetPreviousOrders} />}
            />
            <Route path="/orders" element={<Orders orders={previousOrders} />} />
            </Routes>
            <Footer />
            
          </Router>
        </Suspense>
      </UserContextProvider>
    </div>
  );
}

 function Main() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoaded ? <App /> : <SplashScreen />}
    </div>
  );
}  

 function AppWrapper() {
  return (
    
      <Main />
    
  );
} 

export default AppWrapper;
