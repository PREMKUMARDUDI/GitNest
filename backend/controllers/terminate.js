const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function terminateRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");

  try {
    console.log("⚠️  STARTING TERMINATION PROCESS ⚠️");
    console.log(
      "This will permanently delete .apnaGit and all remote backups.",
    );

    console.log("Scanning S3 bucket for commits...");

    let isTruncated = true;
    let continuationToken;

    while (isTruncated) {
      const listParams = {
        Bucket: S3_BUCKET,
        Prefix: "commits/",
        ContinuationToken: continuationToken,
      };

      const listedObjects = await s3.listObjectsV2(listParams).promise();

      if (listedObjects.Contents.length === 0) {
        console.log("No remote data found to delete.");
        break;
      }

      const deleteParams = {
        Bucket: S3_BUCKET,
        Delete: { Objects: [] },
      };

      listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
      });

      await s3.deleteObjects(deleteParams).promise();

      if (listedObjects.Contents.length > 0) {
        console.log(
          `Deleted ${listedObjects.Contents.length} files from S3...`,
        );
      }

      isTruncated = listedObjects.IsTruncated;
      continuationToken = listedObjects.NextContinuationToken;
    }
    console.log("✅ Remote S3 data cleaned successfully.");

    console.log("Removing local .apnaGit repository...");
    await fs.rm(repoPath, { recursive: true, force: true });
    console.log("✅ Local repository deleted successfully.");

    console.log("Repository terminated.");
  } catch (err) {
    console.error("Error terminating repository:", err);
  }
}

module.exports = { terminateRepo };
