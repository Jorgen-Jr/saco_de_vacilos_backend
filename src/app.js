const express = require('express');
const router = express.Router();
const authMiddleware = require('./middlewares/auth');

const connection = require('./database');

//User Controllers
const UserController = require('./controllers/UserController');
const UserRolesController = require('./controllers/UserRolesController');

const UserProfileController = require('./controllers/UserProfileController');
const UserSettingsController = require('./controllers/UserSettingsController');

const PostController = require('./controllers/PostController');
const PostCommentController = require('./controllers/PostCommentController');
const PostUserActions = require('./controllers/PostUserActions');

//Rota inicial da api
router.get('/', async (req, res) => {
  let connectionStatus = '';
  try {
    await connection.authenticate();
    connectionStatus = 'Database connection sucessfull!';
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong hooman :(",
      database: error,
    });
  }
  res.status(200).json({
    message: "I am working hoomanz!",
    database: connectionStatus,
  });
});

//Rota de login de usuário.
router.post('/users/login', UserController.login);
router.post('/users', UserController.store);

// router.use(authMiddleware);
router.get('/isLoginExpired/:id', UserController.isLoginExpired);

//Rotas para manipulação de usuários
router.get('/users', UserController.index);
router.get('/users/bypk/:id', UserController.indexByPk);
router.post('/users/search', UserController.search);
router.put('/users/:id', UserController.update);
router.get('/users/isLoginAvailable/:new_login', UserController.isUsernameAvailable);
//Rotas para manipulação dos perfis do usuário
router.get('/users/profile/:id', UserProfileController.indexByPk);
router.post('/users/profile/:id', UserProfileController.store);
router.put('/users/profile/:id', UserProfileController.update);
//Rotas para manipulação das configurações do usuário
router.get('/users/settings/:id', UserSettingsController.indexByPk);
router.post('/users/settings/:id', UserSettingsController.store);
router.put('/users/settings/:id', UserSettingsController.update);

//Rotas para criação de Roles
router.get('/users/roles', UserRolesController.index);
router.post('/users/:user_id/roles', UserRolesController.store);
router.get('/users/:user_id/roles', UserRolesController.user_index);
router.delete('/users/:user_id/roles', UserRolesController.delete);
router.put('/users/roles/:role_id', UserRolesController.update);

//Rotas para criação de Posts
router.get('/posts', PostController.index);
router.post('/posts/:id', PostController.store);
router.get('/posts/byAuthor/:id', PostController.byAuthor);
router.get('/posts/byGuilty/:id', PostController.byGuilty);
router.put('/posts/:id', PostController.update);
router.delete('/posts/:id', PostController.delete);

//Rotas para criação de comentários
router.get('/posts/comments/:id', PostCommentController.index);
router.post('/posts/comments/:id', PostCommentController.store);
router.put('/posts/comments/:id', PostCommentController.update);
router.delete('/posts/comments/:id', PostCommentController.delete);

//Rotas para ações do usuário
router.post('/posts/userActions/:id', PostUserActions.store);
router.put('/posts/userActions/:id', PostUserActions.update);

module.exports = app => app.use('', router);