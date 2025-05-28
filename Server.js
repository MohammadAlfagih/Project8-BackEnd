import Fastify from "fastify";
import cors from "@fastify/cors";
import { searchHandler } from "./controllers/search.js";

const fastify = Fastify();

await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

fastify.get("/search/:query", searchHandler);

const start = async () => {
  try {
    await fastify.listen({ port: 5000 });
    console.log(`Server running on ${fastify.server.address().port}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
