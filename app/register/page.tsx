'use client'

import axios from "axios";
import GoogleButton from "../components/google-button";
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast";
import Link from "next/link";
import InputField from "../components/input-field";
import LayoutForm from "../components/layout-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormInputs, registerSchema } from "@/lib/zod";

export default function RegisterPage() {
    const form = useForm<registerFormInputs>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirm_password: '',
            phoneNumber: ''
        },
        mode: 'onChange'
    })
    const { isSubmitting, errors, touchedFields } = form.formState
    const router = useRouter()
    const handleSubmitRegister = async (values: registerFormInputs) => {
        await axios.post('/api/user/register', values)
            .then((response) => {
                if (response.status === 200) {
                    toast.success('Registered successfully')
                    form.reset()
                    router.push('/login')
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
            <form onSubmit={form.handleSubmit(handleSubmitRegister)} autoComplete="off" className="mt-10 text-black">
                <div className='mb-4'>
                    <InputField
                        type="text"
                        id="username"
                        {...form.register('username')}
                    />
                    {errors.username && touchedFields.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                    )}
                </div>
                <div className='mb-4'>
                    <InputField
                        type="email"
                        id="email"
                        {...form.register('email')}
                    />
                    {errors.email && touchedFields.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>
                <div className='mb-6'>
                    <InputField
                        type="password"
                        id="password"
                        {...form.register('password')}
                    />
                    {errors.password && touchedFields.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>
                <div className='mb-6'>
                    <InputField
                        type="password"
                        id="confirm_password"
                        {...form.register('confirm_password')}
                    />
                    {errors.confirm_password && touchedFields.confirm_password && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>
                    )}
                </div>
                <div className='mb-4'>
                    <InputField
                        type="text"
                        id="phoneNumber"
                        {...form.register('phoneNumber')}
                    />
                    {errors.phoneNumber && touchedFields.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                    )}
                </div>
                <button
                    disabled={isSubmitting}
                    type='submit'
                    className='w-full cursor-pointer rounded-lg px-4 h-12 btn btn-primary duration-150 ease-in-out text-white font-bold'
                >
                    {isSubmitting ? 'Proccessing...' : 'Submit'}
                </button>
            </form>
            <span className="text-black text-sm mt-10 text-right">Already have an account? <Link href={'/login'} className='text-blue-600 hover:text-blue-700 cursor-pointer'>Login</Link></span>
            <GoogleButton />
            <div className='mt-10'>
                <p className='text-xs text-center text-black'>This site is protected by reCAPTCHA and the <span className='italic'>Google Privacy Policy</span> and <span className='italic'>Terms of Service</span> apply.</p>
            </div>
        </LayoutForm>
    )
}
