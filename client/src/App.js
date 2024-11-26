import './App.css';
import axios from 'axios';
import Login from './Login';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import ConfirmEmail from './ConfirmEmail';
import { createContext, useEffect, useState } from 'react';
import About from './About';
import Add from './Add';
import AdminAddProduct from './AdminAddProduct';
import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Procedure from './Procedure';
import { Test } from './Test';
import Cancel from './Cancel';
import Success from './Success';
import { QueryClient, useMutation, useQuery, useQueryClient } from 'react-query';

axios.defaults.withCredentials = true;
export const PropRegister = createContext()
function App() {

  

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp:''
});
const [password, setPassword] = useState(false); 
const [passwordError, setPasswordError] = useState(""); 
const [submit,setSubmit] = useState(false)
const [loginFormData, setLoginFormData] = useState({
  email: '',
  password: '',
});
const [storeOtp,setStoreOtp] = useState("");
/* const [details,setDetails] = useState([]) */
const [priceLimit,setPriceLimit] = useState(false);
const [storeProduct, setStoreProduct] = useState({
  productImage: null,
  productName: "",
  productAmount: 0,
  productPrice: 0,
  productAdd: false,
  productCusAdd:false
});
const [AddedDetails, setAddedDetails] = useState([])
const [registeration,setRegisteration] = useState("Signup or Register")
const [status,setStatus] = useState("false");

const [clientDetails, setClientDetails] = useState({
  clientName: "",
  clientPhn: "",
  clientPin: "",
  clientCity: "",
  clientState:"",
  clientArea: "",
  clientBuiding: "",
  clientLandmark: ""
});


const navigate = useNavigate();
/* useEffect(()=>{
  axios.get('http://localhost:3001/details')
  .then(result=>{
      const detailsArray = result.data.map(re => ({
        id: re._id,
        image: re.image,
        product: re.product,
        amount: re.amount,
        cusAmount: re.cusAmount,
        price: re.price,
        cusPrice: re.cusPrice,
        add: re.add,
        cusAdd: re.cusAdd,
        priceLimit: re.cusAmount < re.amount
      }));
      setDetails(detailsArray);
  }).catch((err)=>{console.log(err)})
  
},[]) */

const { data: details, isLoading : isDetailsLoading , isError :isDetailsError , error : detailsError , isFetching} = useQuery("Product-details", async () => {
  return await axios.get('http://localhost:3001/details');
});

useEffect(() => {
  axios.get('http://localhost:3001/checkStatus').then((result)=>{
    console.log(result.data)
    if (result.data.Registeration === true){
      setRegisteration('Logout')
      console.log("checked");
    }
    if (result.data.Status === true){
      setStatus("true")
    }
    console.log("executed")
  })
}, [])

useEffect(()=>{
  setTimeout(() => {
    setRegisteration("Signup or Register");
    setStatus("false")
  }, 604800000); 
},[registeration,status])


useEffect(() => {
  axios.get('http://localhost:3001/AddedDetails').then(response=>{
    //console.log(response.data)
    if (response.data.nextState){
    setAddedDetails(response.data.content);
    }
  }).catch((err)=>{console.log(err)})
}, [])

const handleChanges = (total)=>{
  console.log(total,total === 0)
  if (total === 0){
    toast(("You didn't add any items!!"),{
      pauseOnHover: true,
      draggable: true,
    })
    alert("You didn't add any items!!")
    return 
  }
  console.log(AddedDetails)

  axios.put('http://localhost:3001/customer',{AddedDetails}).then(result=>{
    if(result.data.nextState){
      console.log(result.data.nextState)
      navigate("/procedure")
    }
  }).catch((err)=>{console.log(err)})
}
const handleAddedDetails = ()=>{
  axios.get('http://localhost:3001/AddedDetails').then(response=>{
    if (response.data.nextState){
    setAddedDetails(response.data.content);
    navigate("/add")
    }
    else{
      alert("SignUp to see add cart");
    }
  }).catch((err)=>{console.log(err)})
}

const queryClient = useQueryClient();

const {mutate } = useMutation((adminData)=>{
  axios.post('http://localhost:3001/newProduct', adminData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }})
  .then(result => {
    console.log(result.data.message);
    toast(("Item was added"),{
      pauseOnHover: true,
      draggable: true,
    })
  }).catch(err => console.log(err));
},{
  onSuccess: ()=>{
    queryClient.invalidateQueries("Product-details");
    console.log("Success");
  }
})

