 
 import type {Request , Response} from 'express'
 import {Order} from '../models/order.model.ts'
 import {Resturant} from '../models/resturant.model.ts'
 import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()
 const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

 type checkoutSessionRequest = {
    cartItems:{
        menuId:string,
        name:string,
        image:string,
        price:number,
        quantity:number
    }[],
    deliveryDetails:{
        name:string,
        email:string,
        city:string
    },
    resturantId:string
 }

 type menuItems = {
    menuId:string;
    name:string;
    image:string;
    price:number;
    quantity:number
 }



 export const getOrders = async (req:Request , res:Response)=>{
    try{
        const orders = await Order.find({user:req.id}).populate('user').populate('resturant')
        console.log(orders)
        return res.status(200).json({
            success:true,
            message:"Intenal server error"
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
    }
 }

 export const createCheckoutSession = async (req : Request , res:Response)=>{
    try{
        const checkoutSessionRequest = req.body;
        
        const resturant = await Resturant.findById(checkoutSessionRequest.resturantId).populate('menu')
        if(!resturant){
            return res.status(404).json({
                success:false,
                message:"Resturant no found"
            })
        }

        const order = new Order({
            resturant:resturant._id,
            user:req.id,
            deliveryDetails:checkoutSessionRequest.deliveryDetails,
            cartItems:checkoutSessionRequest.cartItems,
            status:'pending'
        })

        const menuItems  =  resturant.menus;
        const lineItems = createLineItems(checkoutSessionRequest , menuItems);

        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            shipping_address_collection:{
                allowed_countries:['GB','US']
            },
            line_items:lineItems,
            mode:'payment',
            success_url:`${process.env.FRONTEND_URL}/order/status`,
            cancel_url:`${process.env.FRONTEND_URL}/cart`,
            metadata:{
                orderId:JSON.stringify(order._id),
                images:JSON.stringify(menuItems.map((item:any)=> item.image))
            }
        })

        if(!session.url){
            return res.status(400).json({success:false, message:'Error while creating Session'})
        }

        await order.save();
        return res.status(200).json({session})

    }catch(error){
        console.log(error)
        return res.status(500).json({message : "Internal Server Error"})
    }
 }




 export const createLineItems = (checkOutSessionRequest : checkoutSessionRequest , menuItems : any)=>{
    const lineItems = checkOutSessionRequest.cartItems.map((cartItem)=>{
        const menuItem = menuItems.find((item:any)=> item._id === cartItem.menuId);
        if(!menuItem) throw new Error(`Menu item didnot found`);

        return {
            price_date:{
                currency:'inr',
                product_data:{
                    name:menuItem.name,
                    images:[menuItem.image]
                },
                unit_amount:menuItem.price *100,
            },
            quantity:cartItem.quantity,
        }
    })
    return lineItems;
 }