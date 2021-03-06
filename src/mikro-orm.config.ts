import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import { User } from "./entities/User";
import path from "path";
import { Role } from "./entities/Role";
import { FollowingRelationship } from "./entities/FollowingRelationship";
import { Post } from "./entities/Post";
import { PostComment } from "./entities/PostComment";
import { PostUserAction } from "./entities/PostUserAction";
import { UserProfile } from "./entities/UserProfile";
import { UserSettings } from "./entities/UserSettings";

export default {
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
  dbName: process.env.DB_DATABASE || "db_vacilo",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "@!Pass",
  type: "postgresql",
  debug: !__prod__,
  migrations: {
    tableName: "mikro_orm_migrations", // name of database table with log of executed transactions
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    emit: "ts", // migration generation mode
  },
} as Parameters<typeof MikroORM.init>[0];
