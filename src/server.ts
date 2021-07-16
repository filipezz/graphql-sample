import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  const app = express();
  server.applyMiddleware({ app });
  await new Promise((resolve: any) => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

const a = [{ title: "a", id: "2" }];
const typeDefs = gql`
  type Asbaba {
    title: String
    id: ID
  }
  type Query {
    asbaba: [Asbaba]
    getAsbaba(id: String): Asbaba
  }
  type Mutation {
    addAsbaba(title: String): Asbaba
    removeAsbaba(id: String): [Asbaba]
    editAsbaba(id: String, title: String): Asbaba
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    /* R  */ asbaba: () => a,

    /* R:id */ getAsbaba: (_, args) => {
      const id = args.id;
      return a.find((asbaba) => asbaba.id === id);
    },
  },
  Mutation: {
    /* C */ addAsbaba: (_, args) => {
      const id = Math.random().toString(36).substring(2, 10);

      const newA = { title: args.title, id };
      a.push(newA);
      return newA;
    },
    /* U */ editAsbaba: (_, args) => {
      const aIndex = a.findIndex((a) => a.id === args.id);

      a[aIndex].title = args.title;
      return a[aIndex];
    },
    /* D  */ removeAsbaba: (_, args) => {
      const aIndex = a.findIndex((a) => a.id === args.id);
      a.splice(aIndex, 1);
      return a;
    },
  },
};
startApolloServer(typeDefs, resolvers);
