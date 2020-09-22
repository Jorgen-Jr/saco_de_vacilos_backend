if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config({ path: ".env" });
}

const SESSION_SECRET = process.env["SESSION_SECRET"];

if (!SESSION_SECRET) {
  // logger.error("No client secret. Set SESSION_SECRET environment variable.");
  console.log(
    "Sem secret do cliente, favor informar o SESSION_SECRET nas variáveis de ambiente."
  );
  process.exit(1);
}

export default SESSION_SECRET;
