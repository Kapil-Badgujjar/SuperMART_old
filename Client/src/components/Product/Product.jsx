import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Product.scss'
export default function Product({product, flag}) {
  const navigate = useNavigate();
  console.log(product)
  return (
    <div  className={flag ? "productCard":"productRow"} onClick={()=>{ flag ? navigate(`../singleproduct/${product?.id}`):navigate(`../editproduct/${product?.id}`)}}>
        <img src={product.imagesource} />
        { !flag && <p>ID : {product.id}</p> }
        { !flag && <span>Name : {product.displayname}</span>}
        <div>
            {flag && <p>{product.displayname}</p>}
            <p className="price">Price: &#8377;{product.price}</p>
        </div>
    </div>
  )
}
