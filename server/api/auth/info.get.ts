import { eq } from "drizzle-orm"
import Jwt from "jsonwebtoken"
import { db } from "~~/server/db"
import { userTable } from "~~/server/db/schema"

export default defineEventHandler(async (event) => {
   const cookie = getCookie(event, 'Authorization')
   const config = useRuntimeConfig()
   if (!cookie) {
    return createError({statusCode: 401})
   }
   try {
    const auth = Jwt.verify(cookie, config.jwtSecret) as any
    const [user] = await db.select().from(userTable).where(eq(userTable.sessionId, auth.sessionId))
    if (!user) {
      return createError({statusCode: 401})
    }
    return {statusCode: 200, user: {...user, password: null}}
   } catch (error) {
     return createError({statusCode: 500})
   }
})
