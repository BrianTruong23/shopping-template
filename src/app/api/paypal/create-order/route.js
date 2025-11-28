import { NextResponse } from 'next/server';

const PAYPAL_API = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  console.log('Getting PayPal access token...');
  console.log('Client ID exists:', !!process.env.PAYPAL_CLIENT_ID);
  console.log('Secret exists:', !!process.env.PAYPAL_CLIENT_SECRET);
  console.log('Using API:', PAYPAL_API);

  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('PayPal auth error:', data);
    throw new Error(`PayPal auth failed: ${data.error_description || data.error}`);
  }

  console.log('Access token obtained successfully');
  return data.access_token;
}

export async function POST(request) {
  try {
    const { amount } = await request.json();
    console.log('Creating PayPal order for amount:', amount);

    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount.toFixed(2),
            },
          },
        ],
      }),
    });

    const order = await response.json();

    if (!response.ok) {
      console.error('PayPal order creation error:', order);
      return NextResponse.json(
        { error: order.message || 'Failed to create order' },
        { status: response.status }
      );
    }

    console.log('Order created successfully:', order.id);
    return NextResponse.json({ id: order.id });
  } catch (error) {
    console.error('PayPal error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
