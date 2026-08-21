import  { useContext, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { BrowserContext } from "../context/UserContext";
import { Minus, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
type ContainerType = {
    _id: string;
    image: string;
    name: string;
    desc: string;
    price: number;
    category: Array<string>;
    address: string;
    store: string;
  quantity: number;
};

const Cart = () => {
  const context = useContext(BrowserContext);
  const [cart, setCart] = useState<Array<ContainerType>>([]);
  if (context === undefined) return;
  const { user,findUserById , removeCartItem ,decreaseCartItem , increaseCartItem } = useUserStore();
  console.dir(cart)

  const total = cart.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  const {  modeDay } = context;


  const handleClearAll = ()=>{
    cart.forEach((c)=>{
      handleRemove(c._id);
    })
  }
  const handleRemove = ( id: string) => {
    if(!user){
      return;
    }
    removeCartItem( id);
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
  };
  const handlePlus = (id: string) => {
    if(!user){
      return;
    }
    increaseCartItem(id);
    const updatedCart = cart.map((p) => {
      if (id ==p._id) p.quantity += 1;

      return p;
    });
    setCart(updatedCart);
  };
  const handleMinus = (id: string) => {
    if(!user){
      return;
    }
    decreaseCartItem( id);
    const updatedCart = cart.map((p) => {
      if (p._id === id && p.quantity > 1) p.quantity -= 1;
      
      return p;
    });
    setCart(updatedCart);
  };

  useEffect(() => {
    console.log("user changed");
    console.log(user)
    if (user) {
      const cartItems = user.cart.map((item) => ({ quantity:item.quantity,
        _id: item.menu._id,
        name: item.menu.name,
        desc: item.menu.desc,
        price: item.menu.price,
        category: item.menu.category,
        address: item.menu.address || "",
        store: item.menu.store || "",
        image: item.menu.image
      }));
      setCart(cartItems);
    } else {      setCart([]);
    }
  }, [user]);
  useEffect(() => {
    if(user){
      findUserById(user._id);
    }
  }, [])

  return (
    <div
      className={`${
        modeDay ? "text-black bg-amber-200" : "text-white bg-gray-600"
      }`}
    >
      {cart.length !== 0 ? (
        <div className=" p-2 sm:p-10">
          <div className="flex justify-end">
            <Button onClick={() => handleClearAll()}> ClearAll</Button>
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-9 lg:grid-cols-12 border-black border-4  ">
            <div className="col-span-1 text-[15px] md:text-lg text-center">
              SL.no
            </div>
            <div className="col-span-2 text-[15px] md:text-lg sm:col-span-3 lg:col-span-6 text-center">
              Title
            </div>
            <div className="col-span-2 text-[15px] md:text-lg text-center">
              Quantity
            </div>
            <div className="col-span-1 text-[15px] md:text-lg text-center">
              Rate
            </div>
            <div className="col-span-1 text-[15px] md:text-lg text-center">
              Total
            </div>
            <div className="col-span-1 text-[15px] md:text-lg text-center">
              Remove
            </div>
          </div>

          {cart.map((c, index) => (
            <div
              key={index}
              className="grid grid-cols-8 sm:grid-cols-9 lg:grid-cols-12 border-black border-2  "
            >
              <div className="col-span-1 text-[15px] md:text-lg text-center">
                {index + 1}
              </div>
              <div className="col-span-2 text-[15px] md:text-lg sm:col-span-3 lg:col-span-6 text-center">
                <Link to="/">{c.name}</Link>
              </div>
              <div className="col-span-2 text-[15px] md:text-lg text-center border-amber-500 rounded-full flex justify-center ">
                <div
                  className={`${
                    modeDay ? "bg-gray-500" : "bg-black"
                  } w-5 h-5 md:w-8 md:h-8 rounded-full md:p-1 sm:mx-2 flex justify-center items-center `}
                >
                  <button onClick={() => handleMinus(c._id)}>
                    <Minus />
                  </button>
                </div>
                {c.quantity}
                <div
                  className={`${
                    modeDay ? "bg-gray-500" : "bg-black"
                  } w-5 h-5 md:w-8 md:h-8 rounded-full md:p-1 sm:mx-2 flex justify-center items-center`}
                >
                  <button onClick={() => handlePlus(c._id)}>
                    <Plus />
                  </button>
                </div>
              </div>
              <div className="col-span-1 text-[15px] md:text-lg text-center">
                {c.price}
              </div>
              <div className="col-span-1 text-[15px] md:text-lg text-center">
                {c.quantity * c.price}
              </div>
              <div className="col-span-1 flex text-[15px] md:text-lg justify-center">
                <Button onClick={() => handleRemove(c._id)}>
                  <X />
                </Button>
              </div>
            </div>
          ))}
          <div className="relative">
            <div className="absolute right-1.5 flex gap-2">
              <p>Total</p>
              <p>{total}</p>
              <button type="button" className="bg-black text-white p-1">Place Order</button>
            </div>
          </div>
        </div>
      ) : (
        <div>NO Items in cart</div>
      )}
    </div>
  );
};

export default Cart;
