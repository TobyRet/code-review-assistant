# Code Review AI Assistant

## Description

🚧 *Work in progress* 🚧

This project is a **Code Review AI Assistant** that helps developers improve their code quality.  
The assistant analyzes code, providing feedback on **code quality, style, and best practices**.  
It also suggests improvements and recommendations to fix detected issues.

## How It Works

- [x] User sets up a **GitHub webhook** to send a `POST` request to the assistant's server.
- [x] The assistant receives the webhook and **forwards the PR diff** to OpenAI for analysis.
- [x] OpenAI returns the **code review analysis** to the assistant.
- [ ] The assistant **posts review comments** directly on the user's PR.

## Features

- [ ] A **React frontend** for users to view and manage AI-generated analysis.

## Infrastructure

- [ ] **Deploy** the assistant on **AWS Lambda**.
- [ ] **Set up CI/CD** using **GitHub Actions** to automate deployments.  
