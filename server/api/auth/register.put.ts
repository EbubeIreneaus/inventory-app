import jwt from "jsonwebtoken";
import { db } from "~~/server/db";
import { userTable } from "~~/server/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { eq, ilike } from "drizzle-orm";
import bcrypt from "bcryptjs";

const schema = createInsertSchema(userTable);
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { data, error } = await readValidatedBody(event, schema.safeParse);
  const {sendMail} = useNodeMailer()

  if (error) {
    return createError({
      statusCode: 422,
      statusMessage: error.issues[0].message,
    });
  }

  try {
    const [existingUser] = await db
      .select({ email: userTable.email })
      .from(userTable)
      .where(ilike(userTable.email, data.email));

    if (existingUser) {
      return createError({
        statusCode: 401,
        statusMessage: "Email already exist.",
      });
    }

    // create user
    const [user] = await db
      .insert(userTable)
      .values({ ...data})
      .returning();


    // const token = jwt.sign({ ...user, password: null }, config.jwtSecret);
    // setCookie(event, "Authentication", token, { sameSite: true, secure: true });
    // send welcoming email
    await sendMail({
      subject: 'Welcome Onboard',
      to: user.email,
      html: `
        <p>Welcome ${user.firstname} ${user.lastname}</p>
        <P>Follow this link to create your dashboard password</P>
        <p><a href="http://localhost:3001/auth/reset?email=${user.email}">http://localhost:3001/auth/reset?email=${user.email}</a></p>
        <br />
        <p>Regards<br /> Bizly Enterprice</p>
      `
    })
    return { statusCode: 201 };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || "Unknow error occured",
    });
  }
});
