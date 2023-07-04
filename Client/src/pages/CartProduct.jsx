import { useNavigate } from 'react-router-dom';
import React, {useState, useEffect, useContext} from 'react'
import Style from './UserCart.module.css';
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
      const {status, data} = await axios.post('https://super-mart-backend.vercel.app/cart/updatecart',{productID: productId, userID: userID, flag: flag},{withCredentials: true});
        if(status == 200){
          setQuantity(flag ? quantity+1 : quantity-1);
          update ? setUpdate(false) : setUpdate(true);
      }
    }
    async function removeProduct(productId){
      const {status, data} = await axios.post('https://super-mart-backend.vercel.app/cart/removeproduct',{productID: productId, userID: userID},{withCredentials: true});
        if(status == 200){
            update ? setUpdate(false) : setUpdate(true);
      }
    };
  return (
    <div className="list" >
        <img src={"https://super-mart-backend.vercel.app/" + product.imageSource} />
        <div className="details">
            <p>{product.displayName}</p>
            <p>Price: {product.price}</p>
        </div>
        <div className="quantity">
            <button onClick={()=>{updateQuantity(product.productID,false)}}>-</button>
            <span>{quantity}</span>
            <button onClick={()=>{updateQuantity(product.productID,true)}} >+</button>
            <button onClick={()=>{removeProduct(product.productID)}}>Remove</button>
        </div>
    </div>
  )
}
