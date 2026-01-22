# 🎯 Quick Start - Stripe Test Mode

## 1️⃣ Get Stripe Key (1 minute)
```
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Sign up/Login
3. Toggle "Test mode" ON
4. Copy "Publishable key" (starts with pk_test_...)
```

## 2️⃣ Update Config (30 seconds)
Edit `client/.env`:
```env
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
```

## 3️⃣ Restart Containers (30 seconds)
```powershell
cd c:\Users\ilyas\Bureau\working\kollab
docker-compose down
docker-compose up -d
```

## 4️⃣ Test Payment (2 minutes)
1. **As Freelancer**: Create invoice → Click "Send Invoice"
2. **As Client**: Click "Pay Now" on the invoice
3. **Enter test card**:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
4. Click "Pay" → Payment succeeds! ✅

---

## 🎴 More Test Cards

| Card Number         | Result                    |
|---------------------|---------------------------|
| 4242 4242 4242 4242 | ✅ Success                |
| 4000 0000 0000 0002 | ❌ Declined               |
| 4000 0027 6000 3184 | 🔐 Authentication required |

---

## 🔍 Troubleshooting

**Error: "Stripe is not defined"**
→ Update `.env` and restart containers

**No "Pay Now" button**
→ Invoice must be in "Sent" status (not "Draft")

**"Invalid API key"**
→ Ensure you copied the **publishable** key (pk_test_...), not secret key

---

**That's it! 🎉**
Full guide: See `STRIPE_TEST_MODE_SETUP.md`
