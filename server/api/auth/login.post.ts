import bcrypt from "bcryptjs";
import { db } from "~~/server/db";
import jwt from "jsonwebtoken";
import { userTable } from "~~/server/db/schema";
import z, { email } from "zod";
import { eq } from "drizzle-orm";

const schema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z.string(),
  rememberme: z.boolean(),
});

export default defineEventHandler(async (event) => {
  try {
    const { data, error } = await readValidatedBody(event, schema.safeParse);
    const config = useRuntimeConfig();

    if (error) {
      return createError({
        statusCode: 422,
        statusMessage: error.issues[0].message,
      });
    }

    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, data.email),
    });

    if (!user) {
      return createError({ statusCode: 404, statusMessage: "user not found" });
    }
    const verify = await bcrypt.compare(data.password, user.password);
    if (!verify) {
      return createError({
        statusCode: 404,
        statusMessage: "user not found or incorrect password",
      });
    }
    const sessionId = crypto.randomUUID()
    await db.update(userTable).set({sessionId}).where(eq(userTable.id, user.id))
    const token = jwt.sign({ ...user, password: null, sessionId }, config.jwtSecret, {
      expiresIn: data.rememberme ? "30d" : "24h",
    });
    setCookie(event, "Authorization", token, { sameSite: true, secure: true });
    return { statusCode: 200, user };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || "unexpected error occured",
    });
  }
});
