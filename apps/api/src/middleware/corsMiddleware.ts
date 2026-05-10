import { env } from "@repo/env";
import cors, { CorsOptions } from "cors";

const allowedOrigins = [
  `http://127.0.0.1:${env.API_PORT}`, // 127.0.0.1 => localhost
  "http://127.0.0.1:5173",
  // Add your production frontend URLs here
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies and authentication headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "Pragma",
  ],
  exposedHeaders: ["Authorization"],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 200, // For legacy browser support
};

// For development - more permissive CORS
const devCorsOptions: CorsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: "*",
};

export const corsMiddleware =
  env.API_NODE_ENV === "production" ? cors(corsOptions) : cors(devCorsOptions);

export default corsMiddleware;
