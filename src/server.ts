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

import redis from "redis";
import session from "express-session";

import connectRedis from "connect-redis";
import { __prod__ } from "./constants";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  orm.getMigrator().up();

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
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({});

  app.use(
    session({
      name: "IWantBorgar",
      store: new RedisStore({
        disableTouch: true,
        client: redisClient,
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

  apollo_server.applyMiddleware({ app });
};

main();

//Porta que será usada pela API.
app.listen(process.env.PORT, () => {
  console.log("I'm working at localhost:" + process.env.PORT + " hooman!");
});
