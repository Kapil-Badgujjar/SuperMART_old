const express = require('express');
const router = express.Router();

const { updateItems, updateQuantity, removeProduct, getUserCart } = require('../controllers/cartController');

// Fetch the user's cart using a GET request
router.get('/getUserCart', async (req, res) => {
  try {
    if (req.session.userID) {
      const cartItems = await getUserCart(req.session.userID);

      if (cartItems.flag) {
        res.status(200).json(cartItems.cartData);
      } else {
        res.status(200).json([]);
      }
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add an item to the cart
router.post('/addtocart', async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      console.log(req.body, "Hello!");
      const flag = await updateItems(req.session.userID, req.body.productID);
      if (flag) {
        res.status(200).end('');
      } else {
        res.status(404).end('');
      }
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update the cart
router.post('/updatecart', async (req, res) => {
  try {
    console.log(req.body);
    if (req.session.isLoggedIn) {
      const localFlag = await updateQuantity(req.session.userID, req.body.productID, req.body.flag);
      if (localFlag) {
        res.status(200).end('success');
      } else {
        res.status(404).end('success');
      }
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Remove a product from the cart
router.post('/removeproduct', async (req, res) => {
  try {
    console.log(req.body);
    if (req.session.isLoggedIn) {
      const localFlag = await removeProduct(req.session.userID, req.body.productID);
      if (localFlag) {
        res.status(200).end('');
      } else {
        res.status(404).end('');
      }
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
