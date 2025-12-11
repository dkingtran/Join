# Join - Kanban Project

## Description
Join is a Kanban-style task management tool designed to help teams organize their work, track progress, and manage contacts efficiently. It features a drag-and-drop board, task creation with subtasks, and a contact management system.

## Features
- **Kanban Board:** Visualize tasks in different states (To Do, In Progress, Await Feedback, Done).
- **Task Management:** Create, edit, and delete tasks with priorities, due dates, and assignees.
- **Contact Management:** Manage your team members and stakeholders.
- **Stakeholder Request System:** A special feature for stakeholders to request tasks via an automated n8n workflow.

## Demo
You can try the live demo here: [Insert Live Demo Link Here]

### How to use the Demo
1. **Log in:** Use the "Team Member Login" to access the full board features.
2. **Stakeholder Request:** On the landing page, choose "Create Request (Stakeholder)" to test the automated request system.
   - Note: There is a daily limit of 10 requests to prevent API overuse.
   - If the limit is reached, you will be guided to a manual email fallback.

## n8n Integration
This project uses n8n for backend automation.
- **Workflows:** The n8n workflow JSON files are located in the `n8n/` directory.
- **Functionality:** Handles incoming stakeholder requests and manages the daily request limit via Firebase.

## Setup
1. Clone the repository.
2. Open `index.html` in your browser or serve it via a local server.

