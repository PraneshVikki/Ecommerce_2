import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { MdAddShoppingCart } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminAddProduct({storeProduct, handleProductChange,handleProduct,details,handleDelete}) {
    const [view, setView] = useState("4");
    const [wview, setWview] = useState("full");

    const handleMobileView = async() => {
        setView("2");
        setWview("3/5");
        console.log(view);
    };
    const handleTabView = () => {
        setView("3");
        setWview("4/5");
        console.log(view);
    };
    const handleLapView = () => {
        setView("4");
        setWview("full");
        console.log(view);
    };

    console.log(details)

    const navigate = useNavigate();
    useEffect(() => {
      axios.get('http://localhost:3001/checkStatus').then((result)=>{
        console.log(result.data.Status)
        result.data.Registeration === true && result.data.Status === true?navigate('/addproduct'):navigate('/')
        console.log("executed")
      })
    }, [])


    return (
        <div className='md:flex lg:flex xl:flex'>
            <div className='flex flex-0 sm:flex-0 md:flex-1 lg:flex-24 '>
                <form className='h-screen w-full flex justify-center items-center' onSubmit={handleProduct}>
                    <div className='bg-slate-600 w-4/5 sm:w-6/12 md:w-7/12 p-5 sm:p-10 rounded-lg'>
                    <div>
                        <img className='object-cover h-48 w-full border rounded-xl' accept="image/*" src={storeProduct.productImage ? URL.createObjectURL(storeProduct.productImage) : ''} alt='' />
                        <div className='flex mt-2'>
                        <label htmlFor="productImage" className='text-white text-sm sm:text-md md:text-lg border rounded'>Add photo</label>
                        </div>
                        <input className='hidden' name='productImage' id='productImage' type="file" onChange={handleProductChange} required />
                    </div>
                    <div>
                    <div className='flex flex-col'>
                        <p className='text-white text-sm sm:text-md md:text-lg'>Product Name :</p>
                        <input className='rounded' name='productName' type="text" maxLength={25} required onChange={handleProductChange} />
                        </div>
                        <div className='flex flex-col'>
                        <p className='text-white text-sm sm:text-md md:text-lg'>Minimum Order in Kg</p>
                        <input className='rounded' name='productAmount' type="number" onChange={handleProductChange} required />
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-white text-sm sm:text-md md:text-lg'>Price :</span>
                            <input className='rounded'  name='productPrice' type="number" onChange={handleProductChange} required/>
                        </div>
                    </div>
                    <br />
                    <div className='flex  flex-row-reverse'>
                        <button className='bg-sky-500 rounded p-2' type='submit'>Add to website</button>
                    </div>
                    </div>
                </form>
        </div>
        <div className='flex-1 '>
        <div className='p-1 h-screen '>
            
            <h1 className='text-white text-2xl flex flex-col'>View Result</h1>
            <div className='pl-9 flex justify-around'>
                <button className='text-white text-xl rounded-md p-1' onClick={handleLapView}>Laptop View</button>
                <button className='text-white text-xl rounded-md p-1' onClick={handleTabView}>Tab View</button>
                <button className='text-white text-xl rounded-md p-1' onClick={handleMobileView}>Mobile View</button>
            </div>

            <div className={`border rounded-xl bg-gradient-to-r from-sky-900 from-5% to-black h-4/5 overflow-hidden overflow-y-scroll w-full lg:w-${wview} scroll-smooth scrollbar-thin scrollbar-webkit`}>

                <div className='flex justify-center items-center h-16 top-0 w-full p-4'>
                    <div className="flex items-center justify-center cursor-pointer">
                        <button className="text-white mr-4 hover:border-b-2 border-indigo-500 cursor-pointer " to={'/'}>Home</button>
                        <button className="text-white mr-4 hover:border-b-2 border-indigo-500 cursor-pointer" to={'/about'}>About</button>
                        <button className="text-white mr-4 hover:border-b-2 border-indigo-500 cursor-pointer" to={'/signup'}>Signup or register</button>
                    </div>
                    <div className='mr-0 p-2 hover:border border-indigo-500 cursor-pointer'>
                        <button ><MdAddShoppingCart className='text-white' /></button>
                    </div>
                </div>

                <div className={`grid grid-cols-${view} gap-5 rounded-xl `}>
                    {details?.data.map((detail) => (
                        <div className='p-5 bg-slate-600 h-fit w-100 rounded-md shadow-md' key={detail._id}>
                            <img className='object-cover h-24 w-48 border rounded-xl ' src={`http://127.0.0.1:3001/`+detail.image} alt="" />
                            <p className=' mt-2 text-white text-sm'>{detail.product}</p>
                            <p className='text-white text-sm sm'>Minimum amount in kg {detail.amount}</p>
                            <div className='flex justify-between'>
                            <p className='text-white text-md sm'>&#8377; {detail.price}</p>
                            <button type='submit' onClick={(e)=>handleDelete(detail._id)} className='bg-red-500 rounded p-0.5 text-white text-sm'>Remove item</button>
                            </div>
                            <ToastContainer autoClose={2000} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
        </div>
    );
}

export default AdminAddProduct;
