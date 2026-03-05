import swaggerJsdoc from 'swagger-jsdoc';
import { PORT, HOST_NAME } from './constants.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Finder API',
      version: '1.0.0',
      description: 'A comprehensive API for a pet finder application that allows users to post about lost pets, comment on posts, and manage their accounts.',
      contact: {
        name: 'Mehmed Yunuz',
        email: 'stu2401322028@uni-plovdiv.bg',
      },
    },
    servers: [
      {
        url: `http://${HOST_NAME}:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'JWT token stored in HTTP-only cookie',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            username: {
              type: 'string',
              maxLength: 15,
              description: 'Unique username',
            },
            password: {
              type: 'string',
              maxLength: 100,
              description: 'Hashed password',
            },
            name: {
              type: 'string',
              maxLength: 20,
              description: 'User full name',
            },
            registered: {
              type: 'string',
              format: 'date-time',
              description: 'Registration timestamp',
            },
            isAdult: {
              type: 'boolean',
              description: 'Whether user is an adult',
            },
            phone: {
              type: 'string',
              maxLength: 20,
              description: 'Contact phone number',
            },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Post ID',
            },
            author_id: {
              type: 'integer',
              description: 'Author user ID',
            },
            title: {
              type: 'string',
              maxLength: 100,
              description: 'Post title',
            },
            description: {
              type: 'string',
              description: 'Detailed description of the lost pet',
            },
            image: {
              type: 'string',
              maxLength: 200,
              description: 'URL to the pet image',
            },
            category: {
              type: 'string',
              enum: ['dog', 'cat', 'parrot', 'snake'],
              description: 'Type of pet',
            },
            isFound: {
              type: 'boolean',
              description: 'Whether the pet has been found',
            },
            lostAt: {
              type: 'string',
              maxLength: 50,
              description: 'Location where pet was lost',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Post creation timestamp',
            },
            author_name: {
              type: 'string',
              description: 'Name of the post author',
            },
            author_phone: {
              type: 'string',
              description: 'Phone number of the post author',
            },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Comment ID',
            },
            post_id: {
              type: 'integer',
              description: 'Associated post ID',
            },
            author_id: {
              type: 'integer',
              description: 'Comment author user ID',
            },
            comment: {
              type: 'string',
              description: 'Comment text',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Comment creation timestamp',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'password', 'name', 'isAdult', 'phone'],
          properties: {
            username: {
              type: 'string',
              maxLength: 15,
              description: 'Unique username',
            },
            password: {
              type: 'string',
              description: 'User password',
            },
            name: {
              type: 'string',
              maxLength: 20,
              description: 'User full name',
            },
            isAdult: {
              type: 'boolean',
              description: 'Whether user is an adult',
            },
            phone: {
              type: 'string',
              maxLength: 20,
              description: 'Contact phone number',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Username',
            },
            password: {
              type: 'string',
              description: 'Password',
            },
          },
        },
        CreatePostRequest: {
          type: 'object',
          required: ['title', 'description', 'category', 'lostAt', 'image'],
          properties: {
            title: {
              type: 'string',
              maxLength: 100,
              description: 'Post title',
            },
            description: {
              type: 'string',
              description: 'Detailed description of the lost pet',
            },
            category: {
              type: 'string',
              enum: ['dog', 'cat', 'parrot', 'snake'],
              description: 'Type of pet',
            },
            lostAt: {
              type: 'string',
              maxLength: 50,
              description: 'Location where pet was lost',
            },
            image: {
              type: 'string',
              format: 'binary',
              description: 'Pet image file',
            },
          },
        },
        CreateCommentRequest: {
          type: 'object',
          required: ['post_id', 'comment'],
          properties: {
            post_id: {
              type: 'integer',
              description: 'Post ID to comment on',
            },
            comment: {
              type: 'string',
              description: 'Comment text',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./src/index.js', './src/controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
