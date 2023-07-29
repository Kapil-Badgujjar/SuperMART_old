import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Product from './CartProduct';
import Context from '../utils/context';
import './StyleSheet.scss';
import axios from 'axios';
// import ButtonType1 from '../components/Button/ButtonType1';

export default function UserCart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [update, setUpdate] = useState(false);
  const {userID, loginCode} = useContext(Context)
  const navigate = useNavigate();
  useEffect(() =>{
    if(loginCode!=1) navigate('/login');
    async function fun(){
      const response = await axios.get('http://lsuper-mart-backend.vercel.app/cart/getUserCart',{withCredentials: true});
      console.log(response);
        if(response.status == 200){
          if(response.data.length > 0){
            setIsEmpty(false);
          }
          else{
            setIsEmpty(true);
          }
          setCartProducts(response.data);
        }
      }
      fun();
      
  },[]);
  useEffect(() =>{
    async function fun(){
      const response = await axios.get('http://super-mart-backend.vercel.app/cart/getUserCart',{withCredentials:true});
        if(response.status == 200){
          if(response.data.length > 0){
            setIsEmpty(false);
          }
          else{
            setIsEmpty(true);
          }
          setCartProducts(response.data);
        }
    }
  fun();
},[update]);

  const handlePayment = async () => {
    console.log('Payment cliked');
      try{
          const {data} = await axios.post("http://super-mart-backend.vercel.app/payments/create-payment-session",{userID: userID},{withCredentials:true});
          console.log(data);
          window.location.href = data.url;
      }
      catch (err){
          console.log(err);
      }
    }

  return (
    <div>
        {isEmpty && <p className="Empty-msg">Empty Cart...</p>}
        <div>
          <div className="cartlist">
            {cartProducts.map((product) =>{
              return (
                <Product key={product.productID} product={product} update={update} setUpdate={setUpdate}/>
              )
            })}
            <button onClick={handlePayment}>Checkout</button>
          </div>
        </div>
    </div>
  )
}
