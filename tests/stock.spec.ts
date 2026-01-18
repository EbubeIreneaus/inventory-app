import { test, expect } from "@playwright/test";

test.describe("Stock Lifecycle, Create and Delete Stock", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Stock" }).click();
  });

  test("workflow with valid data", async ({ page }) => {
    const productName = `E2E-Product-${Date.now()}`;

    // CREATE
    await page.getByRole("link", { name: "Record New" }).first().click();
    await expect(
      page.getByRole("heading", { name: "Record Product" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "Product Name*" }).click();
    await page
      .getByRole("textbox", { name: "Product Name*" })
      .fill(productName);
    await page.getByRole("spinbutton", { name: "Quantities*" }).click();
    await page.getByRole("spinbutton", { name: "Quantities*" }).fill("10");
    await page.getByRole("textbox", { name: "Unit Price*" }).click();
    await page.getByRole("textbox", { name: "Unit Price*" }).fill("618000");
    await page.getByRole("textbox", { name: "Selling Price*" }).click();
    await page.getByRole("textbox", { name: "Selling Price*" }).fill("900000");
    await page.getByRole("textbox", { name: "Description" }).click();
    await page
      .getByRole("textbox", { name: "Description" })
      .fill("no description");
    await page.getByRole("button", { name: "save", exact: true }).click();
    await page.waitForURL("**/", { timeout: 10_000 });

    // ASSERT CREATE
    await page.goto("/stock/");
    await expect(
      page.locator("tbody tr", { hasText: productName }),
    ).toHaveCount(1);

    // DELETE
    const firstRow = page.locator("tbody tr", {hasText: productName});
    await firstRow.locator("td").last().getByRole("button").click();
    await page.getByRole("menuitem", { name: "View product" }).click({force: true});
    await page.waitForURL("**/stock/*");
    await expect(
      page.getByRole("heading", { name: "Product Details", level: 2 }),
    ).toBeVisible();
    await page.getByRole("button", { name: "delete product" }).click();
    await page.waitForURL("**/stock/");
    
    // ASSERT DELETED
    await expect(
      page.locator("tbody tr", { hasText: productName }),
    ).toHaveCount(0);

  });


  test('workflow with invalid data', async ({page}) => {
     const productName = '';

    // CREATE
    await page.getByRole("link", { name: "Record New" }).first().click();
    await expect(
      page.getByRole("heading", { name: "Record Product" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "Product Name*" }).click();
    await page
      .getByRole("textbox", { name: "Product Name*" })
      .fill(productName);

    await page.getByRole("spinbutton", { name: "Quantities*" }).click();
    await page.getByRole("spinbutton", { name: "Quantities*" }).fill("-10");
    await page.getByRole("textbox", { name: "Unit Price*" }).click();
    await page.getByRole("textbox", { name: "Unit Price*" }).fill("-3000");
    await page.getByRole("textbox", { name: "Selling Price*" }).click();
    await page.getByRole("textbox", { name: "Selling Price*" }).fill("900000");
    await page.getByRole("textbox", { name: "Description" }).click();
    await page
      .getByRole("textbox", { name: "Description" })
      .fill("no description");
    await page.getByRole("button", { name: "save", exact: true }).click();


    // ASSERT ERROR
    await expect(
      page.getByTestId('stock_creation_error_display'),
    ).toBeVisible({timeout: 20_000});

  })
});
