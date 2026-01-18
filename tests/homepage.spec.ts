import {test, expect} from '@playwright/test'

test.describe("Home Page Section", () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/')
    })

    test("Page Load Successful", async ({page}) => {
        await expect(page.getByRole('heading', { name: 'WELCOME BACK, Tester!' })).toBeVisible();
    })

    // test("Expect all info card to display 0", async ({page}) => {
    //     await expect(page.getByTestId('total_sales_amount')).toContainText('₦0');
    //     await expect(page.getByTestId('total_expense_amount')).toContainText('₦0');
    //     await expect(page.getByTestId('total_stock_product')).toContainText('0');
    //     await expect(page.getByTestId('total_outstock_product')).toContainText('0');
    //     await expect(page.getByTestId('invoice_cash')).toContainText('₦0');
    //     await expect(page.getByTestId('invoice_transfer')).toContainText('₦0');
    //     await expect(page.getByTestId('invoice_debt')).toContainText('₦0');
    //     await expect(page.getByTestId('invoice_card')).toContainText('₦0');
    // })
})
