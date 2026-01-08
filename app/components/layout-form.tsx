import React from 'react'

export default function LayoutForm({ children }: { children: React.ReactNode }) {
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
                    {children}
                </main>
            </div>
        </div>
    )
}
