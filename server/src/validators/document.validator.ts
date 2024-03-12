import zod, { string } from 'zod'

const documentSchema = zod.object({
    title: zod.string().min(3, { message: "must be atleast of 3 charachters" }).max(25, { message: "must be atmost 25 characters" }).optional(),
    content: zod.string()
})

export const documentValidator = ({ title, content }: { title: string, content: string }) => {
    const response = documentSchema.safeParse({ title, content })
    return response
}