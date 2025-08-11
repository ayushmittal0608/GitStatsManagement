# GitStats
GitStats is a tool designed to:

- 📊 Collect and analyze Git repository data such as name, description, files, and default branches.

- 🧠 Provide actionable insights into team productivity, auto review, and line of code.

- 🛠️ Integrate with Git hosting platforms like GitHub or GitLab to enhance reporting with pull request and issue data.

# Core Technologies
1. Version Control & Data Source
- Git: The foundational system for tracking code changes.

- GitHub/GitLab APIs: For accessing metadata like name, description, default branch, and line of code.

2. Backend Development
- Node.js: Useful for building REST APIs and routes.

3. Frontend & Visualization (Used Technologies)
- React.js
  - Core library for building dynamic and component-based user interfaces.

  - Enables reusable UI components for filters, buttons, and data cards.

- Vite
  - Fast build tool and development server optimized for modern frameworks like React.

  - Offers lightning-fast hot module replacement (HMR) and minimal config.

  - Great for TypeScript support and scalable frontend architecture.

- TypeScript
  - Adds static typing to JavaScript, improving code quality and maintainability.

  - Helps catch bugs early and provides better IDE support for large-scale projects.

4. DevOps & Automation
- Docker: For containerizing the app.

5. Authentication & Security
- OAuth: For secure GitHub/GitLab integration.

6. Environment Variables
- Environment variables allow you to:
  - Keep credentials out of version control.
  - Easily switch between development, staging, and production environments.
  - Integrate securely with OAuth providers like GitHub, Gitlab, etc.
 
# Project Setup
1. Build the docker image
```bash
docker-compose build
```
2. Start the container
```bash
docker-compose up
```
# Environment Variables Setup
Backend
```bash
PORT = your-port
GITHUB_CLIENT_ID = your-github-client-id
GITHUB_CLIENT_SECRET = your-github-client-secret
GITLAB_CLIENT_ID = your-gitlab-client-id
GITLAB_CLIENT_SECRET = your-gitlab-client-secret
```
Frontend
```bash
VITE_GITHUB_CLIENT_ID = your-github-client-id
VITE_GITLAB_CLIENT_ID = your-gitlab-client-id
```

### **Usage**
```markdown
## 📦 Usage

- Log in with GitHub or Gitlab
- Select a repository
- View stats and info
