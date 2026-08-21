import {faker ,fakerEN_GB , fakerEN_IN} from '@faker-js/faker'
import {User} from './models/user.model.ts'
import connectDB from './db/connectDB.ts';
import { Resturant } from './models/resturant.model.ts';
import { Menu } from './models/menu.model.ts';

const  seedData =async (count = 50)=> {
  try {
    await connectDB()
    console.log('Connected to MongoDB.');


    const mockUsers = Array.from({ length: count }, () => ({

        fullName:faker.person.fullName(),
        email:faker.internet.email(),
        password:faker.internet.password({ length: 20, memorable: true, pattern: /[A-Za-z0-9]/ }),
        phone:fakerEN_IN.phone.number({ style: 'mobile' }) ,
        address:fakerEN_IN.location.postalAddress(),
        admin:true,
        cart:[],    
        profilePicture:faker.image.personPortrait(),
        lastLogin:faker.date.recent(),
        createdAt:faker.date.recent(),
        updatedAt:faker.date.recent(),
        isVerified: true
    }));

    await User.insertMany(mockUsers);
    console.log(`Successfully inserted ${count} random users into MongoDB!`);
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    // 4. Always close the connection when done
    console.log('Database connection closed.');
  }
}

// Run the seeder (e.g., generate 50 documents)
// seedData(10);


