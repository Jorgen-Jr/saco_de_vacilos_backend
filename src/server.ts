//Referenciar as controllers (Rotas da api)
import app from "./app";
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";

import { ApolloServer } from "apollo-server-express";

import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/Hello";
import { UserResolver } from "./resolvers/User";
import { FollowingRelationshipResolver } from "./resolvers/FollowingRelationship";
import { PostResolver } from "./resolvers/Post";
import { PostComment } from "./entities/PostComment";
import { PostUserActionResolver } from "./resolvers/PostUserAction";
import { UserSettingsResolver } from "./resolvers/UserSettings";

import Redis from "ioredis";
import session from "express-session";

import connectRedis from "connect-redis";
import { COOKIE_NAME, __prod__ } from "./constants";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  orm.getMigrator().up();

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
    context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
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
