import { eq, ilike } from "drizzle-orm";
import { db } from "~~/server/db";
import { userTable } from "~~/server/db/schema";
import jwt from "jsonwebtoken";
export default defineEventHandler(async (event) => {
  try {
    const { sendMail } = useNodeMailer();
    const config = useRuntimeConfig();

    const { email } = getQuery(event) as {email: string};
    if (!email) {
      return createError({
        statusCode: 422,
        statusMessage: "Invalid email address",
      });
    }

    const [user] = await db
      .select()
      .from(userTable)
      .where(ilike(userTable.email, email));

    if (!user) {
      return createError({
        statusCode: 401,
        statusMessage: "user not found",
      });
    }

    const token = jwt.sign(
      { userId: user.id, previlage: user.previlage },
      config.jwtSecret
    );

    await sendMail({
      to: user.email,
      subject: "Password Reset Link",
      html: `
      <p>Follow the below link to reset your password</p>
      <p><a href="https://inventory-app-07.vercel.app/auth/reset/${token}">https://inventory-app-07.vercel.app/auth/reset/${token}</a></p>
      <p>Best Regards</p>
      <p>Bizly Enterprice</p>
      `,
    });

    return { statusCode: 200 };
  } catch (error: any) {
    console.log(error.message);
    return createError({
      statusCode: 500,
      statusMessage: "unexpected error occured, try agin later.",
    });
  }
});
