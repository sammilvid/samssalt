const express = require('express');
const stripe = require('stripe')('sk_test_51RkRcNHH0Yyar6VxAv52zOnxp7Cq3Ivih48kQG0uIG67jjOq5KZsMfiZiHWQz6HuDJcPjtpSG14tUEBBlfPzHzGW00dmu20rc4');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Stripe checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { product, quantity, totalPrice, lineItems, totalAmount } = req.body;
    
    // Handle cart checkout (multiple items)
    if (lineItems && totalAmount) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount, // Amount in cents
        currency: 'usd',
        metadata: {
          checkout_type: 'cart',
          item_count: lineItems.length.toString(),
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({ 
        client_secret: paymentIntent.client_secret,
        id: paymentIntent.id 
      });
      return;
    }
    
    // Handle single product checkout (backward compatibility)
    if (product && quantity && totalPrice) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalPrice, // Amount in cents
        currency: 'usd',
        metadata: {
          product_name: product.name,
          quantity: quantity.toString(),
          checkout_type: 'single',
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({ 
        client_secret: paymentIntent.client_secret,
        id: paymentIntent.id 
      });
      return;
    }
    
    // Invalid request
    res.status(400).json({ error: 'Invalid request parameters' });
    
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Success page endpoint
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'success.html'));
});

// Serve the order page
app.get('/order', (req, res) => {
  res.sendFile(path.join(__dirname, 'order.html'));
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Order page: http://localhost:3000/order.html');
}); 