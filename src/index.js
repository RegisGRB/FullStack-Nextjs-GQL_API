
require('dotenv').config();
import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import typeDefs from "./schemas";
import resolvers from "./resolvers";
import * as Config from "./configs";
import cors from "cors";
import Auth from "./middleware/Auth";

const startServer = async () => {
  const app = express();
  const stripe = require("stripe")("sk_test_51IdKa0EWLULmTbAKV5JLEAXK4XalxwTWVRVYc9nl2bUEeHLnvZ8IFXnuxUdNjtVT0nktMU79VVeuDsSHE58KO5nF00Bjcw0zFE");
  app.use(express.static("."));
  app.use(express.json());
  // const corsOptions = {
  //   origin: process.env.CORS_ORIGIN,
  //   credentials: true,
  //   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  // };
 
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req,res,next}) => {return {req,res,next}}
  });
  app.use(Auth);
  server.applyMiddleware({ app });
  app.use(cors())

  app.post("/create-payment-intent", async (req, res) => {
    const { Price } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((Price*100)),
      currency: "usd"

    });

    res.send({
      clientSecret: paymentIntent.client_secret
    });

  });

  await mongoose
    .connect(Config.db.url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify:true
    })
    .then(() => {
      console.log("Successfully connect to database");
    })
    .catch((err) => {
      console.log('couldn"t not connect to database', err);
      process.exit(-1);
    });

  app.listen({ port: Config.server.port }, (e) =>
    console.log(
      `🚀 GraphQl ready at http://localhost:${Config.server.port}${server.graphqlPath}`
    )
  );
};

startServer();
// require('dotenv').config()
// const app = require("./services/server.service");
// const mongoService = require("./services/mongoose.service");

// mongoService.dbConnect();
// app.start();