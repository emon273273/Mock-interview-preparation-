import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const MockInterview = pgTable("MockInterview", {
  id: serial("id").primaryKey(),
  jsonMockResponse: text("jsonMockResponse").notNull(),
  jobPosition: varchar("jobPosition").notNull(),
  jobDescription: varchar("jobDescription").notNull(),
  jobExperience: varchar("jobExperience").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt").notNull(),
  mockId: varchar("mockid").notNull(),
});

export const UserAnswer=pgTable("UserAnswer",{
  id: serial("id").primaryKey(),
  mockIdRef:varchar("mockid").notNull(),
  question:varchar('question').notNull(),
  correctAns:text('correctAns'),
  userAns:text('userAns'),
  feedback:text("feedback"),
  rating:varchar("rating"),
  userEmail:varchar("userEmail"),
  createdAt:varchar("createdAt")

})