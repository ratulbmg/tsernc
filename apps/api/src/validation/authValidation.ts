import z from "zod"

export const registerUserSchema = z.object({
    uniqueId: z
        .string({message : "Please enter Unique Id"})
        .trim(),
    name: z
        .string({message : "Please enter Name"})
        .trim()
        .min(3, {message: "Name must be at least 3 characters long."})
        .max(100, {message: "Name must be no more than 100 characters."}),
    email: z
        .string({ message: "Please enter Email" })
        .trim()
        .email({message: "Please enter a valid email address"})
        .max(320, { message: "Email must be no more than 320 characters."}),
    password: z
        .string({ message: "Please enter Password" })
        .min(3, { message: "Password must be at least 3 characters long." })
        .max(255, { message: "Password must be no more than 255 characters." })
})

export const loginUserSchema = z.object({
    email: z
        .string({ message: "Please enter Email" })
        .trim()
        .email({ message: "Please enter a valid email address" })
        .max(320, { message: "Email must be no more than 320 characters." }),
    password: z
        .string({ message: "Please enter Password" })
        .min(3, { message: "Password must be at least 3 characters long." })
        .max(255, { message: "Password must be no more than 255 characters." })
})