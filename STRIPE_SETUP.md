# Stripe Payment Integration - Setup Instructions

## Overview
Stripe has been successfully integrated into your checkout flow. To complete the setup, you need to add your Stripe API keys.

## Quick Setup Steps

### 1. Get Your Stripe API Keys

1. Go to https://dashboard.stripe.com/register and create an account (or sign in)
2. Navigate to **Developers** → **API keys** in the Stripe Dashboard
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"

### 2. Add Keys to Your Environment

Create a file called `.env.local` in your project root (`/Users/thangtruong/Documents/ofcourt-badminton/`) with these contents:

```bash
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
```

Replace `YOUR_KEY_HERE` with your actual keys from step 1.

### 3. Restart the Development Server

```bash
npm run dev
```

## Testing The Integration

### Test Card Numbers

Stripe provides test cards that simulate different scenarios:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Declined (insufficient funds) |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |

**For all test cards:**
- Use any future expiry date (e.g., `12/34`)
- Use any 3-digit CVC (e.g., `123`)
- Use any billing ZIP code

### Test Flow

1. Add items to cart
2. Go to checkout
3. Fill in the payment form with test card `4242 4242 4242 4242`
4. Enter any future expiry and CVC
5. Click "Pay Now"
6. You should be redirected to the success page
7. Check your Stripe Dashboard → Payments to see the test payment

## What's Been Implemented

✅ Stripe Elements UI for card input  
✅ PaymentIntent API integration  
✅ Automatic payment confirmation  
✅ Success page with cart clearing  
✅ Error handling and user feedback  
✅ Secure server-side payment processing  

## Important Notes

- **Test Mode**: Currently configured for test mode only
- **Production**: Before going live, replace test keys with live keys (starts with `pk_live_` and `sk_live_`)
- **Security**: Never commit `.env.local` to git (it's already in `.gitignore`)

## Troubleshooting

**Build failing?** Make sure you've added the API keys to `.env.local` and restarted the dev server.

**Payment not working?** Check the browser console and Stripe Dashboard logs for error messages.

**Need help?** Visit https://stripe.com/docs for comprehensive documentation
