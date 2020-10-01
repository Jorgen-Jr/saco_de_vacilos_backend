import app from "./app";

import connectRedis from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
import "reflect-metadata";

import { buildSchema } from "type-graphql";

import { COOKIE_NAME, __prod__ } from "./constants";
import { PostComment } from "./entities/PostComment";

import { FollowingRelationshipResolver } from "./resolvers/FollowingRelationship";
import { HelloResolver } from "./resolvers/Hello";
import { PostResolver } from "./resolvers/Post";
import { PostUserActionResolver } from "./resolvers/PostUserAction";
import { UserResolver } from "./resolvers/User";
import { UserSettingsResolver } from "./resolvers/UserSettings";

import { createConnection } from "typeorm";

import { ApolloServer } from "apollo-server-express";

import { UserSettings } from "./entities/UserSettings";
import { UserProfile } from "./entities/UserProfile";
import { PostUserAction } from "./entities/PostUserAction";
import { Post } from "./entities/Post";
import { FollowingRelationship } from "./entities/FollowingRelationship";
import { Role } from "./entities/Role";
import { User } from "./entities/User";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "db_vacilo",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "@!Pass",
    logging: true,
    synchronize: true,
    entities: [
      User,
      Role,
      FollowingRelationship,
      Post,
      PostComment,
      PostUserAction,
      UserProfile,
      UserSettings,
    ],
    cli: {
      migrationsDir: "src/migration",
    },
  });

  await conn.runMigrations();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  const apollo_server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        UserResolver,
        FollowingRelationshipResolver,
        PostResolver,
        PostComment,
        PostUserActionResolver,
        UserSettingsResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        disableTouch: true,
        client: redis,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string,
      resave: false,
    })
  );

  apollo_server.applyMiddleware({ app, cors: false });
};

main();

//Porta que será usada pela API.
app.listen(process.env.PORT, () => {
  console.log("I'm working at localhost:" + process.env.PORT + " hooman!");
});
