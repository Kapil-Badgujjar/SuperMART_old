import { useNavigate } from 'react-router-dom';
import React, {useState, useEffect, useContext} from 'react'
// import Style from './UserCart.module.css';
import axios from 'axios';
import Context from '../utils/context';
export default function Product({product, update, setUpdate}) {
    const [quantity, setQuantity] = useState(product.itemQuantity);
    const {userID,loginCode} = useContext(Context);
    const navigate = useNavigate();
    
    useEffect(()=>{
      product.itemQantity = quantity;  
    },[quantity]);



    async function updateQuantity(productId, flag){
      const {status, data} = await axios.post(import.meta.env.VITE_SERVER_ADDRESS+'/cart/updatecart',{productID: productId, userID: userID, flag: flag},{withCredentials: true});
        if(status == 200){
          setQuantity(flag ? quantity+1 : quantity-1);
          update ? setUpdate(false) : setUpdate(true);
      }
    }
    async function removeProduct(productId){
      const {status, data} = await axios.post(import.meta.env.VITE_SERVER_ADDRESS+'/cart/removeproduct',{productID: productId, userID: userID},{withCredentials: true});
        if(status == 200){
            update ? setUpdate(false) : setUpdate(true);
      }
    };
  return (
    <div className="list" >
        <img src={product.imagesource} />
        <div className="details">
            <p>{product.displayname}</p>
            <p>Price: {product.price}</p>
        </div>
        <div className="quantity">
            <button onClick={()=>{updateQuantity(product.id,false)}}>-</button>
            <span>{product.quantity}</span>
            <button onClick={()=>{updateQuantity(product.id,true)}} >+</button>
            <button onClick={()=>{removeProduct(product.id)}}>Remove</button>
        </div>
    </div>
  )
}
