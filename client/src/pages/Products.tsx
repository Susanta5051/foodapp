import { useContext, useEffect, useState, type ChangeEvent } from "react";
// import Footer from "../components/Footer";
// import Navbar from "../components/Navbar";
import ProductBox from "../components/ProductBox";
import SearchBox from "../components/SearchBox";
import { BrowserContext } from "../context/UserContext";
// import data from "../assets/media/ProductsDetails";
import { Filter } from "lucide-react";
import { Link,  useSearchParams } from "react-router-dom";
import useMenuStore from "../store/useMenuStore";
import { Input } from "../components/ui/input";

type ContainerType = {
  _id:string;
  image: string;
  name: string;
  desc: string;
  price: number;
  category: Array<string>;
  address: string;
  store: string;
  quantity:string
};

const Products = () => {
  const [filter, setFilter] = useState<Set<string>>(new Set());
  const [searchValue, setSearchValue] = useState<string>("");
  const [location , setLocation] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [productData, setProductData] = useState<Array<ContainerType>>([]);
  const [filteredData, setFilteredData] = useState<Array<ContainerType>>([]);
  const {searchAllMenu , searchedMenu} = useMenuStore();
  // const navigate = useNavigate();
  const context = useContext(BrowserContext);
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  if (context === undefined) return;
  const { modeDay } = context;
  const categories = [
    "Tatar",
    "Malaysian",
    "Chinese",
    "Yamal",
    "Native American",
    "Egyptian",
    "Indian",
    "Berber",
    "German"
  ];

  const handleSubmit = async () => {
    setSearchValue(searchValue.trim());
    await searchAllMenu(searchValue.trim() ,location.trim());
      
  };

  const handleFilterAdd = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    setFilter(() => {
      const newFilter: Set<string> = new Set(filter);
      if (filter.has(val)) {
        newFilter.delete(val);
      } else {
        newFilter.add(val);
      }
      return newFilter;
    });
  };

  


  useEffect(() => {
    if(searchedMenu){
        const data = searchedMenu.map((menu)=>{
          return {
            _id:menu._id,
            image:menu.image,
            name:menu.name,
            desc:menu.desc,
            price:menu.price,
            category:menu.categories,
            address:menu.resturant?.address,
            store:menu.resturant?.resturantName,
            quantity:JSON.stringify(menu.quantity)
          }
        })

        
        setProductData(data);
      }else{
        setProductData([]);
      }
  }, [searchedMenu]);



 useEffect(() => {
  let filtered = [...productData];

  if (filter.size > 0) {
    filtered = filtered.filter((item) => {
      return Array.from(filter).some((f) =>
        item.category.includes(f)
      );
    });
  }

  setFilteredData(filtered);
}, [filter, productData]);

  useEffect(() => {
    handleSubmit();
  }, [searchValue,location]);


  useEffect(() => {
    handleSubmit();
    // console.log(q);
  }, []);


  return (
    <div
      onClick={() => {
        if (show) setShow(false);
      }}
      className={`min-h-screen ${modeDay ? "" : "bg-gray-600 text-white"}`}
    >

      <div className=" flex flex-row  ">
        <div
          className={`${
            show
              ? "absolute bg-orange-950 text-white m-10 p-5 top-30 z-10 border-4 border-black rounded-3xl"
              : "hidden"
          } sm:basis-1/5  sm:block sm:mt-10`}
        >
          
          <div>
                Location:
                <Input placeholder="Enter Location" value={location} onChange={(e)=>setLocation(e.target.value.trim())}></Input>
            </div>

            <p className="mx-10 mt-10">Filters:</p>
          <div className="flex flex-col justify-center mx-5 mt-5">
            {categories.map((c, index) => (
              <div
                key={index}
                className="flex hover:scale-110 hover:bg-amber-600"
              >
                <input
                  id={c}
                  type="checkbox"
                  value={c}
                  checked={filter.has(c)}
                  onChange={handleFilterAdd}
                  className="h-3 w-3 border m-2 flex hover:cursor-pointer"
                />
                <label
                  htmlFor={c}
                  className="w-full flex hover:cursor-pointer "
                >
                  {c.toUpperCase()}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-scroll flex flex-col items-center max-h-200 basis-4/5 overscroll-auto">
          <div>
            <div className="relative sm:hidden top-14 ">
              <button type="button" onClick={() => setShow(!show)}>
                <Filter />
              </button>
            </div>
            <div>
              <SearchBox
                submitAction={handleSubmit}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
            {filteredData.map((p, index) => (
              <div key={index}>
                <ProductBox
                  image={p.image}
                  name={p.name}
                  desc={p.desc}
                  price={p.price}
                  address={p.address}
                  store={p.store}
                  quantity={JSON.stringify(p.quantity)}
                  _id={p._id}
                />
              </div>
            ))}
            {productData.length === 0 && (
              <div>
                <p className="font-bold text-2xl">No Result Found</p>
                <p>
                  No products matches with {q},<br></br>try with different words
                </p>
                <Link to="/">Go To Home</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Products;
