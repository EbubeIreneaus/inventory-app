import { db } from "~~/server/db";
import { userTable } from "~~/server/db/schema";
import bcrypt from "bcryptjs";
import z from "zod";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

const schema = z
  .object({
    password: z
      .string()
      .min(8, { error: "password must be at least 8 character or more" }),
    confirm: z.string(),
    token: z.string({ error: "Invalid token" }),
  })
  .refine((data) => data.confirm === data.password, {
    error: "Password Mismatch",
    path: ["confirm"],
  });

export default defineEventHandler(async (event) => {
  try {
    const { data, error } = await readValidatedBody(event, schema.safeParse);
    const config = useRuntimeConfig();

    if (error) {
      return createError({
        statusMessage: error.issues[0].message,
        statusCode: 422,
      });
    }

    const user = jwt.verify(data.token, config.jwtSecret) as {
      userId: number;
      role: string;
    };
    if (!user || user.role == "none") {
      return createError({
        statusMessage: "user not found",
        statusCode: 404,
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);

    await db
      .update(userTable)
      .set({ password: hash })
      .where(eq(userTable.id, user.userId));
    return { statusCode: 200 };
  } catch (error: any) {
    return createError({
      statusMessage:
        error.message || error.statusMessage || "unknown server error",
      statusCode: 500,
    });
  }
});
