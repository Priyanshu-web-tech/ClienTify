import dotenv from "dotenv";
dotenv.config();

export const DB_NAME = "CRM";

export const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

export const port = process.env.PORT || 3001;
