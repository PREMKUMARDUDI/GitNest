const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mainRouter = require("./routes/main.router");
const http = require("http");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");
const { terminateRepo } = require("./controllers/terminate");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Starts a new Server", {}, startServer)
  .command("init", "Initialise a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    },
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    },
  )
  .command("push", "Push commits to S3", {}, pushRepo)
  .command("pull", "Pull commits from S3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    },
  )
  .command(
    "terminate",
    "Delete local repo and remote S3 data",
    {},
    terminateRepo,
  )
  .demandCommand(1, "You need at least one command")
  .help().argv;

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());
  app.use(cors({ origin: "*" }));

  app.use("/", mainRouter);

  const mongoUrl = process.env.MONGO_URL;

  mongoose
    .connect(mongoUrl)
    .then(() => {
      console.log("MongoDB connected!");
    })
    .catch((err) => {
      console.error("MongoDB connection error: ", err);
    });

  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CRUD operations called!");
    //CRUD operations can be called here
  });

  const httpServer = http.createServer(app);

  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
