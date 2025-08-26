# GitNest

[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://main.dq1ol2kvxe1w3.amplifyapp.com/)

A modern GitHub-inspired platform for hosting, collaborating, and managing your code repositories.  
Built with React, Node.js, MongoDB, Express—and features a powerful backend **custom git command suite** that simulates local git commands (_`init`, `add`, `commit`, `push`, `pull`, `revert`_).

## 🚀 Features

- **Repository Management:** Create, update, browse, and delete repositories.
- **Issue Tracking:** Create, update, and manage issues for any repository.
- **Bulk Issue Deletion:** Delete all issues for a repository at once.
- **User Profiles:** View your profile, contributions, repositories and more.
- **Search & Suggestions:** Find your repositories and suggested repositories easily.
- **Authentication & Authorization:** Secure login/signup and access control for repositories and issues.
- **Custom Git Commands:** Work with repositories using `init`, `add`, `commit`, `push`, `pull`, and `revert`—integrated into the backend with
  `local storage` and `AWS S3` support.

## 🏗️ Architecture

### System Design

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│   Frontend      │ ◄──────────────────►│   Backend       │
│   (React 19)    │    (Axios Client)   │   (Node.js)     │
└─────────────────┘                     └─────────────────┘
        │                                        │
        │                                        │
   ┌────▼────┐                              ┌────▼────┐
   │ Amplify │                              │ MongoDB │
   │ Hosting │                              │Database │
   └─────────┘                              └─────────┘
```

## 🛠️ Tech Stack

- **Frontend:** React (Hooks, Context), CSS Modules
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, bcrypt
- **Routing:** React Router
- **S3 Storage:** AWS S3 for remote backup of repo objects
- **Git Engine:** Custom CLI commands built with yargs and Node’s fs module

## 📁 Project Structure

```
GitNest/
├── backend/                            # Node.js Express Server
│   ├── config/                         # Database and environment configurations
│   ├── controllers/                    # Business logic handlers
│   │   ├── init.js                     # Repository initialization
│   │   ├── add.js                      # File staging operations
│   │   ├── commit.js                   # Commit management
│   │   ├── push.js                     # Cloud synchronization
│   │   ├── pull.js                     # Remote updates
│   │   └── revert.js                   # Version rollback
│   │   └── issueController.js          # Controllers for Issue
│   │   └── repoController.js           # Controllers for Repository
│   │   └── userController.js           # Controllers for User
│   ├── models/                         # Database schemas
│   │   ├── userModel.js                # User authentication model
│   │   ├── repoModel.js                # Repository data structure
│   │   └── issueModel.js               # Issue tracking system
│   ├── routes/                         # API endpoint definitions
│   │   └── main.router.js              # Central routing configuration
│   ├── index.js                        # Server entry point with CLI
│   ├── package.json                    # Backend dependencies
│   └── .gitignore                      # Git ignore rules
│
│── frontend/                           # React Application
│   ├── public/                         # Static assets
│   │   └── index.html                  # HTML template
│   ├── src/                            # Source code
│   │   ├── components/                 # Reusable UI components
│   │   │   ├── auth/                   # Authentication components
│   │   │   │   ├── Login.jsx           # User login interface
│   │   │   │   ├── Signup.jsx          # User registration
│   │   │   │   └── auth.css            # Authentication styles
│   │   │   ├── repo/                   # Repository management
│   │   │   │   ├── CreateRepo.jsx      # Repository creation
│   │   │   │   ├── DeleteRepo.jsx      # Repository deletion
│   │   │   │   ├── RepoDetails.jsx     # Repository details
│   │   │   │   └── UpdateRepo.jsx      # Repository updates
│   │   │   │   └── auth.css            # Authentication styles
│   │   │   ├── issue/                  # Issue management
│   │   │   │   ├── CreateIssue.jsx     # Issue creation
│   │   │   │   ├── DeleteIssue.jsx     # Issue deletion
│   │   │   │   ├── IssueDetails.jsx    # Issue details
│   │   │   │   └── UpdateIssue.jsx     # Issue updates
│   │   │   ├── dashboard/              # Main dashboard
│   │   │   │   ├── Dashboard.jsx       # User dashboard
│   │   │   │   └── dashboard.css       # Dashboard styles
│   │   │   ├── user/                   # User management
│   │   │   ├── Navbar.jsx              # Navigation component
│   │   │   └── NotFound.jsx            # 404 error page
│   │   ├── assets/                     # Static resources
│   │   ├── Routes.jsx                  # Application routing
│   │   ├── authContext.jsx             # Authentication context
│   │   ├── serverConfig.jsx            # Backend Server configuration
│   │   ├── main.jsx                    # React entry point
│   │   └── index.css                   # Global styles
│   ├── vite.config.js                  # Vite build configuration
│   ├── eslint.config.js                # ESLint configuration
│   ├── package.json                    # Frontend dependencies
│   └── .gitignore                      # Git ignore rules
└──README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /signup` - User registration with profile creation
- `POST /login` - User authentication with JWT token generation

### Profile Management

- `GET /userProfile/:id` - Fetch user and profile data by ID
- `GET /allUsers` - Fetch all users
- `PUT /updateProfile/:id` - Update user information by ID
- `DELETE /deleteProfile/:id` - Delete user by ID

### Repository Management

- `POST /repo/create` — Create a repository
- `GET /repo/all` — Get all repositories
- `GET /repo/:id` — Get repository by ID
- `GET /repo/name/:name` — Get repository by Username
- `GET /repo/user/:userID` — Get repository by userID
- `PUT /repo/update/:id` — Update a repository by ID
- `PATCH /repo/toggle/:id` — Update visibility for repository by ID
- `DELETE /repo/delete/:id` — Delete a repository by ID (also deletes its issues)

### Issue Management

- `POST /issue/create/:repoID` — Create an issue for a repository
- `GET /issue/:id` — Get a single issue by ID
- `GET /issue/all/:repoID` — List all issues for a repository
- `PUT /issue/update/:id` — Update an issue by ID
- `DELETE /issue/delete/:id` — Delete a single issue by ID
- `DELETE /issue/delete/all/:repoID` — Delete all issues for a repository

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

## 👩‍💻 Author

**Prem Kumar Dudi**

- GitHub: [@PREMKUMARDUDI](https://github.com/PREMKUMARDUDI)
- LinkedIn: [Connect with me](https://linkedin.com/in/dudipremkumar)

## 🙏 Acknowledgments

- Inspired by [GitHub](https://github.com)
- Thanks to open-source libraries and community

---

⭐ **Star this repository if you found it helpful!**

_Built with ❤️ for the open-source community_
