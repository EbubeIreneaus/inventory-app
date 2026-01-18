import { chromium, request, type FullConfig } from "@playwright/test";
import dotenv from 'dotenv'

dotenv.config()

async function globalSetup(config: FullConfig) {
  const { storageState, baseURL } = config.projects[0].use;
  // if (process.env.NODE_ENV == "test") {
  const requestContext = await request.newContext({
    baseURL,
  });

  const res = await requestContext.put("/api/auth/register-test-user", {
    data: {
      firstname: "Tester",
      lastname: "Ireneaus",
      email: "tester@gmail.com",
      password: process.env.LOGIN,
      address: "address",
      role: "admin",
      phone: "08012312311",
      state: "Enugu",
      city: "Enugu",
      dob: "2002-10-12",
      isActive: true,
      isEmailVerified: true,
      previlage: "admin",
    },
  });
  await requestContext.dispose();

  // }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${baseURL}/login`);
  await page.waitForURL('**/login', {timeout: 30_000})
  await page.getByRole("textbox", { name: "Email*" }).fill("tester@gmail.com");
  await page
    .getByRole("textbox", { name: "Password*" })
    .fill(process.env.LOGIN || "");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/", { timeout: 30_000 });
  await page.context().storageState({ path: storageState as string });
}

export default globalSetup;
