const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitRepo(message) {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const stagedPath = path.join(repoPath, "staging");
  const commitPath = path.join(repoPath, "commits");
  const headPath = path.join(repoPath, "HEAD");
  const configPath = path.join(repoPath, "config.json");

  try {
    const commitID = uuidv4();
    const commitDir = path.join(commitPath, commitID);

    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagedPath);
    for (const file of files) {
      await fs.copyFile(
        path.join(stagedPath, file),
        path.join(commitDir, file),
      );
    }

    let parent = null;
    try {
      parent = await fs.readFile(headPath, "utf-8");
    } catch (err) {
      console.log(err);
    }

    let author = { name: "Unknown", email: "unknown@example.com" };
    try {
      const configContent = await fs.readFile(configPath, "utf-8");
      const config = JSON.parse(configContent);
      if (config.user) {
        author = config.user;
      }
    } catch (err) {
      console.warn(
        "Warning: Could not read config.json. Author will be 'Unknown'.",
      );
    }

    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({
        message,
        date: new Date().toISOString(),
        parent: parent,
        author: author,
      }),
    );

    await fs.writeFile(headPath, commitID);
    await fs.rm(stagedPath, { recursive: true });

    console.log(`Commit ${commitID} created by ${author.name}`);
  } catch (err) {
    console.error("Error commiting files : ", err);
  }
}

module.exports = { commitRepo };
