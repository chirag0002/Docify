import zod from 'zod'

const userSignUpSchema = zod.object({
    name: zod.string().min(3, { message: "must provide a valid password of atleast 8 charachters" }),
    email: zod.string().email({ message: "must provide a valid email address" }),
    password: zod.string().min(8, { message: "must provide a valid password of atleast 8 charachters" })
})

const userSignInSchema = zod.object({
    email: zod.string().email({ message: "must provide a valid email address" }),
    password: zod.string().min(8, { message: "must provide a valid password of atleast 8 charachters" })
})

export const userSignUpValidator = ({ name, email, password }: { name: string, email: string, password: string }) => {
    const resposne = userSignUpSchema.safeParse({ name, email, password })
    return resposne
}

export const userSignInValidator = ({ email, password }: { email: string, password: string }) => {
    const resposne = userSignInSchema.safeParse({ email, password })
    return resposne
}