//find all ids
    // await connectDB();
    // const ids = await User.find({admin:true}).select("_id");
    // console.log(ids);
  //   { _id: new ObjectId('69e99b8bf7be8903dcdecf5c') },
  // { _id: new ObjectId('6a873a6f3002ce5491b37b02') },
  // { _id: new ObjectId('6a873a6f3002ce5491b37b03') },
  // { _id: new ObjectId('6a873a6f3002ce5491b37b04') },
  // { _id: new ObjectId('6a873a6f3002ce5491b37b05') },
  // { _id: new ObjectId('6a873a6f3002ce5491b37b06') },
  // { _id: new ObjectId('6a873a6f3002ce5491b37b07') },
  // { _id: new ObjectId('6a873a6f3002ce5491b37b08') },
  // { _id: new ObjectId('6a873a6f3002ce5491b37b09') },
  // { _id: new ObjectId('6a873a6f3002ce5491b37b0a') },
  // { _id: new ObjectId('6a873a6f3002ce5491b37b0b') }


  const insertResturants = async(count : number)=>{
    try{
      await connectDB();

      const mockResturant = Array.from( {length : count} , ()=>({
        user:faker.helpers.arrayElement(['69e99b8bf7be8903dcdecf5c',
          '6a873a6f3002ce5491b37b02', '6a873a6f3002ce5491b37b03',
          '6a873a6f3002ce5491b37b04', '6a873a6f3002ce5491b37b05',
          '6a873a6f3002ce5491b37b06', '6a873a6f3002ce5491b37b07',
          '69e99b8bf7be8903dcdecf5c','6a873a6f3002ce5491b37b09',
        '6a873a6f3002ce5491b37b0a', '6a873a6f3002ce5491b37b0b']),
            resturantName:fakerEN_IN.company.name(),
            address:fakerEN_IN.location.postalAddress(),
            pincode:faker.location.zipCode('######'),          
            imageUrl:faker.helpers.arrayElement(["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4","https://images.unsplash.com/photo-1515003197210-e0cd71810b5f","https://images.unsplash.com/photo-1555396273-367ea4eb4db5","https://images.unsplash.com/photo-1579684947550-22e945225d9a","https://images.unsplash.com/photo-1552566626-52f8b828add9","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4","https://images.unsplash.com/photo-1514933651103-005eec06c04b","https://images.unsplash.com/photo-1544148103-0773bf10d330","https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb","https://images.unsplash.com/photo-1445116572660-236099ec97a0","https://images.unsplash.com/photo-1495474472287-4d71bcdd2085","https://images.unsplash.com/photo-1509042239860-f550ce710b93","https://images.unsplash.com/photo-1568901346375-23c9450c58cd","https://images.unsplash.com/photo-1571091718767-18b5b1457add","https://images.unsplash.com/photo-1561758033-d89a9ad46330","https://images.unsplash.com/photo-1586190848861-99aa4a171e90","https://images.unsplash.com/photo-1585937421612-70a008356fbe","https://images.unsplash.com/photo-1601050690597-df0568f70950","https://images.unsplash.com/photo-1546833999-b9f581a1996d","https://images.unsplash.com/photo-1565557623262-b51c2513a641"]),
            category: faker.helpers.arrayElement(["Indian","Chinese",  "Italian",  "Mexican","Fast Food","South Indian","North Indian","Bengali","Punjabi","Mughlai","Continental","Thai","Japanese","Korean","Bakery","Cafe","Desserts","Street Food","Pizza","Burger","Biryani","Seafood","Vegetarian","Non-Vegetarian",]),
            phone:fakerEN_IN.phone.number({ style: 'mobile' })
      }))

      const res = await Resturant.insertMany(mockResturant);
      console.log("data inserted")
    }catch(error){
      console.log(error)
    }
  }

  


  const  seedMenu =async (count = 50)=> {
  try {
    await connectDB()
    console.log('Connected to MongoDB.');


    const mockmenu = Array.from({ length: count }, () => ({

       name:faker.food.dish(),
            desc:faker.food.description(),
            price:faker.commerce.price({ min: 100, max: 200 }) ,
            image:faker.helpers.arrayElement([ "https://images.unsplash.com/photo-1585937421612-70a008356fbe", "https://images.unsplash.com/photo-1601050690597-df0568f70950", "https://images.unsplash.com/photo-1565557623262-b51c2513a641", "https://images.unsplash.com/photo-1546833999-b9f581a1996d", "https://images.unsplash.com/photo-1563245372-f21724e3856d", "https://images.unsplash.com/photo-1525755662778-989d0524087e", "https://images.unsplash.com/photo-1512058564366-18510be2db19", "https://images.unsplash.com/photo-1574071318508-1cdbab80d002", "https://images.unsplash.com/photo-1551183053-bf91a1d81141", "https://images.unsplash.com/photo-1473093295043-cdd812d0e601", "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85", "https://images.unsplash.com/photo-1565299585323-38d6b0865b47", "https://images.unsplash.com/photo-1565299507177-b0ac66763828", "https://images.unsplash.com/photo-1579871494447-9811cf80d66c", "https://images.unsplash.com/photo-1569718212165-3a8278d5f624", "https://images.unsplash.com/photo-1553621042-f6e147245754", "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd", "https://images.unsplash.com/photo-1559314809-0d155014e29e", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", "https://images.unsplash.com/photo-1571091718767-18b5b1457add", "https://images.unsplash.com/photo-1561758033-d89a9ad46330", "https://images.unsplash.com/photo-1574071318508-1cdbab80d002", "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", "https://images.unsplash.com/photo-1551024506-0bccd828d307", "https://images.unsplash.com/photo-1565958011703-44f9829ba187", "https://images.unsplash.com/photo-1488477181946-6428a0291777", "https://images.unsplash.com/photo-1473093295043-cdd812d0e601", "https://images.unsplash.com/photo-1551183053-bf91a1d81141", "https://images.unsplash.com/photo-1544943910-4c1dc44aab44", "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f" ])  ,
          quantity:faker.number.int({min:1, max:20})      ,     
          categories:faker.food.ethnicCategory(),           
          resturantId:faker.helpers.arrayElement(['69e99bcaf7be8903dcdecf66','6a8744f823289c44e6d78edf','6a8744f823289c44e6d78ee0','6a8744f823289c44e6d78ee1','6a8744f823289c44e6d78ee2','6a8744f823289c44e6d78ee3','6a8744f823289c44e6d78ee4','6a8744f823289c44e6d78ee5','6a8744f823289c44e6d78ee6','6a8744f823289c44e6d78ee7','6a8744f823289c44e6d78ee8','6a8744f823289c44e6d78ee9','6a8744f823289c44e6d78eea','6a8744f823289c44e6d78eeb','6a8744f823289c44e6d78eec','6a8744f823289c44e6d78eed','6a8744f823289c44e6d78eee','6a8744f823289c44e6d78eef','6a8744f823289c44e6d78ef0','6a8744f823289c44e6d78ef1','6a8744f823289c44e6d78ef2'])
        }));

    await Menu.insertMany(mockmenu);
    console.log(`Successfully inserted ${count} random menu into MongoDB!`);
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    // 4. Always close the conn ection when done
    console.log('Database connection closed.');
  }
}


  

// await connectDB();
//     const ids = await Resturant.find().select("_id");
//     console.log(ids);

//     ['69e99bcaf7be8903dcdecf66','6a8744f823289c44e6d78edf','6a8744f823289c44e6d78ee0','6a8744f823289c44e6d78ee1','6a8744f823289c44e6d78ee2','6a8744f823289c44e6d78ee3','6a8744f823289c44e6d78ee4','6a8744f823289c44e6d78ee5','6a8744f823289c44e6d78ee6','6a8744f823289c44e6d78ee7','6a8744f823289c44e6d78ee8','6a8744f823289c44e6d78ee9','6a8744f823289c44e6d78eea','6a8744f823289c44e6d78eeb','6a8744f823289c44e6d78eec','6a8744f823289c44e6d78eed','6a8744f823289c44e6d78eee','6a8744f823289c44e6d78eef','6a8744f823289c44e6d78ef0','6a8744f823289c44e6d78ef1','6a8744f823289c44e6d78ef2'
// ]


// seedMenu()
// insertResturants(20)
const cat = async ()=>{
try{
  await connectDB();
  const fake = Array.from({length : 10}, ()=>({ categories:faker.food.ethnicCategory()

  }))

  console.log(fake)
}catch(error){
  console.log(error)
}}

// cat()