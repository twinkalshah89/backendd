import swaggerJsDoc from 'swagger-jsdoc';
import { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Template Service API',
      version: '1.0.0',
      description: 'API documentation for Template Service',
    },
    servers: [
        {
          url: "/api/template", // Use relative path to work with proxies like Nginx
        },
      ],
  },
  apis: [
    'src/presentation/routes/**/*.ts',
    'src/presentation/controllers/**/*.ts'
  ],
};

export const swaggerSpec = swaggerJsDoc(options);
