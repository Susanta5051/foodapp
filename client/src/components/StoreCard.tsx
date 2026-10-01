
import { Link } from 'react-router-dom'
import resturant from "../assets/media/resturant.webp"

import { Button } from './ui/button'
import {  useContext } from 'react';
import { BrowserContext } from '../context/UserContext';
const StoreCard = (store : {name:string;location:string;image:string;storeId:string,category:string}) => {
    const context = useContext(BrowserContext)
    if(context === undefined)return
    const {modeDay} =context
  return (
    <div className="relative p-2 max-w-70 ">
        <div className='relative'><div className='absolute left-2 rounded-lg bg-orange-500 px-1 text-center top-2 '>{store.category}</div></div>
      <div className={`flex flex-col p-5  max-w-70  rounded-3xl border-4 border-orange-950 ${modeDay? "bg-amber-100 text-black":"bg-black text-white"}`}>
        <div className=''>
            {store.image ?<img src={store.image}></img>:<img src={resturant}></img>}
        </div>
        <div>
            <p>{store.name}</p>
            <p>{store.location}</p>
            <Link to={`/resturant/${store.storeId}`}><Button className='bg-orange-950'>See Detils</Button></Link>
        </div>
      </div>
    </div>
  )
}

export default StoreCard
