const fs = require("fs").promises;
const path = require("path");

async function revertRepo(arg) {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");
  const headPath = path.join(repoPath, "HEAD");

  try {
    let commitID = arg;

    if (arg === "HEAD" || arg === "HEAD~1") {
      try {
        const currentHead = await fs.readFile(headPath, "utf-8");

        if (arg === "HEAD") {
          commitID = currentHead;
        } else if (arg === "HEAD~1") {
          const commitJsonPath = path.join(
            commitsPath,
            currentHead,
            "commit.json",
          );
          const commitData = JSON.parse(
            await fs.readFile(commitJsonPath, "utf-8"),
          );

          if (!commitData.parent) {
            console.error(
              "Error: already at the first commit. No parent found.",
            );
            return;
          }
          commitID = commitData.parent;
        }
      } catch (err) {
        console.error("Error reading HEAD. Make sure you have commits.");
        return;
      }
    }

    console.log(`Reverting to ${commitID}...`);

    const commitDir = path.join(commitsPath, commitID);
    const parentDir = process.cwd();

    const files = await fs.readdir(commitDir);

    for (const file of files) {
      if (file === "commit.json") continue;
      await fs.copyFile(path.join(commitDir, file), path.join(parentDir, file));
    }

    console.log(`Reverted to commit ID: ${commitID} successfully!`);

    await fs.writeFile(headPath, commitID);
  } catch (err) {
    console.error("Unable to revert : ", err);
  }
}

module.exports = { revertRepo };
