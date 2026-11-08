import z from "zod";

export const registerUserSchema = z.object({
    name: z.string().min(3).max(30),
    username: z.string().min(3).max(30).toLowerCase().regex(/^[a-z0-9_]+$/),
    email: z.email().toLowerCase(),
    password: z.string().min(8).max(128)
});

export const updateUserSchema = registerUserSchema
                                    .pick({ name:true, username:true })
                                    .partial()
                                    .refine( (data) => Object.keys(data).length > 0 , { message: "Error: At least one field is required."})

export const changeUserPasswordSchema = z.object({
    currentPassword: z.string().min(8).max(128),
    newPassword: z.string().min(8).max(128)
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChageUserPasswordInput = z.infer<typeof changeUserPasswordSchema>;