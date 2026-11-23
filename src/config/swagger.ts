import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Salão de Beleza - API",
      version: "1.0.0",
      description:
        "API REST para gerenciamento de categorias, serviços, profissionais e agendamentos de um salão de beleza.",
    },
    servers: [
      {
        url: "/",
        description: "Servidor atual (local ou Vercel)",
      },
      {
        url: "http://localhost:3000",
        description: "Desenvolvimento local",
      },
    ],
    tags: [
      {
        name: "Categories",
        description: "Gerenciamento de categorias",
      },
      {
        name: "Services",
        description: "Gerenciamento de serviços",
      },
      {
        name: "Professionals",
        description: "Gerenciamento de profissionais",
      },
      {
        name: "Appointments",
        description: "Gerenciamento de agendamentos",
      },
    ],
    components: {
      schemas: {
        Category: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            name: {
              type: "string",
              example: "Cabelos",
            },
            description: {
              type: "string",
              example: "Corte, escova e tratamentos",
            },
            active: {
              type: "boolean",
              example: true,
            },
          },
        },
        CreateCategory: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "Cabelos" },
            description: {
              type: "string",
              example: "Corte, escova e tratamentos",
            },
          },
        },
        UpdateCategory: {
          type: "object",
          properties: {
            name: { type: "string", example: "Cabelos" },
            description: {
              type: "string",
              example: "Corte, escova e tratamentos",
            },
            active: { type: "boolean", example: true },
          },
        },
        Service: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            category_id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
              example: "Corte feminino",
            },
            description: {
              type: "string",
              example: "Corte feminino com finalização",
            },
            price: {
              type: "number",
              minimum: 0,
              example: 80,
            },
            duration_minutes: {
              type: "integer",
              minimum: 1,
              example: 60,
            },
            active: {
              type: "boolean",
              example: true,
            },
          },
        },
        CreateService: {
          type: "object",
          required: ["category_id", "name", "price", "duration_minutes"],
          properties: {
            category_id: { type: "string", format: "uuid", example: "0b6f1c1e-8a52-4d6e-9a3b-2f6d2e0c1a11" },
            name: { type: "string", example: "Corte feminino" },
            description: {
              type: "string",
              example: "Corte feminino com finalização",
            },
            price: { type: "number", minimum: 0, example: 80 },
            duration_minutes: { type: "integer", minimum: 1, example: 60 },
          },
        },
        UpdateService: {
          type: "object",
          properties: {
            category_id: { type: "string", format: "uuid", example: "0b6f1c1e-8a52-4d6e-9a3b-2f6d2e0c1a11" },
            name: { type: "string", example: "Corte feminino" },
            description: {
              type: "string",
              example: "Corte feminino com finalização",
            },
            price: { type: "number", minimum: 0, example: 80 },
            duration_minutes: { type: "integer", minimum: 1, example: 60 },
            active: { type: "boolean", example: true },
          },
        },
        Professional: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            name: {
              type: "string",
              example: "Camila Duarte",
            },
            specialty: {
              type: "string",
              example: "Cabeleireira",
            },
            phone: {
              type: "string",
              example: "41999999999",
            },
            active: {
              type: "boolean",
              example: true,
            },
          },
        },
        CreateProfessional: {
          type: "object",
          required: ["name", "specialty"],
          properties: {
            name: { type: "string", example: "Camila Duarte" },
            specialty: { type: "string", example: "Cabeleireira" },
            phone: { type: "string", example: "41999999999" },
          },
        },
        UpdateProfessional: {
          type: "object",
          properties: {
            name: { type: "string", example: "Camila Duarte" },
            specialty: { type: "string", example: "Cabeleireira" },
            phone: { type: "string", example: "41999999999" },
            active: { type: "boolean", example: true },
          },
        },
        Appointment: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            service_id: {
              type: "string",
              format: "uuid",
            },
            professional_id: {
              type: "string",
              format: "uuid",
            },
            client_name: {
              type: "string",
              example: "Pandora Zuzu",
            },
            client_phone: {
              type: "string",
              example: "41999999999",
            },
            appointment_date: {
              type: "string",
              format: "date",
              example: "2026-12-10",
            },
            appointment_time: {
              type: "string",
              example: "14:30",
            },
            status: {
              type: "string",
              example: "agendado",
            },
          },
        },
        CreateAppointment: {
          type: "object",
          required: [
            "service_id",
            "professional_id",
            "client_name",
            "client_phone",
            "appointment_date",
            "appointment_time",
          ],
          properties: {
            service_id: { type: "string", format: "uuid", example: "5d2f9a64-3c1b-4e8a-b7d0-6a9c4e1f2b33" },
            professional_id: { type: "string", format: "uuid", example: "9e4c7b12-6f0d-4a3e-8c5b-1d2a3f4e5b66" },
            client_name: { type: "string", example: "Pandora Zuzu" },
            client_phone: { type: "string", example: "41999999999" },
            appointment_date: {
              type: "string",
              format: "date",
              example: "2026-12-10",
            },
            appointment_time: { type: "string", example: "14:30" },
            status: { type: "string", example: "agendado" },
          },
        },
        UpdateAppointment: {
          type: "object",
          properties: {
            service_id: { type: "string", format: "uuid", example: "5d2f9a64-3c1b-4e8a-b7d0-6a9c4e1f2b33" },
            professional_id: { type: "string", format: "uuid", example: "9e4c7b12-6f0d-4a3e-8c5b-1d2a3f4e5b66" },
            client_name: { type: "string", example: "Pandora Zuzu" },
            client_phone: { type: "string", example: "41999999999" },
            appointment_date: {
              type: "string",
              format: "date",
              example: "2026-12-10",
            },
            appointment_time: { type: "string", example: "14:30" },
            status: { type: "string", example: "agendado" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Erro ao processar solicitação.",
            },
          },
        },

        Message: {
          type: "object",
          properties: {
            message: { 
              type: "string", 
              example: "Registro removido com sucesso." 
            },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;