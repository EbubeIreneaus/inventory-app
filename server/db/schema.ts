import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  integer,
  json,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { size } from "zod";

export const userTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  firstname: varchar({ length: 225 }).notNull(),
  lastname: varchar({ length: 225 }).notNull(),
  email: varchar("email", { length: 225 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  password: varchar("password", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }),
  city: varchar("city", { length: 50 }),
  address: varchar("address", { length: 225 }).notNull(),
  dob: date(),
  isActive: boolean("is_active").default(true),
  isEmailVerified: boolean("is_email_verified").default(false),
  previlage: varchar({length: 5, enum: ['admin', 'staff', 'none']}).default('none').notNull(),
  role: varchar( { length: 50 }).notNull().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  sessionId: uuid('sessionId')
});

export const userRelationships = relations(userTable, ({many}) => ({
  expenses: many(expensesTable),
  sales: many(invoiceTable)
}))

export const stockTable = pgTable('stocks', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  productName: varchar({length: 255}).notNull(),
  category: varchar({ length: 50 }),
  quantity: integer().default(0).notNull(),
  isAvailable: boolean().default(true),
  unitPrice: decimal('unit_price',{precision:9, scale: 2}).default('0.0'),
  sellingPrice: decimal('selling_price',{precision:9, scale: 2}).default('0.0'),
   size: varchar({length: 10, enum: ['sm','md', 'lg', 'xl', 'xxl']}),
   description: text()
})

export const invoiceTable = pgTable('sales', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer(),
    products: json().$type<{id:number, name: string, unitPrice: string, amount: string, quantity: number}[]>(),
    totalAmount: decimal("total_amount", {precision:9, scale: 2}).default('0.0'),
    createdAt: timestamp('created_at').defaultNow(),
    buyer: varchar({length: 255}),
    paymentType: varchar({length: 10, enum: ['cash','transfer', 'card', 'debt']}).default('cash').notNull(),
    currency: varchar({length: 6}).default('NGN')
})

export const invoiceRelationships = relations(invoiceTable, ({one}) => ({
  user: one(userTable, {
    fields: [invoiceTable.userId],
    references: [userTable.id]
  })
}))

export const expensesTable = pgTable('expenses', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer(),
    desc: text(),
    totalAmount: decimal("total_amount", {precision:9, scale: 2}).default('0.0'),
    createdAt: timestamp('created_at').defaultNow(),
    paymentType: varchar({length: 10, enum: ['cash','transfer', 'card', 'debt']}).default('cash').notNull(),
    currency: varchar({length: 6}).default('NGN'),
    category: varchar({length: 30}),
})

export const expensesRelationships = relations(expensesTable, ({one}) => ({
  user: one(userTable, {
    fields: [expensesTable.userId],
    references: [userTable.id]
  })
}))

export const notifcationTable = pgTable('notifications', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({length: 255}).notNull(),
  content: text().notNull(),
  createdAt: timestamp().defaultNow(),
  viewers: json().$type<number[]>(),
  to: varchar({ length: 50 }).notNull().$type<"all" | number>().default('all'),
})