import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const path = event.path;

  if (path.startsWith("/api/") && !path.startsWith("/api/auth")) {
    try {
      const token = getCookie(event, "Authorization");
      if (!token) {
        throw createError({
          statusCode: 401,
          statusMessage: "Unauthorize Entry",
        });
      }
      const user = jwt.verify(token, config.jwtSecret) as {previlage:  string};
      if (!user || user.previlage == 'none') {
        throw createError({
          statusCode: 401,
          statusMessage: "Unauthorize Entry",
        });
      }
      event.context.auth = user;
    } catch (error: any) { 
      return createError({
        statusCode: 500,
        statusMessage:
          error.message || error.statusMessage || "unknown server error",
      });
    }
  }
});
