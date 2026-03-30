

# Okads Seafood — Full E-Commerce Website

## Overview
Build a modern, premium seafood e-commerce store at `/okads` inspired by Glovo's clean hero layout and Chowdeck's bold Nigerian personality. Ocean blue/teal palette. Full cart, checkout, and Paystack payment integration. Admin panel for managing products and orders.

## Business Context
**Okads Seafood** is an Abuja-based seafood store selling fresh fish, frozen food, dry seafood, crayfish, snails, and wholesale combo deals. Prices in Nigerian Naira (₦). Next day delivery available. Phone: +234 701 436 6630.

## Design Direction

```text
Color Palette (Ocean Blue/Teal):
  Primary:    #0D9488 (teal-600)
  Secondary:  #134E4A (teal-900)
  Accent:     #F97316 (orange — from original Okads brand, used sparingly)
  Background: #F0FDFA (teal-50)
  Dark BG:    #042F2E (teal-950)
```

Inspired by:
- **Glovo**: Address/location input hero, floating food imagery, category circles, warm friendly tone
- **Chowdeck**: Bold headline typography, delivery-focused UX, Nigerian pidgin personality, vertical category cards
- **Elevated**: Premium seafood photography placeholders, wave/ocean decorative elements, glass-morphism cards

## Pages & Routing

| Route | Page |
|-------|------|
| `/okads` | Landing/storefront (hero + categories + featured products + how it works + footer) |
| `/okads/shop` | Full product catalog with filters |
| `/okads/shop/:category` | Category-filtered view |
| `/okads/product/:id` | Product detail page |
| `/okads/cart` | Shopping cart |
| `/okads/checkout` | Checkout with delivery address + Paystack |
| `/okads/orders` | Customer order history |
| `/okads/auth` | Login/signup |
| `/okads/admin` | Admin: manage products, orders, categories |

## Database Schema (new migration)

**7 new tables**, all with RLS:

| Table | Purpose | Key Columns |
|-------|---------|------------|
| `okads_categories` | Product categories | name, slug, image_url, description, sort_order |
| `okads_products` | Product catalog | name, slug, description, price, compare_price, image_url, category_id, weight_unit, in_stock, featured |
| `okads_customers` | Customer profiles | user_id (auth), full_name, phone, address, city, state |
| `okads_orders` | Orders | customer_id, order_number, status, total, delivery_fee, delivery_address, payment_reference |
| `okads_order_items` | Line items | order_id, product_id, quantity, unit_price |
| `okads_cart_items` | Persistent cart | user_id, product_id, quantity |
| `okads_admin_users` | Admin role check | user_id (simple admin flag table) |

RLS: Customers see only their own data. Admin users (via `okads_admin_users` table) can manage products, categories, and view all orders. Products and categories are publicly readable.

## File Structure

```text
src/
  pages/OkadsSeafood.tsx          ← Layout shell with header/footer
  components/okads/
    OkadsHeader.tsx               ← Nav: logo, search, cart icon, auth
    OkadsHero.tsx                 ← Bold hero with delivery address input
    OkadsCategories.tsx           ← Category cards (Glovo-style circles)
    OkadsFeaturedProducts.tsx     ← Product grid with "Hot Deals"
    OkadsHowItWorks.tsx           ← 3-step: Browse → Order → Deliver
    OkadsFooter.tsx               ← Contact, WhatsApp, socials
    OkadsProductCard.tsx          ← Reusable product card with add-to-cart
    OkadsProductDetail.tsx        ← Full product page
    OkadsShop.tsx                 ← Catalog with sidebar filters
    OkadsCart.tsx                 ← Cart page with quantity controls
    OkadsCheckout.tsx             ← Delivery form + Paystack payment
    OkadsOrderHistory.tsx         ← Customer order list
    OkadsAuth.tsx                 ← Login/signup for customers
    OkadsAdmin.tsx                ← Admin dashboard (products CRUD, orders)
    shared/
      useCart.ts                  ← Cart hook (Supabase-backed for logged in, localStorage for guests)
      useOkadsProducts.ts         ← Product queries
      types.ts                    ← TypeScript interfaces
```

## Key Features

### Hero Section (Chowdeck + Glovo fusion)
- Bold headline: "Fresh Seafood, Delivered to Your Door"
- Subtitle with Abuja delivery promise
- Delivery address input with "Order Now" button (Glovo-style)
- Floating seafood imagery with ocean wave decorative elements
- WhatsApp order button as secondary CTA

### Product Catalog
- Category filter sidebar + search bar
- Grid of product cards with image, name, price (₦), weight, add-to-cart
- "Out of Stock" badge support
- Sort by: price, name, newest

### Cart & Checkout
- Persistent cart (Supabase for logged-in users, localStorage for guests)
- Quantity adjustment, remove items
- Delivery fee calculation (flat ₦2,000 for Abuja)
- Paystack payment integration via edge function
- Order confirmation with order number

### Admin Panel
- Protected by `okads_admin_users` table
- CRUD for products and categories
- Order management (view, update status: pending → processing → delivered)
- Image upload via Supabase Storage

### Seed Data
Pre-populate categories matching the real Okads store:
1. Fresh Fish (Per Kg)
2. Seafood Delights
3. Frozen Food Cartons & Packs
4. Dry Foodstuffs & Local Ingredients
5. Wholesale & Combo Deals

Sample products with real prices from the site (e.g., Barracuda Steak ₦12,000, River Crab ₦X).

## Payment Integration
- Paystack via an edge function (`okads-paystack-initialize` and `okads-paystack-verify`)
- Will need the Paystack secret key as a secret
- Flow: Cart → Checkout form → Initialize payment → Paystack popup → Verify → Create order

## Storage
- Create `okads-products` storage bucket for product images
- Public read access, admin-only write

## Technical Notes
- Route registered in `App.tsx` as `/okads/*`
- Fully self-contained — no interference with Zymaxon or LifeOS
- Responsive: mobile-first design
- All prices in ₦ (Nigerian Naira)

