import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Login = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className='flex items-center justify-between w-screen h-screen'>
            <div className='w-1/2 flex justify-center'>
                <img src='/sideimage.jpg' alt='School Picture' className='h-full w-[80%]' />
            </div>

            <div className='w-1/2 flex items-center justify-center flex-col'>
                <img src='/logo.jpeg' alt='Logo' className='h-10 w-24' />
                <span className='font-semibold text-purple-800'>Satyam Xaviers</span>
                <span className='text-3xl text-purple-800 mt-3'>Welcome!</span>
                <span className='text-sm text-purple-800'>Please Enter Your Details</span>
                <div className='w-full flex flex-col items-center justify-center gap-4 pt-4'> 
                    <Input 
                        placeholder="Enter Email" 
                        type='email' 
                        className='bg-purple-100 w-4/6' 
                        prefix={<UserOutlined className='text-purple-800' />} 
                    />

                    <Input
                        placeholder="Enter Password"
                        className='bg-purple-100 w-4/6'
                        prefix={<RiLockPasswordLine className='text-purple-800' />}
                        type={isVisible ? 'text' : 'password'} // Toggle input type
                        suffix={
                            <Button 
                                type="text" 
                                onClick={toggleVisibility} 
                                className="flex items-center"
                                icon={isVisible ? <FaRegEyeSlash className='text-purple-800' /> : <FaRegEye className='text-purple-800' />}
                            />
                        }
                    />
                </div>
                <Button type='danger' className='bg-purple-600 text-white mt-6 px-7 py-4 hover:font-semibold'>Log In</Button>
            </div>
        </div>
    );
};

export default Login;
