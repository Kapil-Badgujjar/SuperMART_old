const express = require('express');
// const app = express();
// const multer = require('multer');
// const bodyParser = require('body-parser');
const fetchProducts = require('../controllers/productsController');
const { addProduct, updateProduct, deleteProduct } = require('../services/manageProducts');
const router = express.Router();

// app.use(bodyParser.urlencoded({extended: true}));

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//          cb(null,'assets/images');
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// const upload = multer({storage: storage});

router.get('/get-products',async (req,res)=>{
    let products = await fetchProducts.getAllProducts();
    if(products.length>0) { res.statusCode=200; res.json(products);}
    else{res.statusCode=404; res.json('No more products found!'); }
});

router.post('/singleproduct',async (req,res)=>{
    // console.log(req.body.productID);
    let product = await fetchProducts.getSingleProduct(req.body.productID);
    console.log(product);
    if(product){
        res.statusCode = 200;
        res.json(product);
    }
    });

router.post('/add-product', async (req,res)=>{
    console.log(req.body);
    let product = req.body;
    if(product.name == undefined||product.displayName == undefined||product.price == undefined||product.color == undefined||product.description == undefined||product.availableStocks == undefined){
        res.status(200).send({message: 'Please fill values properly'});
    }else{
        const response = await addProduct(product);
        res.end('Successfully added product');
    }
});

// router.route('/edit-product').post(async(req,res)=>{
//     let productID = req.body.productID;
//     let product = await loadProducts(false,undefined,productID);
//     res.json(product);
// });

router.post('/update-product',async (req,res)=>{
    console.log(req.body);
    let product = req.body;
    let flag = await updateProduct(product);
    if(flag){
        res.statusCode = 200;
        res.end('Successfully updated product');
    } else {
        res.statusCode = 404;
        res.end('failed to update product');
    }
});

router.route('/delete-product').post(async(req,res)=>{
    let flag = await deleteProduct(req.body.productID);
    if(flag){
        res.statusCode = 200;
        res.end('')
    }
    else{
        res.statusCode = 404;
        res.end('faild');
    }
});

module.exports = router;