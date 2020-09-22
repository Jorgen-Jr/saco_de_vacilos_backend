//Referenciar as controllers (Rotas da api)
import app from "./app";
import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
};

main();

//Porta que será usada pela API.
app.listen(process.env.PORT);
