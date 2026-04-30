import { useContext, useEffect, useState } from "react";

import StoreCard from "../components/StoreCard";
import { BrowserContext } from "../context/UserContext";
import SearchBox from "../components/SearchBox";
import { Input } from "../components/ui/input";
import { useResturantStore } from "../store/useResturantstore";
// import type mongoose from "mongoose";

type MenuType = {
  _id: string;
  name: string;
  desc: string;
  image: string;
  price: number;
  quantity: number;
  categories: Array<string>;
};
type ResturantType = {
  _id: string;
  user: string;
  resturantName: string;
  address: string;
  pincode: number;
  category: string;
  imageUrl: string;
  menus: MenuType[];
  phone: string;
};
const Store = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [stores, setStores] = useState<Array<ResturantType>>([]);
  const [location, setLocation] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const context = useContext(BrowserContext);
  const handleSubmit = () => {};
  if (context === undefined) return;
  const { modeDay } = context;
  // const details = [
  //   {
  //     name: "name",
  //     location: "location",
  //     image: "",
  //     storeId: "2",
  //     category: "veg",
  //   },
  // ];
  const categories = [
    "all",
    "veg",
    "tandoor",
    "dhaba",
    "chinese",
    "fastfood",
    "tiffin",
  ];
  const { searchResturant, searchedResturant } = useResturantStore();
  useEffect(() => {
    const search = async () => {
      await searchResturant(searchValue);
    };
    search();

    let newStores = searchedResturant;
    if (!newStores) {
      return;
    }
    if (searchValue.length > 0) {
      newStores = newStores.filter((s) =>
        s.resturantName.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (location !== "") {
      newStores = newStores.filter((s) =>
        s.address.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (category !== "all") {
      newStores = newStores.filter((s) =>
        s.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    setStores(newStores);
  }, [searchValue, category, location]);

  useEffect(() => {
    async () => {
      await searchResturant("");
    };
    if (searchedResturant) {
      setStores(searchedResturant);
    } else {
      setStores([]);
    }
  }, []);
  return (
    <div
      className={`${
        modeDay ? "bg-white text-black" : "bg-gray-500 text-white"
      }`}
    >
      <div className="flex ">
        <div className="sm:basis-1/3 md:basis-1/5 p-5 ">
          <div>
            Location:
            <Input
              placeholder="Enter Location"
              value={location}
              onChange={(e) => setLocation(e.target.value.trim())}
            ></Input>
          </div>
          <div>
            Category:
            <ul>
              {categories.map((c, index) => (
                <li key={index}>
                  <input
                    type="radio"
                    name="category"
                    onChange={(e) => setCategory(e.target.value.trim())}
                    id={`${c}`}
                    value={`${c}`}
                  ></input>
                  <label htmlFor={`${c}`}>{c.toUpperCase()}</label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div>
            <div>
              <SearchBox
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                submitAction={handleSubmit}
              />
            </div>
          </div>
          <div>
            {stores.map((s, index) => (
              <StoreCard
                key={index}
                name={s.resturantName}
                location={s.address}
                image={s.imageUrl}
                storeId={s._id as string}
                category={s.category}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
