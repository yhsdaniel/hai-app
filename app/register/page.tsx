'use client'

import axios from "axios";
import GoogleButton from "../components/GoogleButton";
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast";
import { ChangeEvent, useState } from "react";
import Link from "next/link";
import InputField from "../components/InputField";

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
    })

    const handleChangeRegister = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmitRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await axios.post('/api/user/register', formData)
            .then((response) => {
                if (response.status === 200) {
                    toast.success('Registered successfully')
                    router.push('/login')
                }
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    phoneNumber: ''
                })
            })
    }
    return (
        <div className="size-full flex-center">
            <div className="relative w-7/12 h-full hidden lg:block flex-center bg-login rounded-r-[80px]">
                <section className="m-8 text-black/60 text-4xl font-bold text-center">
                    <h1 className="my-4">WELCOME TO HAIAPP</h1>
                    <p className="text-lg">Better way to connect with friends by HaiApp. <br></br> You will get a new experience.</p>
                </section>
            </div>
            <div className="flex-1 lg:mx-[5%] h-full flex-center">
                <main className="p-8 rounded-2xl">
                    <div className='text-center'>
                        <h1 className="text-4xl font-bold text-violet-700">HaiApp</h1>
                    </div>

                    <form onSubmit={(e) => handleSubmitRegister(e)} autoComplete="off" className="mt-10 text-black">
                        <div className='mb-4'>
                            <InputField 
                                type="text"
                                name="username"
                                formData={formData.username}
                                handleChange={handleChangeRegister}
                            />
                        </div>
                        <div className='mb-4'>
                            <InputField 
                                type="email"
                                name="email"
                                formData={formData.email}
                                handleChange={handleChangeRegister}
                            />
                        </div>
                        <div className='mb-6'>
                            <InputField 
                                type="password"
                                name="password"
                                formData={formData.password}
                                handleChange={handleChangeRegister}
                            />
                        </div>
                        <div className='mb-4'>
                            <InputField 
                                type="text"
                                name='phoneNumber'
                                formData={formData.phoneNumber}
                                handleChange={handleChangeRegister}
                            />
                        </div>
                        <button type='submit' className='w-full cursor-pointer rounded-lg px-4 h-12 btn btn-primary duration-150 ease-in-out text-white font-bold'>Submit</button>
                    </form>
                    <span className="text-black text-sm mt-10 text-right">Already have an account? <Link href={'/login'} className='text-blue-600 hover:text-blue-700 cursor-pointer'>Login</Link></span>
                    <GoogleButton />
                    <div className='mt-10'>
                        <p className='text-xs text-center text-black'>This site is protected by reCAPTCHA and the <span className='italic'>Google Privacy Policy</span> and <span className='italic'>Terms of Service</span> apply.</p>
                    </div>
                </main>
            </div>
        </div>
    )
}
