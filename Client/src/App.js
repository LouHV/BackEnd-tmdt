import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'
import {
  Home,
  Login,
  Public,
  Faq,
  DetailProducts,
  Blogs,
  Services,
  Products,
  Register,
  ResetPassword,
  FinalRegister
} from './pages/public'
import path from './ultils/path'
import {
  AdminLayout,
  ManageUser,
  ManageProduct,
  ManageOrder,
  CreateProduct,
  Dashboard
} from './pages/admin'
import {
  MemberLayout,
  Personal,
  MyCart,
  History,
  WishList,
} from './pages/member'
import { getCategories } from './store/app/asyncActions';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Modal } from './components';
import DetailCart from './pages/public/DetailCart';
import Checkout from './pages/member/Checkout';
import SearchPrd from './components/common/SearchPrd';
import Notfound from './Notfound';


function App() {
  const dispatch = useDispatch()
  const { isShowModal, modalChildren } = useSelector(state => state.app)
  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])
  return (
    <div className="min-h-screen font-main relative">
      {/* bo min-h-screen cung dc */}
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        <Route path={path.PUBLIC} element={<Public />} >
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route path={path.FAQS} element={<Faq />} />
          <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProducts />} />
          <Route path={path.SERVICES} element={<Services />} />
          <Route path={path.PRODUCTS__CATEGORY} element={<Products />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={path.DETAIL_CART} element={<DetailCart />} />
          <Route path={path.SEARCH} element={<SearchPrd />} />
          {/* //mememe */}
          <Route path={path.MEMBER} element={<MemberLayout />}>
            <Route path={path.PERSONAL} element={<Personal />} />
            <Route path={path.HISTORY} element={<History />} />
            <Route path={path.WISHLIST} element={<WishList />} />
            <Route path={path.MY_CART} element={<MyCart />} />
          </Route>

          <Route path={path.ALL} element={<Notfound />} />

        </Route>
        {/* admin */}
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
          <Route path={path.MANAGE_PRODUCTS} element={<ManageProduct />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
          <Route path={path.CREATE_PRODUCTS} element={<CreateProduct />} />
        </Route>
        {/* member */}
        {/* <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />} />
        </Route> */}
        {/* lien quan login */}
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.REGISTER} element={<Register />} />
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.CHECKOUT} element={<Checkout />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />
    </div>
  );
}

export default App;