const handleProduct = (e) => {
  e.preventDefault();

  const adminData = new FormData();
  adminData.append('productImage', storeProduct.productImage); 
  adminData.append('productName', storeProduct.productName);
  adminData.append('productAmount', storeProduct.productAmount);
  adminData.append('productPrice', storeProduct.productPrice);
  adminData.append('productAdd', storeProduct.productAdd); 
  mutate(adminData)
/*   axios.post('http://localhost:3001/newProduct',   adminData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }})
  .then(result => {
    console.log(result.data.message);
    toast(("Item added Refresh to see the result"),{
      pauseOnHover: true,
      draggable: true,
    })
  }).catch(err => console.log(err)); */
};



const handleProductChange = (e) => {
  const { name, value } = e.target;
  if (name === "productImage") {
    setStoreProduct(prevState => ({ 
      ...prevState,
      productImage: e.target.files[0]
    }));
  
  } else {
    setStoreProduct(prevState => (
      {
      ...prevState,
      [name]: value
    }));
    
  }
  console.log(storeProduct)
};


const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
    if (name === 'password') {
        if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/.test(value)) {
            setPassword(false);
            setPasswordError("Password must contain at least 6 characters, 1 uppercase letter, and 1 symbol.");
        } else {
            setPassword(true); 
            setPasswordError("");
        }
    }
};
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    axios.post('http://localhost:3001/signupDB', formData)
      .then(result => {
        console.log(result.data.message);
        if(!result.data.nextPage){
          toast(("You are already login.."),{
            pauseOnHover: true,
            draggable: true,
          });
        }
        if (result.data.nextPage) {
          navigate('/confirmEmail', { otpHandleChange, otpHandleSubmit, storeOtp,formData,setStoreOtp });
        }
      })
      .catch(err => console.log(err));
  };
const LoginHandleChange = (e) => {
  const { name, value } = e.target;
  setLoginFormData(prevState => ({
      ...prevState,
      [name]: value
  }));
};
const LoginHandleSubmit = (e) => {
  e.preventDefault();
  axios.post('http://localhost:3001/loginDB',  loginFormData).then(result => {
    if (result.data.message === "true"){
      setStatus(true);
      /*{setClientDetails(
        result.data.user.clientDetails.forEach((name,index,arr)=>{
          arr[index] = name
        })
      )}*/
    }
    if (result.data.message === "false"){
      setStatus(false);
      console.log(result.data.user.clientDetails[0])
      //setClientDetails(result.data.user.clientDetails[0]); 
      //console.log(clientDetails);
    }
    if(result.data.nextPage){
      setRegisteration("Logout")
    navigate('/');
  }

  }).catch(err => console.log(err));
};

const otpHandleChange = (e)=>{
  const { name, value } = e.target;
  setFormData(prevState => ({
      ...prevState,
      [name]: value
  }));
}
const otpHandleSubmit = (e)=>{
  e.preventDefault()
  console.log(storeOtp,formData);
  axios.post(('http://localhost:3001/signupDB/otpDB'),{storeOtp,formData,clientDetails}).then(result=>{
    console.log("Success");
    if (result.data.nextPage){
      setRegisteration("Logout")
      navigate('/');
    }
  })
  console.log(storeOtp)
  
}

const handleAdd = (e)=>{
  axios.put('http://localhost:3001/addElements',{id:e})
  .then(result=>{
    if (result.data.toggling===true){
      toast(("Add to cart!!💕"),{
        pauseOnHover: true,
        draggable: true,
      });}
    else{
      toast((result.data.message),{
        pauseOnHover: true,
        draggable: true,
      });
    }
  })
  .catch(console.log("Error"))
  
}



