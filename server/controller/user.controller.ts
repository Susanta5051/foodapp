import type {Request ,Response } from 'express'
import {User} from '../models/user.model.ts'
import bcrypt from 'bcryptjs'
import cloudinary from 'cloudinary'
import { generateVerificationCode } from '../utils/generateVerificationCode.ts'
import { generateToken } from '../utils/generateToken.ts'
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/email.ts'
import uploadImageOnCloudinary from '../utils/imageUpload.ts'
import { after } from 'node:test'


export const findUserById = async (req:Request , res:Response)=>{
    try{
        const userId = req.id;
        const user = await User.findById(userId).select("-password").populate("cart.menu");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not found"
            })
        }
        return res.status(200).json({
            success:true,
            user
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Intenal Server Error"})
    }
}
export const register= async (req :Request, res :Response)=>{
    try{
        console.log("req reached")
        console.dir(req.body)
        const {fullName , email,password , phone , address} = req.body;
        const imageFile = req.file;

         if (!fullName || !email || !password || !phone || !address) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success:false,
                message:"User Already Exists with this email"
            })
        }
        
        if(!imageFile){
            return res.status(400).json({
                success:false,
                message:"Profile Picture is required"
            })
        }
        let imageUrl = await uploadImageOnCloudinary(imageFile)
        const hashedPassword = await bcrypt.hash(password,10);
        const verificationToken = generateVerificationCode();

        user = await User.create({
            fullName,
            email,
            profilePicture:imageUrl,
            password:hashedPassword,
            phone:Number(phone),
            address,
            verificationToken,
            verificationTokenExpireAt:Date.now()+24*60*60*1000,
            cart:[],
            isVerified:true
        })
        //  generateToken(res,user);
        // await sendVerificationEmail(email, verificationToken)

        const userf = await User.findOne({email}).select("-password");
        if(userf)
        generateToken(res,userf)
        return res.status(201).json({
            success:true,
            message:"Account created successfully",
            user:userf
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}


export const login = async (req:Request , res : Response)=>{
    try{
        
        const {email , password} = req.body;
        console.log(email , password);

        let user = await User.findOne({email});
        console.log(user);
        if(!user){
            return res.status(400).json ({
                success : false,
                message : "Incorrect Username or Password"
            })
        }
        const isPasswordMatch = await bcrypt.compare( password , user.password );
        
        if(!isPasswordMatch){
            return res.status(400).json({
                success : false,
                message : "Incorrect Username or Password"
            })
        }
        generateToken(res,user)
        user.lastLogin = new Date();
        await user.save();

        let userf = await User.findOne({email}).select("-password").populate("cart.menu");
        if (!userf){
            throw new Error()
            return
        }
        return res.status(200).json({
            success:true,
            message:`Welcome back ${userf.fullName}`,
            user:userf
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Intenal Server Error"})
    }
}

export const verifyEmail  = async (req : Request ,res : Response)=>{
    try{
        const {verificationCode,email} = req.body;
        console.log(email , verificationCode)
        const user = await User.findOne({email,verificationToken:verificationCode , 
            verificationTokenExpireAt : { $gt : Date.now()}}).select("-password")
            console.log(user)
         if(!user){
            return res.status(400).json ({
                success : false,
                message : "Incorrect Username or Password"
            })
        }
        
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpireAt = undefined;
        user.save();

         await sendWelcomeEmail(user.email , user.fullName)

        const userf = await User.findOne({email}).select("-password");

        return res.status(200).json({
            success:true,
            message:`Welcome back ${user.fullName}`,
            userf
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Intenal Server Error"})
    }
}


export const logout = async (req:Request , res:Response) =>{
    try{
        return res.clearCookie("token").status(200).json({
            success:true,
            message:"Loggedout Successfully" 
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({success:false , message: "Intenal Server Error"})
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        const resetToken = crypto.getRandomValues.toString();
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpireAt = resetTokenExpiresAt;
        await user.save();

        // send email
        await sendPasswordResetEmail(user.email);

        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }
        //update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpireAt = undefined;
        await user.save();

        // send success reset email
        await sendResetSuccessEmail(user.email);

        return res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const checkAuth = async (req :Request , res :Response)=>{
    try{
        const userId = req.id;
        const user = await User.findById(userId).select("-password").populate("cart.menu");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not found"
            })
        }
        return res.status(200).json({
            success:true,
            user
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Intenal Server Error"})
    }
}


export const updateProfile = async(req:Request , res:Response)=>{
    try{
        const userId = req.id;
        const {fullName ,email, address , city, country, profilePicture } = req.body;
        let user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        let cloudResponse=user.profilePicture;
        cloudResponse = await uploadImageOnCloudinary(profilePicture)

        const updatedData = {fullName , email ,  address , city , country , profilePicture:cloudResponse};

        user = await User.findByIdAndUpdate(userId , updatedData , { new :true}).select("-password");
        return res.status(200).json({
            success:true,
            user,
            message:"Profile updated successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Intenal Server Error"})
    }
} 


export const increaseCartItem = async(req:Request , res:Response)=>{
    try{
        const userId = req.id;
        const {itemId} = req.body;
        let user = await User.findByIdAndUpdate(userId , {
            $inc : {"cart.$[elem].quantity" : 1}
        },{returnDocument:'after' , arrayFilters:[{"elem.menu":itemId}]})
        .populate("cart.menu").select("-password");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        return res.status(200).json({
            success:true,
            user,
            message:"Cart updated successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Intenal Server Error"})
    }
}

export const decreaseCartItem = async(req:Request , res:Response)=>{
    try{
        const userId = req.id;
        const {itemId} = req.body;
        let user = await User.findByIdAndUpdate(userId , {
            $inc : {"cart.$[elem].quantity" : -1}
        },{ returnDocument:'after', arrayFilters:[{"elem.menu":itemId , "elem.quantity":{$gt:1}}]})
        .populate("cart.menu").select("-password");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        return res.status(200).json({
            success:true,
            user,
            message:"Cart updated successfully"
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Intenal Server Error"})
    }
}

export const removeCartItem = async(req:Request , res:Response)=>{
    try{
        const userId = req.id;
        const {itemId} = req.body;
        let user = await User.findByIdAndUpdate(userId , {
            $pull : {"cart" : {menu:itemId}}
        },{returnDocument:'after'}).populate("cart.menu").select("-password");
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        return res.status(200).json({
            success:true,
            user,
            message:"Cart updated successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Intenal Server Error"})
    }
}