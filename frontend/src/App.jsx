import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Bundles from './pages/Bundles'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'
import AddAddress from "./pages/AddAddress";
import EditAddress from "./pages/EditAddress";
import PaymentSuccess from './pages/PaymentSuccess'
import OrderTracking from './pages/OrderTracking'
import Privacy from './pages/Privacy' 
import Refund from './pages/Refund'

import NotFound from './pages/NotFound'

import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminVendors from './pages/admin/AdminVendors'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminDiscounts from './pages/admin/AdminDiscounts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminEditProduct from './pages/admin/AdminEditProduct'
import AdminBundles from './pages/admin/AdminBundles'
import CreateBundle from './pages/admin/CreateBundle'
import EditBundle from './pages/admin/EditBundle'

import DashboardHome from "./pages/vendor/DashboardHome";
import VendorProducts from "./pages/vendor/VendorProducts";
import VendorOrders from "./pages/vendor/VendorOrders";
import StoreSettings from "./pages/vendor/StoreSettings";
import VendorAuth from "./pages/vendor/VendorAuth";
import VendorAnalytics from "./pages/vendor/VendorAnalytics";
import AddProduct from "./pages/vendor/AddProduct";
import EditProduct from "./pages/vendor/EditProduct";
import VendorBundles from "./pages/vendor/VendorBundles";
import VendorAddBundle from "./pages/vendor/VendorAddBundle";
import VendorEditBundle from "./pages/vendor/VendorEditBundle";
import VendorReviews from "./pages/vendor/VendorReviews";


import Wishlist from './pages/Wishlist'
import BundleDetail from './pages/BundleDetail'
import VendorStore from './pages/vendor/VendorStore'
import About from './pages/About'
import Terms from './pages/Terms'



export default function App() {

  const location = useLocation()

  // ❌ Hide navbar/footer on these routes
  const hideUI =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/vendor")

  return (
    <>
      {!hideUI && <Navbar />}

      <div className={hideUI ? "" : "mt-14 min-h-[70vh]"}>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/product/:id" element={<ProductDetail/>} />
          <Route path="/bundles" element={<Bundles/>} />
          <Route path="/bundle/:id" element={<BundleDetail/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/track/:id" element={<OrderTracking />} />
          <Route path='/about' element={<About/>}/>
          <Route path="/vendor/:id" element={<VendorStore />} />
          <Route path="/order/:id" element={<OrderTracking />} />

          <Route path="/checkout" element={<Checkout />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund" element={<Refund />} />



          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/contact-us" element={<Contact/>}/>
          
          <Route path="/edit-address/:addressId" element={<EditAddress />} />
          <Route path="/payment-success" element={<PaymentSuccess/>} />


          {/* ADMIN ROUTES (no navbar/footer) */}
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/vendors" element={<AdminVendors />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/discounts" element={<AdminDiscounts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} />
          <Route path='/admin/bundles' element={<AdminBundles />} />
          <Route path='/admin/bundles/edit/:id' element={<EditBundle/>} />
          <Route path='admin/bundles/create' element={<CreateBundle/>}/>



          {/* VENDOR ROUTES (no navbar/footer) */}
          <Route path="/vendor" element={<DashboardHome/>} />
          <Route path="/vendor/products" element={<VendorProducts/>} />
          <Route path="/vendor/products/add" element={<AddProduct />} />
          <Route path="/vendor/orders" element={<VendorOrders/>} />
          <Route path="/vendor/settings" element={<StoreSettings/>} />
          <Route path='/vendor/register' element={<VendorAuth/>} />
          <Route path="/vendor/analytics" element={<VendorAnalytics />} />
          <Route path="/vendor/products/edit/:id" element={<EditProduct />} />
           <Route path="/vendor/bundles" element={<VendorBundles />} />
  <Route path="/vendor/bundles/new" element={<VendorAddBundle />} />
  <Route path="/vendor/bundles/:id/edit" element={<VendorEditBundle />} />
           <Route path="/vendor/reviews" element={<VendorReviews/>} />
          {/* WISHLIST */}
          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="*" element={<NotFound/>} />

        </Routes>
      </div>

      {!hideUI && <Footer />}
    </>
  )
}
