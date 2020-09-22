//Carregar as variáveis de enviromnent.
if (process.env.NODE_ENV !== "production") {
  if (process.env.NODE_ENV === "test") {
    require("dotenv").config({
      path: ".env.test",
    });
  }
}

module.exports = {
  dbName: process.env.DB_DATABASE || "DB_SACO_DE_VACILOS",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "@!Pass",
  type: "postgresql",
  debug: process.env.NODE_ENV === "production",
};