const handlePrice = (e, detail) => {
  const newCusAmount = e.target.value;
  setAddedDetails(prevDetails => {

    const detailIndex = prevDetails.findIndex(d => d._id === detail._id);
    if (detailIndex === -1) return prevDetails;
    const found = prevDetails[detailIndex];
    const curPrice = Math.ceil(((newCusAmount % found.amount) / found.amount) * found.price + (newCusAmount / found.amount) * found.price);
    let pl = false;
    console.log(curPrice,found.amount,curPrice<found.amount,newCusAmount)
    if (newCusAmount<found.amount){
      pl = true;
    }else{
      pl = false;
    }
    const updatedDetails = [...prevDetails]; 
    updatedDetails[detailIndex] = {
      ...updatedDetails[detailIndex],
      cusAmount: newCusAmount,
      cusPrice: curPrice,
      priceLimit:pl,
    };
    return updatedDetails;
  });

  /*axios.put('http://localhost:3001/customer',{
    newCusAmount: newCusAmount,
    detail: detail
  }).then(result=>{
    console.log("..");
  })
  if (refresh === "R"){
    setRefresh("Re")
  }else{
    setRefresh("R")
  }
  if (newCusAmount >= detail.amount) {
    detail.priceLimit = false
  } else {
    detail.priceLimit = true
  }
  console.log(details); */
}

const {mutate: removeMutate} = useMutation((id)=>{
  axios.delete('http://localhost:3001/removeItem', {
    data: { id: id },
  })
  .then((result) => {
    toast((result.data.message),{
      pauseOnHover: true,
      draggable: true,
    })
  })
  .catch((err) => {
    console.log(err);
  });
},{
  onSuccess:()=>{
    queryClient.invalidateQueries("Product-details");
  }
})
const handleDelete = (id) => {
  /* axios.delete('http://localhost:3001/removeItem', {
      data: { id: id },
    })
    .then((result) => {
      toast((result.data.message),{
        pauseOnHover: true,
        draggable: true,
      })
    })
    .catch((err) => {
      console.log(err);
    }); */
    removeMutate(id)
};

const handleLogout = ()=>{
  axios.delete('http://localhost:3001/logout').then((result)=>{
    console.log(result.data)
    setRegisteration("Signup or Register");
    setStatus("false")
  })
}

const handleStripe = ()=>{

  console.log(AddedDetails)
  axios.post('http://localhost:3001/stripe',{AddedDetails,clientDetails}).then((result)=>{
    console.log(result.data);
    window.location = result.data.url;
  })
}
      
const clientDetailsChange = (e)=>{
  const {name,value} = e.target;
  setClientDetails(pre=>({
    ...pre,
    [name]:value
  }))
  console.log(clientDetails)
}

if(isDetailsLoading){
  <p>Loading</p>
}

if(isDetailsError){
  <p>{detailsError}</p>
}

if(isFetching){
  console.log("fetching");
}


  return (
    <div className="App">
      <div className='bg-gradient-to-r w-full h-full from-sky-900 from-5% to-black min-h-screen bg-cover '>
      <PropRegister.Provider value={{ registeration, status }}>
        <Routes>
        <Route path='/' element = {<Home details={details} handleAdd={handleAdd} handleAddedDetails={handleAddedDetails}  registeration={registeration} handleLogout={handleLogout} status={status}/>}/>
        <Route path='/signup' element = {<Signup formData={formData} setFormData={setFormData} handleChange={handleChange} handleSubmit={handleSubmit} password={password} passwordError={passwordError} submit={submit} setSubmit={setSubmit}/>}/>
        <Route path='/login' element = {<Login loginFormData={loginFormData} LoginHandleChange={LoginHandleChange} LoginHandleSubmit={LoginHandleSubmit}/>}/>
        <Route path='/confirmEmail' element = {<ConfirmEmail otpHandleChange={otpHandleChange} otpHandleSubmit={otpHandleSubmit} storeOtp={storeOtp} formData={formData} setStoreOtp={setStoreOtp}/>}/>
        <Route path="/about" element={<About />}/>
        <Route path="/add" element={<Add AddedDetails={AddedDetails} handlePrice={handlePrice} priceLimit={priceLimit} setPriceLimit={setPriceLimit} handleChanges={handleChanges}/>}/>
        <Route path='/addproduct' element={<AdminAddProduct storeProduct={storeProduct} handleProductChange={handleProductChange} handleProduct={handleProduct} details={details} handleDelete={handleDelete}/>} />
        <Route path='/procedure' element={<Procedure AddedDetails={AddedDetails} handleStripe={handleStripe}clientDetails={clientDetails} setClientDetails={setClientDetails} clientDetailsChange={clientDetailsChange}/>}/>
        <Route path='/cancel' element={<Cancel />}></Route>
        <Route path='/success' element={<Success clientDetails={clientDetails}/>}></Route>
        {/* <Route path='/test' element={<Test />}/> */}
        
        </Routes></PropRegister.Provider>
        </div>
      </div>
  );
}

export default App;