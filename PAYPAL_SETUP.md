# PayPal Payment Integration - Setup Instructions

## Overview
PayPal has been integrated into your checkout flow using PayPal Smart Payment Buttons. This provides a simple, secure payment experience for your customers.

## Quick Setup Steps

### 1. Create PayPal Developer Account

1. Go to https://developer.paypal.com
2. Log in with your PayPal account (or create one)
3. Go to **Dashboard** → **Apps & Credentials**

### 2. Create a Sandbox App (for testing)

1. Make sure you're on the **Sandbox** tab
2. Click **Create App**
3. Enter an app name (e.g., "OfCourt Badminton")
4. Click **Create App**

You'll see two credentials:
- **Client ID** (starts with `A...`)
- **Secret** (hidden by default - click "Show")

### 3. Add Credentials to Environment

Create/update `.env.local` in your project root:

```bash
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_CLIENT_ID_HERE
PAYPAL_CLIENT_SECRET=YOUR_SECRET_HERE
PAYPAL_MODE=sandbox
```

Replace the values with your actual credentials from step 2.

### 4. Restart Development Server

```bash
npm run dev
```

## Testing The Integration

### Sandbox Test Accounts

PayPal automatically creates test accounts for you:

1. Go to https://developer.paypal.com/dashboard/accounts
2. You'll see **Sandbox Accounts** with test buyer and seller accounts
3. Click on a **Personal** (buyer) account to see credentials

### Test Flow

1. Add items to cart
2. Go to checkout
3. Click the **PayPal** button
4. Log in with your sandbox **buyer** account:
   - Email: (from sandbox accounts page)
   - Password: (from sandbox accounts page)
5. Complete the payment
6. You'll be redirected to the success page
7. Check your sandbox seller account to see the payment

## What's Been Implemented

✅ PayPal Smart Payment Buttons  
✅ Server-side order creation  
✅ Automatic payment capture  
✅ Success page with cart clearing  
✅ Error handling  
✅ Secure API integration  

## Important Notes

- **Sandbox Mode**: Currently configured for testing only
- **Live Mode**: To go live:
  1. Create a **Live** app in PayPal Dashboard
  2. Get Live credentials
  3. Change `PAYPAL_MODE=live` in `.env.local`
  4. Replace Client ID and Secret with live versions
- **Security**: Never commit `.env.local` to git

## Button Customization

You can customize the PayPal button appearance in `checkout/page.js`:

```javascript
style={{
  layout: 'vertical',  // or 'horizontal'
  color: 'gold',      // 'gold', 'blue', 'silver', 'white', 'black'
  shape: 'rect',      // or 'pill'
  label: 'paypal',    // or 'checkout', 'buynow', 'pay'
}}
```

## Supported Payment Methods

PayPal buttons automatically support:
- PayPal balance
- Credit/Debit cards
- Bank accounts (in some regions)
- Buy Now Pay Later options (when eligible)

## Troubleshooting

**"PayPal Not Configured" message?**  
Add the Client ID to `.env.local` and restart the server.

**Payment not completing?**  
Check browser console for errors and verify your credentials are correct.

**Need help?**  
Visit https://developer.paypal.com/docs/checkout/ for documentation.

## Going Live Checklist

- [ ] Create Live App in PayPal Dashboard
- [ ] Update `.env.local` with Live credentials
- [ ] Change `PAYPAL_MODE` to `live`
- [ ] Test with real (small) transactions
- [ ] Verify payments appear in your live PayPal account
