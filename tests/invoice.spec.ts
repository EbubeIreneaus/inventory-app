import { test, expect } from "@playwright/test";

test.describe("Invoice Lifecyle: Create Stock & Invoice, Delete Stock & Invoice", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Stock" }).click();
  });

  const NairaFMT = (
    amount: number | string,
    notation: "compact" | "standard",
  ) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
      notation: notation,
    }).format(Number(amount));
  };

  test("create & delete stock + invoice", async ({ page, request }) => {
    // CREATE INVOICE
    const productName = `E2E-Product-${Date.now()}`;
    const invoice = {
      customer_name: "Ebube Ireneaus",
      stock_unit_price: "500",
      stock_selling_price: "1000",
      quantities: "5",
      invoice_total: "5000",
    };

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
    await page
      .getByRole("textbox", { name: "Unit Price*" })
      .fill(invoice.stock_unit_price);
    await page.getByRole("textbox", { name: "Selling Price*" }).click();
    await page
      .getByRole("textbox", { name: "Selling Price*" })
      .fill(invoice.stock_selling_price);
    await page.getByRole("textbox", { name: "Description" }).click();
    await page
      .getByRole("textbox", { name: "Description" })
      .fill("no description");
    await page.getByRole("button", { name: "save", exact: true }).click();
    await page.waitForURL("**/", { timeout: 10_000 });

    // ASSERT CREATE STOCK
    await page.goto("/stock/");
    await expect(
      page.locator("tbody tr", { hasText: productName }),
    ).toHaveCount(1);

    // CREATE INVOICE
    await page.goto("/");
    await page.getByRole("button", { name: "Invoice" }).click();
    await page.getByRole("link", { name: "Create" }).first().click();
    await page
      .getByRole("textbox", { name: "Customer Name" })
      .fill("Ebube Ireneaus");

    await page.getByTestId("invoice_product_stock_select").selectOption(productName);
    
    await page
      .getByRole("textbox", { name: "Quantity*" })
      .fill(invoice.quantities);
    await page
      .getByRole("textbox", { name: "Selling Unit Price*" })
      .fill(invoice.stock_selling_price);
    await page
      .getByRole("textbox", { name: "Total price*" })
      .fill(invoice.invoice_total);
    await page.getByRole("button", { name: "Add To Invoice" }).click();
    await page
      .getByRole("button", { name: "save & print", exact: true })
      .click();
    await page.waitForURL("**/invoice/*");

    // ASSERT INVOICE GENERATED
    await expect(
      page.getByRole("heading", {
        name: "Ebube Ireneaus Pharm & Store",
        level: 1,
      }),
    ).toBeVisible();
    await expect(page.getByTestId("invoice_buyer")).toContainText(
      invoice.customer_name,
    );
    await expect(page.getByTestId("invoice_subtotal")).toContainText(
      NairaFMT(invoice.invoice_total, "standard"),
    );
    await expect(page.getByTestId("invoice_total")).toContainText(
      NairaFMT(invoice.invoice_total, "standard"),
    );
    await expect(
      page.getByRole("button", { name: "Print Invoice" }),
    ).toBeVisible();

    // DELETE STOCK
    await page.goto("/stock/");
    const firstRow = page.locator("tbody tr", { hasText: productName });
    await firstRow.locator("td").last().getByRole("button").click();
    await page.getByRole("menuitem", { name: "View product" }).click();
    await page.waitForURL("**/stock/*");
    await expect(
      page.getByRole("heading", { name: "Product Details", level: 2 }),
    ).toBeVisible();
    await page.getByRole("button", { name: "delete product" }).click();
    await page.waitForURL("**/stock/");

    // ASSERT DELETED STOCK
    await expect(
      page.locator("tbody tr", { hasText: productName }),
    ).toHaveCount(0);

    // DELETE INVOICE
    const response = await request.delete('/api/invoice/tests')
    await expect(response.ok()).toBeTruthy()
  });

   test("create Invoice with 0 product", async ({ page, request }) => {
    // CREATE INVOICE
    const invoice = {
      customer_name: "Ebube Ireneaus",
      stock_unit_price: "500",
      stock_selling_price: "1000",
      quantities: "5",
      invoice_total: "5000",
    };

    // CREATE INVOICE
    await page.getByRole("button", { name: "Invoice" }).click();
    await page.getByRole("link", { name: "Create" }).first().click();
    await page
      .getByRole("textbox", { name: "Customer Name" })
      .fill("Ebube Ireneaus");
    await page
      .getByRole("button", { name: "save & print", exact: true })
      .click();

    // ASSERT INVOICE ERROR
    await expect(
      page.getByTestId("invoice_creation_error_display")
    ).toBeVisible({timeout: 20_000})
  });


});
