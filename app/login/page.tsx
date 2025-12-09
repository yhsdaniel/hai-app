'use client'

import Link from "next/link";
import GoogleButton from "../components/GoogleButton";
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { getSession, signIn } from "next-auth/react";
import InputField from "../components/InputField";

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const handleChangeLogin = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const email = formData.email
        const password = formData.password
        await signIn("credentials", {
            email,
            password,
            redirect: false
        }).then(async (res) => {
            if (res?.ok) {
                toast.success('Login successful')
                const updateSession = await getSession()
                if (updateSession?.user?.name) {
                    router.push('/chat')
                }
            } else {
                toast.error("Couldn't get user info")
            }
        }).catch((err) => {
            console.log(err)
            toast.error('Invalid Email or Password')
            router.push('/login')
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
                        <h1 className="text-4xl font-bold text-violet-700">Haiapp</h1>
                    </div>

                    <form onSubmit={(e) => handleLogin(e)} autoComplete="off" className="mt-10 text-black">
                        <div className='mb-4'>
                            <InputField 
                                type="email"
                                name="email"
                                formData={formData.email}
                                handleChange={handleChangeLogin}
                            />
                        </div>
                        <div className='mb-6'>
                            <InputField 
                                type="password"
                                name="password"
                                formData={formData.password}
                                handleChange={handleChangeLogin}
                            />
                        </div>
                        <button type='submit' className='w-full cursor-pointer rounded-lg px-4 h-12 btn btn-primary duration-150 ease-in-out text-white font-bold'>Login</button>
                    </form>
                    <span className="text-black text-sm mt-10 text-right">Don&apos;t have an account? <Link href={'/register'} className='text-blue-600 hover:text-blue-700 cursor-pointer'>Register</Link></span>
                    <GoogleButton />
                    <div className='mt-10'>
                        <p className='text-xs text-center text-black/50'>This site is protected by reCAPTCHA and the <span className='italic'>Google Privacy Policy</span> and <span className='italic'>Terms of Service</span> apply.</p>
                    </div>
                </main>
            </div>
        </div>
    )
}
