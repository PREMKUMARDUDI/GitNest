# GitNest

A modern GitHub-inspired platform for hosting, collaborating, and managing your code repositories.  
Built with React, Node.js, MongoDB, Express—and features a powerful backend **custom git command suite** that simulates local git commands (_`init`, `add`, `commit`, `push`, `pull`, `revert`_).

---

## 🚀 Features

- **Repository Management:** Create, update, browse, and delete repositories.
- **Issue Tracking:** Create, update, and manage issues for any repository.
- **Bulk Issue Deletion:** Delete all issues for a repository at once.
- **User Profiles:** View your profile, contributions, repositories and more.
- **Search & Suggestions:** Find your repositories and suggested repositories easily.
- **Authentication & Authorization:** Secure login/signup and access control for repositories and issues.
- **Custom Git Commands:** Work with repositories using `init`, `add`, `commit`, `push`, `pull`, and `revert`—integrated into the backend with
  `local storage` and `AWS S3` support.

---

## ⚡️ Demo

_(https://main.dq1ol2kvxe1w3.amplifyapp.com/)_

---

## 🛠️ Tech Stack

- **Frontend:** React (Hooks, Context), CSS Modules
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, bcrypt
- **Routing:** React Router
- **S3 Storage:** AWS S3 for remote backup of repo objects
- **Git Engine:** Custom CLI commands built with yargs and Node’s fs module

---

## 📄 API Endpoints

- `POST /repo/create` — Create a repository
- `GET /repo/:repoId` — Get repository by ID
- `PUT /repo/update/:repoId` — Update a repository
- `DELETE /repo/delete/:repoId` — Delete a repository (also deletes its issues)
- `POST /issue/create/:repoID` — Create an issue for a repository
- `GET /issue/:id` — Get a single issue by ID
- `GET /issue/all/:repoID` — List all issues for a repository
- `PUT /issue/update/:id` — Update an issue
- `DELETE /issue/delete/:id` — Delete a single issue
- `DELETE /issue/delete/all/:repoID` — Delete all issues for a repository

---

## 🖥 Custom Git-like CLI Commands

The backend contains a _miniature git-like engine_ for local (server-side) repository simulation and `AWS S3` backup.  
Commands are powered by [yargs](https://github.com/yargs/yargs), available when running Node directly.

### **Available Commands**

- `start` — Starts the backend web server.
- `init` — **Initializes a new local repository** in `.apnaGit` in the current working directory and stores bucket info in `config.json`.
- `add <file>` — **Adds a file to the staging area** (copies your file into `.apnaGit/staging`).
- `commit <message>` — **Commits all staged files** to a new commit directory with a unique ID under `.apnaGit/commits`, and stores a commit message and timestamp.
- `push` — **Pushes all local commits** (files + commit metadata) to `AWS S3`, using the structure `commits/COMMIT_ID/`.
- `pull` — **Pulls all commits from AWS S3**, reconstructing directories and files into local `.apnaGit`.
- `revert <commitID>` — **Restores your repository state to a specific commit** by pulling from `AWS S3`.

### **How to use**

From the backend directory, run:
node index.js init # create a new local repo (.apnaGit)
node index.js add path/to/file.txt # stage a file
node index.js commit "my commit" # commit staged files with a message
node index.js push # push all commits to S3
node index.js pull # sync local commits with S3
node index.js revert <commitID> # revert to an earlier commit by ID

#### **Command Descriptions**

- **init:**  
  Creates a `.apnaGit` directory, a `commits` subdir for your version history, and configures S3 bucket settings.
- **add:**  
  Stages any file into `.apnaGit/staging` for commit.
- **commit:**  
  Saves all staged files into a unique commit folder, and logs the commit message and date as `commit.json`.
- **push:**  
  Uploads all commit folders/files to your S3 bucket.
- **pull:**  
  Downloads all commit folders/files from S3 to local `.apnaGit/commits`.
- **revert:**  
  Restores repository state from S3 for a specific commit.

---

## 👩‍💻 Author

- [PREM KUMAR DUDI](https://github.com/PREMKUMARDUDI)

---

## 🙏 Acknowledgments

- Inspired by [GitHub](https://github.com)
- Thanks to open-source libraries and community
