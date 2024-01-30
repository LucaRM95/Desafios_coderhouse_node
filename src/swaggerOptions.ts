import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

export const __dirname = path.resolve();

console.log(`${__dirname}/src/docs/**/*.yaml`)

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de ejemplo",
      version: "1.0.0",
      description: "Documentación de la API de ejemplo con Swagger",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Servidor local",
      },
    ],
  },
  apis: [`${__dirname}/src/docs/**/*.yaml`],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;