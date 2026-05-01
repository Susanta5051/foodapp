
// import './App.css'
import ForgotPassword from './auth/ForgotPassword'
import {Login} from './auth/Login'
import { Register } from './auth/Register'
import ChangePassword from './auth/ChangePassword'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Profile from './pages/Profile'
import Products from './pages/Products'
import UserContext from '../src/context/UserContext'
import EditProfile from './auth/EditProfile'
import Cart from './pages/Cart'
import Store from './pages/Store'
import { ToastContainer } from 'react-toastify'
import StoreDetails from './pages/StoreDetails'
import VerifyEmail from './auth/VerifyEmail'
import { useUserStore } from './store/useUserStore'
import MainLayout from './pages/MainLayout'
import { useEffect } from 'react'
// import Loading from './pages/Loading'
import EditProduct from './pages/resturant/pages/EditProduct'
import AddProduct from './pages/resturant/pages/AddProduct'
import EditResturantProfile from './pages/resturant/auth/EditResturant'
import ResturantRegister from './pages/resturant/auth/CreateResturant'
import Resturant from './pages/resturant/pages/ResturantHome'
// import { Verified } from 'lucide-react'

 const ProtectedRoutes = ({children} : {children:React.ReactNode})=>{
    const {isAuthenticated ,user} = useUserStore();
    if(!isAuthenticated){
      return <Navigate to='/login' replace></Navigate>
    }
    if( user && !user.isVerified){
      return <Navigate to='/verify-email' replace />
    }
    return children;
  }

  const AuthenticatedUser = ({children}:{children:React.ReactNode})=>{
    const {isAuthenticated , user} = useUserStore();
    if(isAuthenticated && user?.isVerified){
      return <Navigate to='/' replace />
    }
    return children;
  }
  const appRouter = createBrowserRouter([
    {
      path:'/',
      element:(
        <MainLayout/>
          ),
      children :[
            {
          path:'/',
          element:<HomePage/>
        },
        {
          path:'/products',
          element:<Products/>
        },
        {
          path:'/stores',
          element:<Store/>
        },
         {
          path:'/profile',
          element:(<ProtectedRoutes><Profile/></ProtectedRoutes>),
        },
        {
          path:'/resturant/:resturantId',
          element:<StoreDetails/>
        },
        // {
        //   path:'/search/:text',
        //   element:<Searchpage/>
        // },
        {
          path:'/cart',
          element:(<ProtectedRoutes><Cart/></ProtectedRoutes>)
        },
        // {
        //   path:'/order/status',
        //   element:<Order/>
        // },
            {
      path:'/profile/edit',
        element:<ProtectedRoutes><EditProfile/></ProtectedRoutes>
      },
      ]
    },
    {
      path:'/login',
      element:<AuthenticatedUser><Login/></AuthenticatedUser>
    },
    {
      path:'/register',
      element:<AuthenticatedUser><Register/></AuthenticatedUser>
    },
    {
      path:'/forgot-password',
      element:<AuthenticatedUser ><ForgotPassword/></AuthenticatedUser>
    },
    {
      path:'/change-password',
      element:<ChangePassword/>
    },
    {
      path:'/verify-email',
      element:< VerifyEmail/>
    },
   {
    path:'/resturant',
    element:<MainLayout/>,
    children:[
      {
      index:true,
      element:<Resturant/>
    },
    {
      path:'create',
      element:<ResturantRegister/>
    },
    
    {
      path:'edit-profile',
      element:<EditResturantProfile/>
    },
    {
      path:'add-product',
      element:<AddProduct/>
    },
    {
      path:':/storeId',
      element:<StoreDetails/>
    },
    
     {
      path:':productid/edit-product',
      element:<EditProduct/>
    }
    ]
   }
  ])


function App() {
    
  const {checkAuthentication ,user} = useUserStore();

  useEffect(()=>{
    checkAuthentication()
  },[])
  useEffect(()=>{
    console.log("Verified:", user?.isVerified)
  },[user])
  return (
    <UserContext >
      
      <RouterProvider router={appRouter} />
      <ToastContainer position='bottom-left'/>
    </UserContext>
    
  )
}

export default App

