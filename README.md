# GitNest

[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://main.dq1ol2kvxe1w3.amplifyapp.com/)

A modern GitHub-inspired platform for hosting, collaborating, and managing your code repositories.  
Built with React, Node.js, MongoDB, Express—and features a powerful backend **custom git command suite** that simulates local git commands (_`init`, `add`, `commit`, `push`, `pull`, `revert`, `terminate`_).

## 🚀 Features

- **Repository Management:** Create, update, browse, and delete repositories.
- **Issue Tracking:** Create, update, and manage issues for any repository.
- **Bulk Issue Deletion:** Delete all issues for a repository at once.
- **User Profiles:** View your profile, contributions, repositories and more.
- **Search & Suggestions:** Find your repositories and suggested repositories easily.
- **Authentication & Authorization:** Secure login/signup and access control for repositories and issues.
- **Custom Git Commands:** Work with repositories using `init`, `add`, `commit`, `push`, `pull`, `revert`, and `terminate`—integrated into the backend with
  `local storage` and `AWS S3` support.

### 🖥 Custom Git-like CLI Commands

The backend contains a _miniature git-like engine_ for local (server-side) repository simulation and `AWS S3` backup. It supports **user identity tracking** and **distributed version control** workflows (similar to real Git).
Commands are powered by [yargs](https://github.com/yargs/yargs), available when running Node directly.

#### **Available Commands**

- `start` — Starts the backend web server.
- `init` — **Initializes a new repository** and asks for your Name, Email, and S3 Bucket name to configure `.apnaGit/config.json`.
- `add <file>` — **Adds a file to the staging area** (copies your file into `.apnaGit/staging`).
- `commit <message>` — **Commits all staged files** to a new commit directory with a unique ID under `.apnaGit/commits` and Links the commit to the previous version (parent), stores a commit message and timestamp, and attaches the **Author** info from your config.
- `push` — **Pushes commits to S3.** Uploads local history to `AWS S3`, using the structure `commits/COMMIT_ID/` while _preserving_ your local copies (Distributed VCS style).
- `pull` — **Pulls all commits from AWS S3**, reconstructing directories and files into local `.apnaGit/commits`, finds the latest commit, updates `HEAD`, and **restores files to your working directory**.
- `revert <commitID|HEAD>` — **Restores your repository state to a specific commit**, the latest commit (`HEAD`), or the previous one (`HEAD~1`) by pulling from `AWS S3`.
- `terminate` — **Destructive Cleanup.** Permanently deletes the local `.apnaGit` repository AND wipes all associated data from the S3 bucket.

#### **How to use**

From the backend directory, run:

```bash

node index.js init                        # Interactive setup for a new local repo `.apnaGit`
node index.js add path/to/file.txt        # Stage a file
node index.js commit "Initial commit"     # Commit staged files with a message and author info
node index.js push                        # Push all commits to AWS S3
node index.js pull                        # Sync local commits with AWS S3 and update working files
node index.js revert HEAD                 # Discard local changes (reset to latest commit)
node index.js revert HEAD~1               # Go back to the previous commit
node index.js revert <commitID>           # Rollback to an earlier commit by ID
node index.js terminate                   # DANGER: Delete repo locally and on S3

```

#### **Command Descriptions**

- **init:**
  Creates `.apnaGit` structure and a `config.json` file. It prompts the user via the terminal to input their Name, Email, and preferred S3 Bucket to configure the repository.
- **add:**
  Stages a specific file into `.apnaGit/staging`, preparing it for the next commit.
- **commit:**
  Moves staged files to a unique commit folder. It reads `HEAD` to link to the parent commit (creating a history chain) and embeds the user identity from `config.json` into the commit metadata.
- **push:**
  Uploads all commit folders and files to the configured S3 bucket and keeps local data intact, allowing for offline history viewing.
- **pull:**
  Downloads all commits from S3 to local `.apnaGit/commits`. It then intelligently determines the latest commit based on timestamps, updates the `HEAD` pointer, and **automatically overwrites** the working directory files to match the latest state.
- **revert:**
  Restores the working directory to a specific state. Supports:
  - **`HEAD`**: Resets files to the latest commit (useful for discarding uncommitted changes).
  - **`HEAD~1`**: Reverts to the commit immediately before the current one.
  - **`<commitID>`**: Revert to a specific commit from the history.
- **terminate:**
  A cleanup utility that performs a recursive delete on the local `.apnaGit` folder **and** iterates through the S3 bucket to delete all remote objects. **Use with caution.**

## 🏗️ Architecture

### System Design

```

┌─────────────────┐      HTTP/REST API     ┌─────────────────┐
│   Frontend      │  ◄──────────────────►  │   Backend       │
│   (React)       │     (Axios Client)     │   (Node.js)     │
│   Dashboard     │                        │   REST API      │
└─────────────────┘                        └─────────────────┘
        │                                           │
        │                                           │
   ┌────▼────┐                                 ┌────▼────┐
   │ Amplify │                                 │ MongoDB │
   │ Hosting │                                 │Database │
   └─────────┘                                 └─────────┘

```

## 🛠️ Tech Stack

- **Frontend:** React (Hooks, Context), Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, bcrypt
- **Routing:** React Router
- **S3 Storage:** AWS S3 for remote backup of pushed files and folders
- **Git Engine:** Custom CLI commands built with yargs and Node’s fs module

## 📁 Project Structure

```bash

GitNest/
├── backend/                    # Node.js Express Server
│ ├── config/                   # Database and environment configurations
│ ├── controllers/              # Business logic handlers
│ │ ├── init.js                 # Repository initialization
│ │ ├── add.js                  # File staging operations
│ │ ├── commit.js               # Commit management
│ │ ├── push.js                 # Cloud synchronization
│ │ ├── pull.js                 # Remote updates
│ │ └── revert.js               # Version rollback
│ │ └── issueController.js      # Controllers for Issue
│ │ └── repoController.js       # Controllers for Repository
│ │ └── userController.js       # Controllers for User
│ ├── models/                   # Database schemas
│ │ ├── userModel.js            # User authentication model
│ │ ├── repoModel.js            # Repository data structure
│ │ └── issueModel.js           # Issue tracking system
│ ├── routes/                   # API endpoint definitions
│ │ └── main.router.js          # Central routing configuration
│ │ └── user.router.js          # User routes configuration
│ │ └── repo.router.js          # Repository routes configuration
│ │ └── issue.router.js         # Issue routes configuration
│ ├── index.js                  # Server entry point with CLI
│ ├── package.json              # Backend dependencies
│ └── .gitignore                # Git ignore rules
│
│── frontend/                   # React Application
│ ├── public/                   # Static assets
│ ├── src/                      # Source code
│ │ ├── assets/                 # Static resources
│ │ ├── components/             # Reusable UI components
│ │ │ ├── auth/                 # Authentication components
│ │ │ │ ├── Auth.jsx            # Authentication component
│ │ │ ├── dashboard/            # Main dashboard
│ │ │ │ ├── Dashboard.jsx       # User dashboard
│ │ │ ├── issue/                # Issue management
│ │ │ │ ├── AllIssues.jsx       # Issue listing
│ │ │ │ ├── CreateIssue.jsx     # Issue creation
│ │ │ │ ├── DeleteIssue.jsx     # Issue deletion
│ │ │ │ ├── IssueDetails.jsx    # Issue details
│ │ │ │ ├── NewIssue.jsx        # Issue creation
│ │ │ │ └── UpdateIssue.jsx     # Issue updates
│ │ │ ├── navbar/               # User management
│ │ │ │ └── Navbar.jsx          # Navigation component
│ │ │ ├── notFound/             # Not Found page
│ │ │ │ └── NotFound.jsx        # 404 error page
│ │ │ ├── repo/                 # Repository management
│ │ │ │ ├── CreateRepo.jsx      # Repository creation
│ │ │ │ ├── DeleteRepo.jsx      # Repository deletion
│ │ │ │ ├── RepoDetails.jsx     # Repository details
│ │ │ │ └── UpdateRepo.jsx      # Repository updates
│ │ │ ├── user/                 # User management
│ │ │ │ └── Profile.jsx         # User profile
│ │ ├── authContext.jsx         # Authentication context
│ │ └── index.css               # Global styles
│ │ ├── main.jsx                # React entry point
│ │ ├── Routes.jsx              # Application routing
│ │ ├── serverConfig.jsx        # Backend Server configuration
│ └── .gitignore                # Git ignore rules
│ ├── eslint.config.js          # ESLint configuration
│ ├── index.html                # HTML template
│ ├── package-lock.json         # Frontend dependencies lock
│ ├── package.json              # Frontend dependencies
│ ├── vite.config.js            # Vite build configuration
└──README.md

```

## 🔌 API Endpoints

### Authentication

- `POST /signup` - User registration with profile creation
- `POST /login` - User authentication with JWT token generation

### Profile Management

- `GET /allUsers` - Fetch all users
- `GET /userProfile` - Fetch userProfile data for authenticated user
- `PUT /updateProfile` - Update userProfile data for authenticated user
- `DELETE /deleteProfile` - Delete userProfile data for authenticated user

### Repository Management

- `POST /repo/create` — Create a repository for authenticated user
- `GET /repo/all` — Get all repositories
- `GET /repo/:id` — Get repository by ID
- `GET /repo/name/:name` — Get repository by Username
- `GET /repo/user` — Get all repositories for authenticated user
- `PUT /repo/update/:id` — Update a repository by ID for authenticated user
- `PATCH /repo/toggle/:id` — Update visibility for repository by ID for authenticated user
- `DELETE /repo/delete/:id` — Delete a repository by ID (also deletes its issues) for authenticated user

### Issue Management

- `POST /issue/create/:repoID` — Create an issue for a repository for authenticated user
- `GET /issue/:id` — Get a single issue by ID
- `GET /issue/all` — List all issues
- `GET /issue/all/:repoID` — List all issues for a repository
- `GET /issue/user` — List all issues for authenticated user
- `PUT /issue/update/:id` — Update an issue by ID for authenticated user
- `DELETE /issue/delete/:id` — Delete a single issue by ID for authenticated user
- `DELETE /issue/delete/all/:repoID` — Delete all issues for a repository of authenticated user

## 📊 Database Schema

### User Model

```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  repositories: [Schema.Types.ObjectId (ref: "Repository")]
}
```

### Repository Model

```javascript
{
  name: String (required),
  description: String,
  content: [],
  visibility: Boolean,
  owner: Schema.Types.ObjectId (ref: "User"),
  issues: [Schema.Types.ObjectID (ref: "Issue")]
}
```

### Issue Model

```javascript
{
  title: String (required),
  description: String (required),
  status: String (enum: ["open", "closed"],),
  owner: Schema.Types.ObjectId (ref: "User"),
  repository: Schema.Types.ObjectId (ref: "Repository"),
}
```

## 🌐 Deployment

The application's frontend is deployed on **AWS Amplify** with its backend deployed on **Render** platform:

- **Frontend**: `https://main.dq1ol2kvxe1w3.amplifyapp.com/`
- **Backend API**: `https://gitnest-sh8l.onrender.com`

### Deployment Configuration

- **Platform**: AWS Amplify & Render
- **Build Process**: Automatic deployment from GitHub
- **Environment**: Production-ready with environment variables
- **CORS**: Configured for cross-origin requests between services

## 🧪 Testing & Quality

### Code Quality

- **Error Handling**: Comprehensive try-catch blocks and error middleware
- **Input Validation**: Server-side validation for all user inputs
- **Security**: JWT authentication, password hashing, CORS configuration
- **Code Structure**: Modular design with separation of concerns

### Performance Optimizations

- **Database**: Indexed queries for improved performance
- **Caching**: Strategic use of React Context for state management
- **Bundle Size**: Optimized dependencies and code splitting

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
