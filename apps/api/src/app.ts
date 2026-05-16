import dotenv from "dotenv";
dotenv.config();

import routes from "./routes";
import Express from "express";
import errorHandler from "./middleware/errorMiddleware";
import { requestLogger, errorLogger } from "./middleware/loggerMiddleware";
import corsMiddleware from "./middleware/corsMiddleware";
import { swaggerUi, swaggerSpec } from "./config/swagger.config";

const app = Express();
app.use(corsMiddleware);
app.use(requestLogger);
if (process.env.API_DOC_VISIBLE) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
app.use(Express.json());

app.use(routes);

app.use(errorLogger);
app.use(errorHandler);

export default app;
