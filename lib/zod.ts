import * as z from 'zod'

export const registerSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters long')
        .max(20, 'Username must be at most 20 characters long')
        .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
        .trim(),
    email: z.string()
        .min(1, 'Email is required')
        .email({ message: 'Invalid email address' })
        .trim(),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
    confirm_password: z.string()
        .min(8, 'Confirm Password not the same'),
    phoneNumber: z.string()
        .min(10, 'Phone number must be at least 10 digits long')
        .max(15, 'Phone number must be at most 15 digits long')
        .regex(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"]
})

export const loginSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email({ message: 'Invalid email address' })
        .trim(),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' })
})

export type registerFormInputs = z.infer<typeof registerSchema>   
export type loginFormInputs = z.infer<typeof loginSchema>