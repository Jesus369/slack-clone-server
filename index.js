import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import bodyParser from "body-parser";
import express from "express";
import models from "./models";
import path from "path";
import cors from "cors";

const SECRET = "klfskfksgkjsh";
const SECRET2 = "klfskfksgkjshljfsdhfshfkds";

/*fileLoader will grab all schema files within the schema/resolvers folder*/
/*mergeTypes/Resolvers will converted them into an array*/
/*Newly added files will be added into the array*/
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

/*makeExecutable merges both Schemas together*/
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const graphqlEndpoint = "/graphql";
const app = express();

app.use(cors("*"));

/*Passing in Schema folder.*/
/*Passing in Models folder to create from resolvers folder*/
app.use(
  graphqlEndpoint,
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {
      models,
      user: { id: 1 },
      SECRET,
      SECRET2
    }
  })
);

/*Telling graphiql what our graph endpoint is*/
app.use("/graphiql", graphiqlExpress({ endpointURL: graphqlEndpoint }));

/*sync will create all tables within Postgress assuming they don't already exist*/
models.sequelize.sync({}).then(() => {
  app.listen(8081);
});
