const fetch = require('node-fetch');

async function reproduceOrderInsert() {
  const url = 'http://localhost:3000/api/create-order';
  
  const mockCart = [
    {
      cartId: 'test-item-1',
      title: 'Test Racket',
      price: '$200',
      totalPrice: 200,
      quantity: 1
    },
    {
      cartId: 'test-item-2',
      title: 'Test Shoes',
      price: '$150',
      totalPrice: 150,
      quantity: 2
    }
  ];

  const payload = {
    customer_email: 'test_repro@example.com',
    customer_name: 'Test Repro User',
    total_price: 500,
    items: mockCart
  };

  console.log('Sending payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', text);

    if (response.ok) {
      const data = JSON.parse(text);
      console.log('Order created with ID:', data.order.id);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

reproduceOrderInsert();
