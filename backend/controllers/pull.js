const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");
  const headPath = path.join(repoPath, "HEAD");

  try {
    const data = await s3
      .listObjectsV2({ Bucket: S3_BUCKET, Prefix: "commits/" })
      .promise();

    const objects = data.Contents;

    for (const object of objects) {
      const key = object.Key;
      const commitDir = path.join(repoPath, path.dirname(key));

      await fs.mkdir(commitDir, { recursive: true });

      const params = { Bucket: S3_BUCKET, Key: key };
      const fileContent = await s3.getObject(params).promise();
      await fs.writeFile(path.join(repoPath, key), fileContent.Body);

      console.log("Pulled file: ", key);
    }
    console.log("All commits downloaded.");

    const commitDirs = await fs.readdir(commitsPath);
    let latestCommitID = null;
    let latestDate = null;

    for (const dir of commitDirs) {
      const commitJsonPath = path.join(commitsPath, dir, "commit.json");
      try {
        const content = await fs.readFile(commitJsonPath, "utf-8");
        const commitData = JSON.parse(content);
        const commitDate = new Date(commitData.date);

        if (!latestDate || commitDate > latestDate) {
          latestDate = commitDate;
          latestCommitID = dir;
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (latestCommitID) {
      await fs.writeFile(headPath, latestCommitID);

      const latestCommitDir = path.join(commitsPath, latestCommitID);
      const files = await fs.readdir(latestCommitDir);

      for (const file of files) {
        if (file === "commit.json") continue;

        await fs.copyFile(
          path.join(latestCommitDir, file),
          path.join(process.cwd(), file),
        );
      }
      console.log(
        `HEAD updated to ${latestCommitID}. Working directory synced.`,
      );
    }
  } catch (err) {
    console.error("Error pulling from S3: ", err);
  }
}

module.exports = { pullRepo };
