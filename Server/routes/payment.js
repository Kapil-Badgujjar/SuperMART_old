require('dotenv').config();
const express = require('express');
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const {getUserCart, orderSuccess} = require('../controllers/cartController')
router.post('/create-payment-session',async (req,res)=>{
  const storedItems = await getUserCart(req.body.userID);
  console.log(storedItems);
  try{
    const paymentSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: storedItems.cartData.map((item)=>{
        return {
          price_data : {
            currency: 'INR',
            product_data: {
              name: item.displayName,
            },
            unit_amount: item.price*100,
          },
          quantity: item.itemQuantity
        }
      }),
      success_url: process.env.CLIENT_URL + `/success/${req.body.userID}`,
      cancel_url: process.env.CLIENT_URL + '/cancel'
    })
    res.json({url: paymentSession.url});
  }
  catch (err){
    console.log(err);
    res.status(401).send("Failed");
  }
})

router.post('/order-successful',async (req,res)=>{
  console.log(req.body.userID, " Orders successful ");
  const status = await orderSuccess(req.body.userID);
  if(status) res.status(200).send('done');
  else res.status(404).send('failed');
});

module.exports = router;