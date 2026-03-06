import path from 'path';

import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import swaggerUi from 'swagger-ui-express';

import { HOST_NAME, PORT, CLIENT_ORIGIN, DB_CONFIG } from './config/constants.js';
import { createNewConnection, closeConnection } from './config/db.js';
import { swaggerSpec } from './config/swagger.js';

// models
import User from './models/User.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';

// controllers
import * as authController from './controllers/authController.js';
import * as userController from './controllers/userController.js';
import * as postController from './controllers/postController.js';
import * as commentController from './controllers/commentController.js';

// middlewares
import { authenticateToken } from './middlewares/auth.js';

const app = express();

// allows the server to accept JSON data in the body of the request
app.use(express.json());

// enables cookie parsing
app.use(cookieParser());

// enables CORS and allow cookies and credentials to be included in requests
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

// serve static files
app.use(express.static('./public'));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/');
  },
  filename: (req, file, cb) => {
    const uniqueName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

try {
  const mysqlConnection = await createNewConnection(DB_CONFIG);

  User.setConnection(mysqlConnection);
  Post.setConnection(mysqlConnection);
  Comment.setConnection(mysqlConnection);

  await User.initTable();
  await Post.initTable();
  await Comment.initTable();

  process.on('SIGINT', async () => {
    try {
      await closeConnection(mysqlConnection);
      process.exit(0);
    } catch (err) {
      console.error('❌ error closing connection: ', err);
      process.exit(1);
    }
  });
} catch (err) {
  console.error(err);
  process.exit(1);
}

// endpoints

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: hello from express!
 */
app.get('/', (req, res) => {
  res.status(200).json({ message: 'hello from express!' });
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
// auth
app.post('/auth/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: User ID
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=abc123; HttpOnly; Secure; SameSite=Strict
 *       400:
 *         description: Missing username or password
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
app.post('/auth/login', authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security: []
 *     responses:
 *       204:
 *         description: Logout successful
 *       500:
 *         description: Internal server error
 */
app.post('/auth/logout', authController.logout);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get current user information
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
// user
app.get('/user', authenticateToken, userController.getUser);

/**
 * @swagger
 * /user:
 *   patch:
 *     summary: Update current user information
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Update failed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
app.patch('/user', authenticateToken, userController.updateUser);

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Delete current user account
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Delete failed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
app.delete('/user', authenticateToken, userController.deleteUser);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts (unfound pets)
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
// posts
app.get('/posts', authenticateToken, postController.getAllPosts);

/**
 * @swagger
 * /posts/user:
 *   get:
 *     summary: Get current user's posts
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user's posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
app.get('/posts/user', authenticateToken, postController.getUserPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a single post by ID
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
app.get('/posts/:id', authenticateToken, postController.getPost);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
app.post('/posts', authenticateToken, upload.single('image'), postController.createPost);

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [dog, cat, parrot, snake]
 *               lostAt:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - not the post author
 *       500:
 *         description: Internal server error
 */
app.patch('/posts/:id', authenticateToken, upload.single('image'), postController.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - not the post author
 *       500:
 *         description: Internal server error
 */
app.delete('/posts/:id', authenticateToken, postController.deletePost);

/**
 * @swagger
 * /comments/{postId}:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
// comments
app.get('/comments/:postId', authenticateToken, commentController.getComments);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentRequest'
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
app.post('/comments', authenticateToken, commentController.createComment);

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: Updated comment text
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - not the comment author
 *       500:
 *         description: Internal server error
 */
app.patch('/comments/:id', authenticateToken, commentController.updateComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - not the comment author
 *       500:
 *         description: Internal server error
 */
app.delete('/comments/:id', authenticateToken, commentController.deleteComment);

// start the server
app.listen(PORT, HOST_NAME, (err) => {
  console.log(err ?? `server running at http://${HOST_NAME}:${PORT}`);
});
