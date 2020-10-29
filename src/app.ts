const express = require("express");
const cors = require("cors");
const app = express();

//Usando as politicas de acesso do cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//Load the local environment when not in production...
if (process.env.NODE_ENV !== "production") {
  if (process.env.NODE_ENV === "test") {
    require("dotenv").config({
      path: ".env.test",
    });
  } else {
    require("dotenv").config({
      path: ".env",
    });
  }
}

export default app;
