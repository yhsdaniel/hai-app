'use server'

import { registerSchema } from '@/lib/zod'

export default async function ActionRegisterUser(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')
  const phoneNumber = formData.get('phoneNumber')

  const inputData = {
    email,
    password,
    phoneNumber
  }

  const validationResult = registerSchema.safeParse(inputData)

  if(!validationResult.success){
    const error = validationResult.error.flatten().fieldErrors;
    console.log(error)
    throw new Error('Validation failed')
  }

  const validationData = validationResult.data
  console.log('Validated data: ', validationData)

  return { success: true, message: 'Login Successful' }
}
