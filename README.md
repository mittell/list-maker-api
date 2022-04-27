<div align="center">

# List Maker API
A Node based API for a simple List Maker Web App. ***(Link Coming Soon!)***

</div>

<div align="center">
  
| Metric | Prod | Dev |
| ----------- | ----------- | ----------- |
| CircleCI Build | ![CircleCI Build](https://img.shields.io/circleci/build/github/mittell/list-maker-api/main?style=for-the-badge) | ![CircleCI Build](https://img.shields.io/circleci/build/github/mittell/list-maker-api/dev?style=for-the-badge)
| SonarCloud Tech Debt | ![SonarCloud Tech Debt](https://img.shields.io/sonar/tech_debt/mittell_list-maker-api/main?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge) | ![SonarCloud Tech Debt](https://img.shields.io/sonar/tech_debt/mittell_list-maker-api/dev?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)
| Libraries.io Dependency Status | ![Libraries.io Dependency Status](https://img.shields.io/librariesio/github/mittell/list-maker-api?style=for-the-badge) | ![Libraries.io Dependency Status](https://img.shields.io/librariesio/github/mittell/list-maker-api?style=for-the-badge)
| GitHub Monthly Commits | ![GitHub Commits Current Month](https://img.shields.io/github/commit-activity/m/mittell/list-maker-api/main?style=for-the-badge) | ![GitHub Commits Current Month](https://img.shields.io/github/commit-activity/m/mittell/list-maker-api/dev?style=for-the-badge)
| GitHub Last Commit | ![GitHub Last Commit](https://img.shields.io/github/last-commit/mittell/list-maker-api/main?style=for-the-badge) | ![GitHub Last Commit](https://img.shields.io/github/last-commit/mittell/list-maker-api/dev?style=for-the-badge)
| Uptime Robot Status | ![Uptime Robot Status](https://img.shields.io/uptimerobot/status/m791536380-eec0a09b56acf8692734c5f4?style=for-the-badge) | ![Uptime Robot Status](https://img.shields.io/uptimerobot/status/m791502394-4d51bc3f23871b2ec5cc2329?style=for-the-badge) |

</div>

## About

A companion server-side application to my List Maker App. ***(Link Coming Soon!)***

Built using Node and TypeScript, integrating Clean Architecture ideas, and services for Code Analysis, Commit Linting, Error Logging, CI/CD, and Cloud Hosting.

## Technologies

The List Maker API is currently being built and deployed with the following technologies:

-   [Node.js](https://nodejs.org/)
-   [Express](https://expressjs.com/)
-   [Mongoose](https://mongoosejs.com/)
-   [MongoDB](https://www.mongodb.com/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Sentry](https://sentry.io/)
-   [SonarCloud](https://sonarcloud.io/)
-   [CircleCI](https://circleci.com/)
-   [Heroku](https://www.heroku.com/)

## Getting Started

Clone this repo, and make sure to run the commands mentioned below from your terminal within the root project directory.

### Prerequisites

Make use Node.js is installed, and npm is up to date:

    npm@latest -g

Run the provided setup script:

    npm run setup

Created a .env file in the project root, and make sure the following keys are added:

    PORT=<Add Port Number>
    SENTRY_URL=<Add Sentry url in "quotes">
    NODE_ENV=<Add environment in "quotes">
    MONGO_URL=<Add MongoDB path/url in "quotes">

Run and debug the application with the dev script:

    npm run dev

Build and run the compiled version with the build and start scripts:

    npm run build
    npm run start

## Roadmap

-   [x] Setup Basic API with linting for TypeScript and commit messages
-   [x] Setup CI/CD with CircleCI and Heroku
-   [x] Integrate SonarCloud and commitlint into CI/CD process
-   [x] Integrate Sentry
-   [x] Setup MongoDB and Mongoose
-   [x] Create List Interface, DAO, Service, Controller, and Routing
-   [x] Create ListItem Interface, DAO, Service, Controller, and Routing
-   [x] Add Global Error Handling
-   [x] Update Controller Request/Response structure
-   [x] Create User Interface, DAO, Service, Controller, and Routing
-   [ ] Add Request Data Validation Middleware
-   [ ] Add Request/Response DTOs
-   [ ] Add User Password Generation/Comparison Logic
-   [ ] Add Request Authentication Middleware
-   [ ] Add JWT Middleware and Authentication Integration
 
## Contact

Feel free to find and contact me at the following:

[![Twitter](https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white)](https://twitter.com/CMittell)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/chris-mittell/)

</div>
