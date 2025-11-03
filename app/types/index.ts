import type {InferSelectModel, InferInsertModel} from 'drizzle-orm'
import {stockTable, userTable, invoiceTable, expensesTable } from '~~/server/db/schema'

export type UserInsert = InferInsertModel<typeof userTable>
export type UserSelect = InferSelectModel<typeof userTable>

export type StockInsert = InferInsertModel<typeof stockTable>
export type StockSelect = InferSelectModel<typeof stockTable>

export type InvoiceInsert = InferInsertModel<typeof invoiceTable>
 type ISelect = InferSelectModel<typeof invoiceTable>
export type InvoiceSelect =ISelect & {user?: UserSelect}

export type ExpenseInsert = InferInsertModel<typeof expensesTable>
export type ExpenseSelect = InferSelectModel<typeof expensesTable> & {user?: UserSelect}
