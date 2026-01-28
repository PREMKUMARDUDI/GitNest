const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");

async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
  };

  try {
    console.log("Welcome to apnaGit! Let's configure your repository.");

    const name = await askQuestion("Enter your Name: ");
    const email = await askQuestion("Enter your Email: ");

    const defaultBucket = process.env.S3_BUCKET;
    const bucketInput = await askQuestion(
      `Enter S3 Bucket Name (default: ${defaultBucket}): `,
    );
    const bucket = bucketInput.trim() || defaultBucket;

    rl.close();

    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });

    const config = {
      user: {
        name: name,
        email: email,
      },
      remote: {
        type: "s3",
        bucket: bucket,
      },
    };

    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify(config, null, 2),
    );

    console.log("\nRepository initialised!");
    console.log(`Config saved: User=${name}, Bucket=${bucket}`);
  } catch (err) {
    console.error("Error initialising repository", err);
    rl.close();
  }
}

module.exports = { initRepo };
