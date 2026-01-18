import { test, expect } from "@playwright/test";

test.describe("Expenses Lifecyle: Create, Assert & Delete", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Expenses" }).click();
  });

  test("workflow", async ({ page, request }) => {
    //CREATE EXPENSE
    const expense = {
      amount: "20000",
      category: "Utilities",
      description: `random-unique-description-${Date.now()}`,
    };

    await page.getByRole("link", { name: "Create" }).first().click();
    await expect(
      page.getByRole("heading", { name: "Record Expense" }),
    ).toBeVisible();
    await page
      .getByRole("textbox", { name: "Total Amount*" })
      .fill(expense.amount);
    await page.getByRole("combobox", { name: "category*" }).click();
    await page.getByRole("option", { name: "Utilities" }).click({force: true});
    await page.getByRole("combobox", { name: "Paid Via*" }).click();
    await page.getByRole("option", { name: "card" }).click();
    await page
      .getByRole("textbox", { name: "Description" })
      .fill(expense.description);

    const responsePromise = page.waitForResponse(
      (res) =>
        res.url() == "http://localhost:3000/api/expense/create" &&
        res.request().method() === "PUT" &&
        (res.status() === 200 || res.status() === 201),
    );

    await page
      .getByRole("button", { name: "save & continue", exact: true })
      .click();
    const data = (await (await responsePromise).json()) as unknown as {
      insertId: number;
    };
    await page.goto(`/expense/${data.insertId}`);

    // ASSERT EXPENSE RECORD
    await expect(
      page.getByRole("heading", { name: "Expenses Details" }),
    ).toBeVisible();
    await expect(page.getByTestId("expense_category")).toContainText(
      expense.category,
    );
    await expect(page.getByTestId("expense_amount")).toContainText(
      "₦20,000.00",
    );
    await page.getByTestId("expense_desc").click();
    await expect(page.getByTestId("expense_desc")).toContainText(
      expense.description,
    );
    await expect(page.getByTestId("expense_staff")).toContainText(
      "Tester Ireneaus — staff",
    );

    // DELETE RECORD
    const req = await request.delete("/api/expense/test");
    expect(req.ok()).toBeTruthy();
  });

  test("workflow with invalid data", async ({ page, request }) => {
    //CREATE EXPENSE
    const expense = {
      amount: "0",
      category: "Utilities",
      description: `random-unique-description-${Date.now()}`,
    };

    await page.getByRole("link", { name: "Create" }).first().click();
    await expect(
      page.getByRole("heading", { name: "Record Expense" }),
    ).toBeVisible();
    await page
      .getByRole("textbox", { name: "Total Amount*" })
      .fill(expense.amount);
    await page.getByRole("combobox", { name: "category*" }).click();

    await page.getByRole("option", { name: expense.category }).click({force: true});
    await page.getByRole("combobox", { name: "Paid Via*" }).click();
    await page.getByRole("option", { name: "card" }).click();
    await page
      .getByRole("textbox", { name: "Description" })
      .fill(expense.description);

    await page
      .getByRole("button", { name: "save & continue", exact: true })
      .click();

    // ASSERT ERROR
    await expect(
      page.getByTestId("invoice_creation_error_display")
    ).toBeVisible({ timeout: 20_000 });
  });
});
