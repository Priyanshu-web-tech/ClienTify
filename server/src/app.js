import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./constants.js";
import userRouter from "./routes/user.route.js";
import customerRoutes from "./routes/customer.route..js";
import orderRoutes from "./routes/order.route.js";
import campaignRoutes from "./routes/campaign.route.js";
import communicationLogRoutes from "./routes/communicationLog.route.js";
import audienceRoutes from "./routes/audience.route.js";

import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/communication",communicationLogRoutes );
app.use("/api/audience", audienceRoutes);
app.use(errorHandler)

export { app };
