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
- [x] The assistant **posts review comments** directly on the user's PR.

## Features

- [ ] A **React frontend** for users to view and manage AI-generated analysis.

## Infrastructure

- [ ] **Deploy** the assistant on **AWS Lambda**.
- [ ] **Set up CI/CD** using **GitHub Actions** to automate deployments.  

## Progress Update: 13 Mar 2025

The Code Review AI Assistant can now review a pull request and post comments on the PR. Note that these comments are grouped per file. In future the aim is to post the comment at the relevant line in the source code.

<img width="985" alt="flakey_ai_screenshot" src="https://github.com/user-attachments/assets/6d302047-ed15-47df-a59a-de844934b493" />
