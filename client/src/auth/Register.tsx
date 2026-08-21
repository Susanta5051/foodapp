import { useState, type ChangeEvent, type FormEvent } from "react"
import { Input } from "../components/ui/input"
import { Loader, LockKeyhole, Mail,User , Phone,ArrowLeft, MapPin, UserCheckIcon} from "lucide-react"
import {Link, useNavigate} from 'react-router-dom'
import { userSignupSchema, type SignupInputState } from "../schema/UserSchema.tsx"
import { useUserStore } from "../store/useUserStore.ts"
import checkNumber from "../lib/checkNumber.ts"

export const Register =() => {
    // type Signupdata = {
    //     email:string,
    //     password:string,
    //     fullName:string,
    //     mobile:string
    // }
    const [formData , setFormData]  = useState <SignupInputState >({
        email:"",
        password:"",
        fullName:"",
        phone:'',
        address:''
    })
    const [errors,setErrors] = useState<Partial<SignupInputState>>({})
    const navigate  =  useNavigate()
    const {loading , register } = useUserStore();
    const [profilePicture , setProfilePicture] = useState<File | null>(null);
    const [profilePictureError , setProfilePictureError] = useState<string>("")
    const handleFormChange = (e : ChangeEvent<HTMLInputElement>)=>{
        if(e.target.name === "profilePicture"){
            const file = e.target.files ? e.target.files[0] : null;
            setProfilePicture(file);
            return;
        }
        if(e.target.name === "phone"){
            const phoneValue = e.target.value;
            if(checkNumber(phoneValue)){
                setFormData({...formData,phone:phoneValue})
                setErrors((prevErrors)=>({...prevErrors,phone:""}))
            }else{
                setErrors((prevErrors)=>({...prevErrors,phone:"Invalid phone number"}))
            }
            return
        }

        const {name , value} = e.target;
        setFormData({...formData,[name]:value});

    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        //form data validation
        const result = userSignupSchema.safeParse(formData);
        if(!profilePicture ){
            setProfilePictureError("Profile picture is required")
        }
        // console.log( formData , result)
        if(!result.success){
            result.error._zod.def.forEach((e: any) => {
                setErrors((errors) => ({
                    ...errors,
                    [e.path[0]]: e.message
                }));
            });
            console.log(errors)
            return
        }

        const formDataToSend = new FormData();
        formDataToSend.append("email",formData.email);
        formDataToSend.append("password",formData.password);
        formDataToSend.append("fullName",formData.fullName);
        formDataToSend.append("phone",formData.phone);
        formDataToSend.append("address",formData.address);
        if(profilePicture !==null){
            formDataToSend.append("profilePicture",profilePicture);
        }   else {
            setProfilePictureError("Profile picture is required")
            return;
        }
        try{
            let response = await register(formDataToSend);
            if(response)navigate('/')
        }
        catch(error){
            console.log(error)
        }
        
    }

    return (
        <div className="flex justify-center items-center h-screen ">
            <form 
                onSubmit={handleSubmit}
                className="border border-gray-500 rounded-lg p-6 w-80 "
            >
                <p><button type="button"   onClick={()=>navigate(-1)} ><ArrowLeft /></button></p>
                
                <div className="mb-4 text-center">
                    <p className="font-bold text-2xl">Welcome to Restaurant</p>
                </div>
                <div className="mb-4 relative">
                    <User className="absolute left-2 top-3 text-gray-500" size={18}/>
                    
                    <Input 
                        className="pl-8"
                        placeholder="Full Name" 
                        id="fullName"
                        name='fullName'
                        value={formData.fullName}
                        onChange={handleFormChange}
                    />
                    {errors && <span  className="text-red-700 text-sm flex ">{errors.fullName}</span>}
                </div>

                <div className="mb-4 relative">
                    <Phone  className="absolute left-2 top-3 text-gray-500" size={18}/>
                    <Input 
                        className="pl-8"
                        placeholder="Mobile no" 
                        name='phone'
                        value={formData.phone}
                        onChange={handleFormChange}
                    />
                    {errors && <span  className="text-red-700 text-sm flex">{errors.phone}</span>}
                </div>

                <div className="mb-4 relative">
                    <Mail className="absolute left-2 top-3 text-gray-500" size={18}/>
                    <Input 
                        className="pl-8"
                        placeholder="Email" 
                        id="email" 
                        name='email'
                        value={formData.email}
                        onChange={handleFormChange}
                    />
                    {errors && <span  className="text-red-700 text-sm flex">{errors.email}</span>}
                </div>
                <div className="mb-4 relative">
                    <MapPin className="absolute left-2 top-3 text-gray-500" size={18}/>
                    <Input 
                        className="pl-8"
                        type="address"
                        placeholder="address" 
                        id="address"
                        name='address'
                        value={formData.address}
                        onChange={handleFormChange}
                    />
                    {errors && <span className="text-red-700 text-sm flex" >{errors.address}</span>}
                </div>

                <div className="mb-4 relative">
                    <UserCheckIcon className="absolute left-2 top-3 text-gray-500" size={18}/>
                    <Input 
                        className="pl-8"
                        type="file"
                        placeholder="profilePicture" 
                        id="profilePicture"
                        name='profilePicture'
                        // value={formData.profilePicture}
                        onChange={handleFormChange}
                        accept="image/*"
                    />
                    {errors && <span className="text-red-700 text-sm flex" >{profilePictureError}</span>}
                </div>

                <div className="mb-4 relative">
                    <LockKeyhole className="absolute left-2 top-3 text-gray-500" size={18}/>
                    <Input 
                        className="pl-8"
                        type="password"
                        placeholder="Password" 
                        id="password"
                        name='password'
                        value={formData.password}
                        onChange={handleFormChange}
                    />
                    {errors && <span className="text-red-700 text-sm flex" >{errors.password}</span>}
                </div>


                <button 
                    type="submit"
                    className="w-full bg-black hover:bg-amber-700 text-white py-2 rounded-md  mt-2"
                >
                    { !loading ? <p>Register</p>:<div className="justify-center" ><Loader className="rotate inline"></Loader></div>}
                </button>
                <p className=" text-left">Already have an account?<Link to='/login' className="text-blue-400">Login</Link></p>

            </form>
        </div>
    )
}