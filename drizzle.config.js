import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // Explicitly load .env.local

import { defineConfig } from "drizzle-kit";

console.log(process.env.DATABASE_URL); // Ensure this prints the correct URL

export default defineConfig({
  out: "./drizzle",
  schema: "src/utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL, // Should be defined now
  },
});
