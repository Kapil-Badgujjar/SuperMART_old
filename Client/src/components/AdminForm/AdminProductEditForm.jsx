import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { useRef } from 'react';
import Context from '../../utils/context';
import './AdminProductEditForm.scss';
import { Link, useNavigate } from 'react-router-dom';
export default function ProductForm({btnName, flag}) {
    const navigate = useNavigate();
    // const { register, handleSubmit} = useForm();
    const [msg, setMsg] = useState(false);
    const formRef = useRef(null);
    const { productDetails, setProductDetails,                 
        name, setName,
        displayName, setDisplayName,
        price, setPrice,
        color, setColor,
        description, setDescription,
        quantity, setQuantity,
        image, setImage,} = useContext(Context);

        const resetForm = () => {
            setName("")
            setDisplayName("")
            setPrice("")
            setColor("")
            setDescription("")
            setQuantity("")
          }

        function submitFunction(event){
            event.preventDefault();
            const formData= new FormData(formRef.current);
            formData.append('productID', productDetails.id);
            formData.append('sellerID', productDetails.sellerid);

            async function fun(){  
                console.log(formData)
                try {
                    console.log(flag)
                    const {data} = await axios.post(flag ? 'http://super-mart-backend.vercel.app/products/Update-product' : 'http://super-mart-backend.vercel.app/products/add-product' ,formData,{
                        headers: {
                            'Content-Type': 'application/json'
                          },    
                        withCredentials: true
                    });
                    console.log(data);
                    setMsg(data);
                    setTimeout(()=>{
                      setMsg(false);
                    },1000);

                } catch (error) {
                    console.log(error)
                }            
                 
            }      
            fun();  
        }
        async function deleteFun(ev){
            ev.preventDefault();
            await axios.post('http://lsuper-mart-backend.vercel.app/products/delete-product' ,{productID: productDetails.id}, {withCredentials: true});
            navigate('/admin');
        }
    return (
        <form ref={formRef} onSubmit={submitFunction} className="productForm">
            {msg ? <p className="ProductAdded"></p>: <p className="msgArea">Admin Panel</p>}
            <input type="text" placeholder='Product name' name="name" onChange={(e)=>{setName(e.target.value);}} value={name} />
            <input type="text" placeholder='Display name' name="displayName" onChange={(e)=>{setDisplayName(e.target.value);}} value={displayName}/>
            <input type="number" placeholder='Price' name="price" onChange={(e)=>{setPrice(e.target.value);}} value={price}/>
            <input type="text" placeholder='Color' name="color" onChange={(e)=>{setColor(e.target.value);}} value={color}/>
            <input type="text" placeholder='Description' name="description" onChange={(e)=>{setDescription(e.target.value);}} value={description}/>
            <input type="number" placeholder='Quantity' name="availableStocks" onChange={(e)=>{setQuantity(e.target.value);}} value={quantity}/>
            <input type="text" placeholder='Image Url' name="imageSource" onChange={(e)=>{setImage(e.target.value);}} value={image} />
            <input type="submit" value={btnName}/>
            {flag && <input type="button" onClick={(ev)=>deleteFun(ev)} value="Delete"/> }
            {!flag && <input type="button" onClick={(ev)=> resetForm(ev)} value="Reset Form"/>}
            <Link to='/admin'>Go back to home</Link>
        </form>
    )
}
