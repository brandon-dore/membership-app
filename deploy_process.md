# Deployment Guide

## Deploying UI + API

In its current state the API servers the raw static files on the root path, it also handles all CRUD operations.
The deployment of this uses PM2 and express static serving.

---

To ensure the most up to date version of the UI is served:

1.  `cd frontend`
2.  `npm run build`
3.  Copy the "/dist" folder to the "/api" folder
4.  `cd ../api`
5.  `npm run start`
6.  Check UI version is up to date

---

To then host the server (and run on startup) using PM2

1.  `npm install pm2 -g`
2.  Use https://github.com/jessety/pm2-installer to setup on PM2 on startup (for windows)
3.  `cd api`
4.  `pm2 start index.js`

## Deplyoing Database

This project uses Postgresql to manage the SQL. Please install Postresql and run the create.sql script.
