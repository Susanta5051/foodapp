import { create } from 'zustand'
import {persist , createJSONStorage} from 'zustand/middleware'
import axios from'axios'

import type{ LoginInputState} from '../schema/UserSchema'
import { toast } from 'react-toastify'

const API_END_POINT = (import.meta.env.VITE_SERVER_API_END_POINT || 'http://localhost:3000/api/v1' )+ '/user'
axios.defaults.withCredentials = true
type ContainerType = {
  menu:{
    _id:string;
    image: string;
    name: string;
    desc: string;
    price: number;
    category: Array<string>;
    address: string;
    store: string;
},
  quantity: number;
};

type User = {
    _id:string,
    fullName:string,
    email:string,
    phone:number,
    address:string,
    pincode:number,
    profilePicture:string,
    admin:boolean,
    isVerified:boolean;
    cart:ContainerType[]
}

type UserState = {
    user: User | null ,
    isAuthenticated:boolean,
    isCheckingAuth: boolean,
    loading:boolean,
    register: (formData:FormData)=>Promise<boolean>,
    login: (formData:LoginInputState)=>Promise<boolean>,
    verifyEmail: (verificationCode : string , email :string)=>Promise<void>,
    checkAuthentication: ()=>Promise<void>,
    logout: ()=>Promise<void>,
    forgotPassword: (email:string)=>Promise<void>,
    resetPassword: (token:string,newPassword:string)=>Promise<void>,
    updateProfile: (input:Partial<User>)=>Promise<boolean>,
    findUserById: (id:string)=>Promise<void>,
    increaseCartItem: (itemId:string)=>Promise<void>,
    decreaseCartItem: (itemId:string)=>Promise<void>,
    removeCartItem: (itemId:string)=>Promise<void>    
}
export const useUserStore = create<UserState>()(persist((set)=>({
    user:null,
    isAuthenticated:false,
    isCheckingAuth:false,
    loading:false, 
    register: async(formData:FormData)=>{
        try{
            set({loading:true})
            console.log("data to be sent")
            console.dir(formData.forEach((value,key)=>{
                console.log(key,value)
            }))
            const response = await axios.post(`${API_END_POINT}/register`,formData,
                {
                    headers:{
                        "Content-Type":"multipart/form-data"
                    }
                }
            )
            if(response.data.success){
                toast.success(response.data.message);
                set({loading:false , user:response.data.user,isAuthenticated:true })
                return true;
            }
            return false;
        }catch(error:any){
            set({loading:false})
            toast.error(JSON.stringify(error.response.data.message))
            console.log(error)
            return false;
        }
    }
    ,
    login: async(formData:LoginInputState)=>{
        try{
            set({loading:true})

            const response = await axios.post(`${API_END_POINT}/login`,formData,{headers :{ "Content-Type" : 'application/json'}})

            if(response.data.success){
                toast.success(response.data.message);
                set({loading:false , user:response.data.user,isAuthenticated:true })
                return true;
                // console.log(response.data.user)
            }
            
        }catch(error:any){
            set({loading:false})
            toast.error(JSON.stringify(error.response.data.message))
            // console.log(error)
        }finally{
            set({loading:false})
            return false;
        }
    },
    
    verifyEmail: async (verificationCode : string , email :string)=>{
        try{
            // console.log(email)
            set({loading:true});
            const response = await axios.post(`${API_END_POINT}/verify-email` , {verificationCode , email},{ 
                headers:{
                    'Content-Type':'application/json'
                }
            })

            if(response.data.success){
                toast.success(response.data.message)
                set({loading:false, user:response.data.user,isAuthenticated:true})
            }
        }catch(error:any){
            toast.error(error.response.data.message)
            set({loading:false})
        }
    },

    checkAuthentication: async()=>{
        try{
            set({ isCheckingAuth:true});
            // setTimeout(()=>{
            //     console.log("checking auth")
            // },5000)
            // console.log("auth")
            const response = await axios.get(`${API_END_POINT}/check-auth`,{ withCredentials: true })
            // console.log(response)
            // console.log("auth response")
            // console.dir(response)
            if(response.data.success){
                set({loading:false , user: response.data.user , isAuthenticated:true , isCheckingAuth:false})
            }
        }catch(error){
            console.dir(error)
            set({loading:false , isAuthenticated:false,user:null , isCheckingAuth:false})
        }
    },
    logout: async()=>{
        try{
            set({loading:true});
            const response = await axios.post(`${API_END_POINT}/logout`);
            if(response.data.success){
                toast.success(response.data.message)
                set({loading:false , isAuthenticated:false ,user:null})
            }
        }catch(error:any){
            toast.error(error)
             set({loading:false})
        }
    },
    forgotPassword: async (email:string)=>{
        try{
            set({loading:true})
            const response = await axios.post(`${API_END_POINT}/forgot-password`,{email});
            if(response.data.success){
                toast.success(response.data.message);
                set({loading:false})
            }
        }catch(error:any){
            toast.error(error.response.data.message)
            set({loading:false})
        }
    },
    resetPassword : async(token:string,newPassword:string)=>{
        try{
            set({loading:true});
            const response = await axios.post(`${API_END_POINT}/reset-password/${token}` , {newPassword});
            if(response.data.success){
                set({loading:false});
                toast.success(response.data.message)
            }
        }catch(error:any){
            toast.error(error.response.data.message);
            set({loading:false})
        }
    },
    updateProfile: async(input:Partial<User>)=>{
        try{
            set({loading:true});
            const response = await axios.put(`${API_END_POINT}/profile/update`,input,{
                headers:{
                    "Content-Type":"application/json"
                }
            })
            if(response.data.success){
                toast.success(response.data.message);
                set({loading:true, user:response.data.user,isAuthenticated:true})
                return true;
            }
        }catch(error){
            set({loading:false})
        }finally{
            set({loading:false})
            return false;
        }
    },
    findUserById: async(id:string)=>{
        try{
            set({loading:true})
            const response = await axios.get(`${API_END_POINT}/find/${id}`)
            if(response.data.success){
                set({loading:false,user:response.data.user,isAuthenticated:true})
            }
        }catch(error){
             set({loading:false})
        }
    },

    increaseCartItem: async (itemId:string)=>{
        try{
            set({loading:true})
            const response = await axios.patch(`${API_END_POINT}/cart/increase`,{itemId},{
                headers:{
                    "Content-Type":"application/json"
                }
            })
            if(response.data.success){
                set({loading:false,user:response.data.user,isAuthenticated:true})
            }
        }catch(error){
            set({loading:false})
        }
    },
    decreaseCartItem: async (itemId:string)=>{
        try{
            set({loading:true})

            const response = await axios.patch(`${API_END_POINT}/cart/decrease`,{itemId},{
                headers:{
                    "Content-Type":"application/json"
                }
            })
            if(response.data.success){
                set({loading:false,user:response.data.user,isAuthenticated:true})
            }
        }catch(error){
            set({loading:false})
        }
    },
    removeCartItem: async (itemId:string)=>{
        try{
            set({loading:true})
            const response = await axios.patch(`${API_END_POINT}/cart/remove`,{itemId},{
                headers:{
                    "Content-Type":"application/json"
                }
            })
            if(response.data.success){
                set({loading:false,user:response.data.user,isAuthenticated:true})
            }
        }catch(error){
            set({loading:false})
        }
    }    

}),{
    name:'user-name',
    storage: createJSONStorage(()=>localStorage )
}))
