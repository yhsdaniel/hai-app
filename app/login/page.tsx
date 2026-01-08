'use client'

import Link from "next/link";
import GoogleButton from "../components/google-button";
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast";
import { getSession, signIn } from "next-auth/react";
import InputField from "../components/input-field";
import LayoutForm from "../components/layout-form";
import { useForm } from "react-hook-form";
import { loginFormInputs, loginSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginPage() {
    const form = useForm<loginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onSubmit'
    })
    const { isSubmitting, errors, touchedFields } = form.formState
    const router = useRouter()
    const handleLogin = async (values: loginFormInputs) => {
        const email = values.email
        const password = values.password
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
            // Show the actual error message from your server if available
            const message = err.response?.data?.message || "Something went wrong";
            toast.error(message);
            console.error(err);
        })
    }
    return (
        <LayoutForm>
            <form onSubmit={form.handleSubmit(handleLogin)} autoComplete="off" className="mt-10 text-black">
                <div className='mb-4'>
                    <InputField
                        type="email"
                        id="email"
                        {...form.register('email')}
                    />
                    {errors.email && touchedFields.email && (
                        <p className="text-red-500">{errors.email.message}</p>
                    )}
                </div>
                <div className='mb-6'>
                    <InputField
                        type="password"
                        id="password"
                        {...form.register('password')}
                    />
                    {errors.password && touchedFields.password && (
                        <p className="text-red-500">{errors.password.message}</p>
                    )}
                </div>
                <button 
                    disabled={isSubmitting}
                    type='submit' 
                    className='w-full cursor-pointer rounded-lg px-4 h-12 btn btn-primary duration-150 ease-in-out text-white font-bold'
                >
                    {isSubmitting ? 'Proccessing...' : 'Login'}
                </button>
            </form>
            <span className="text-black text-sm mt-10 text-right">Don&apos;t have an account? <Link href={'/register'} className='text-blue-600 hover:text-blue-700 cursor-pointer'>Register</Link></span>
            <GoogleButton />
            <div className='mt-10'>
                <p className='text-xs text-center text-black/50'>This site is protected by reCAPTCHA and the <span className='italic'>Google Privacy Policy</span> and <span className='italic'>Terms of Service</span> apply.</p>
            </div>
        </LayoutForm>
    )
}
