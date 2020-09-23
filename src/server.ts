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
    context: () => ({ em: orm.em }),
  });

  apollo_server.applyMiddleware({ app });
};

main();

//Porta que será usada pela API.
app.listen(process.env.PORT, () => {
  console.log("I'm working at localhost:" + process.env.PORT + " hooman!");
});
