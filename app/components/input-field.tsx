type InputFieldProps = {
    type: string;
    id: string;
    [key: string]: any; // Allow additional props
}

export default function InputField({ type, id, ...props }: InputFieldProps) {
    return (
        <>
            <label htmlFor={id} className="block mb-2 font-medium text-sm text-gray-700 capitalize">{id}</label>
            <input
                required
                id={id}
                type={type}
                autoComplete="off"
                autoFocus={true}
                className="w-full h-12 bg-white p-4 shadow-lg border border-violet-300 focus:border-violet-600 focus:ring-0 outline-none rounded-xl duration-100 ease-in-out"
                {...props} // Spread the additional props here
            />
        </>
    )
}
