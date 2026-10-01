import axios from "axios";
import { toast } from "react-toastify";
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware";


const API_END_POINT =(import.meta.env.VITE_SERVER_API_END_POINT || 'http://localhost:3000/api/v1' )+ '/resturant'

type MenuType= {
    _id:string;
    resturantId:string;
  name:string;
  desc:string;
  image:string;
  price:number;
  quantity:number;
  categories:Array<string>
}
type ResturantType = {
    _id:string;
    user:string;
    resturantName : string;
    address:string;
    pincode:number,
    category:string,
    imageUrl:string;
    menus:MenuType[];
    phone:string;
}
// type ResturantInputType = {
//     user:string;
//     resturantName : string;
//     address:string;
//     pincode:number,
//     category:string,
//     image:File;
// }

type ResturantStore = {
    loading:boolean,
    resturant:ResturantType | null,
    detailedResturant:ResturantType | null,
    searchedResturant : ResturantType[] | null,
    createResturant: (formData:FormData)=>Promise<void>,
    getResturant:()=>Promise<void>,
    updateResturant: (formData:FormData)=>Promise<void>,
    searchResturant: (searchQuery:string)=>Promise<void>,
    getStoreDetails: (storeId:string)=>Promise<void>
}

export const useResturantStore = create<ResturantStore>()(persist((set)=>({
    loading:false,
    resturant:null,
    searchedResturant:null,
    detailedResturant:null,
    createResturant: async(formData:FormData)=>{
        try{
            set({loading:true})
            const response = await axios.post(`${API_END_POINT}/register`,formData,{
                headers: {
                    "Content-Type":"multipart/form-data"
                }
            })

            if(response.data.success){
                toast.success(response.data.message);
                set({loading:false})
            }
        }catch(error:any){
            toast.error(error.response.data.message);
            set({loading:false})            
        }
    },
    getResturant:async ()=>{
        try{
            set({loading:true})
            const response = await axios.get(`${API_END_POINT}/single`);
            console.dir(response)
            if(response.data.success){
                set({loading:false,resturant:response.data.resturant})
            }
        }catch(error:any){
            if(error.response.status === 404){
                set({resturant:null})
            }
            set({loading:false})
        }
    },
    updateResturant: async(formData:FormData)=>{
        try{
            set({loading:true})
            const response = await axios.put(`${API_END_POINT}/update`,formData,{
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            })
            console.log("update request")
            if(response.data.success){
                toast.success(response.data.message)
                set({loading:false})
            }
        }catch(error:any){
            toast.error(error.response.data.message)
            set({loading:false})
        }
    },
    searchResturant: async(searchQuery:string)=>{
        try{
            set({loading:true})
            const params = new URLSearchParams();
            params.set("searchQuery",searchQuery);
            const response = await axios.get(`${API_END_POINT}/search/?${params.toString()}`)

            if(response.data.success){
                set({loading:false , searchedResturant:response.data.data})
            }
        }catch(error:any){
            set({loading:false})
            console.log(error.response.data.message)
        }
    },
    getStoreDetails: async (storeId: string) => {
        try {
            set({ loading: true });
            const response = await axios.get(`${API_END_POINT}/${storeId}`);


            if (response.data.success) {
            set({
                loading: false,
                detailedResturant: response.data.data,
            });
            }
        } catch (error: any) {
            set({ loading: false });
            console.log(error.response?.data?.message);
        }
    }
}),
{
    name:"resturant-store",
    storage:createJSONStorage(()=>localStorage)
}
))

