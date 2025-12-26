import { createSwaggerSpec } from "next-swagger-doc";

export const getSwaggerSpec = () =>
  createSwaggerSpec({
    apiFolder: "pages/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "My Next.js API",
        version: "1.0.0",
        description: "Automatic Swagger docs",
      },
    },
  });
