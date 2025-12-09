import React, { useState } from 'react'

type InputFieldProps = {
    type: string;
    name: string;
    formData: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({ type, name, formData, handleChange }: InputFieldProps) {
    return (
        <>
            <input
                required
                type={type}
                name={name}
                value={formData}
                autoComplete="off"
                autoFocus={true}
                className="w-full h-12 bg-white p-4 shadow-lg border border-violet-300 focus:border-violet-600 focus:ring-0 outline-none rounded-xl duration-100 ease-in-out"
                placeholder={`Enter your ${name}`}
                onChange={handleChange}
            />
        </>
    )
}
