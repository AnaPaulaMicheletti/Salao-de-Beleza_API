import express from "express";
import type { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import categoryRoutes from "./routes/CategoryRoutes.js";
import serviceRoutes from "./routes/ServiceRoutes.js";
import professionalRoutes from "./routes/ProfessionalRoutes.js";
import appointmentRoutes from "./routes/AppointmentRoutes.js";

const app = express();

app.use(express.json());

// ==============================
// Root
// ==============================
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// ==============================
// Swagger Documentation
// ==============================
app.use("/api-docs", swaggerUi.serveFiles(swaggerSpec));
app.get("/api-docs", swaggerUi.setup(swaggerSpec));
app.get("/api-docs/", swaggerUi.setup(swaggerSpec));

// ==============================
// Routes
// ==============================
app.use("/categories", categoryRoutes);
app.use("/services", serviceRoutes);
app.use("/professionals", professionalRoutes);
app.use("/appointments", appointmentRoutes);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ message: "JSON inválido." });
  }
  next(error);
});

export default app;