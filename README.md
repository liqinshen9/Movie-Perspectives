 # Movie-Perspectives

Movie Perspectives is a full‑stack project built with a React + TypeScript front end and a .NET 8.0 backend with a SQL database. Inspired by my passion for films and storytelling, this web application serves as a practical project for NZMSA 2025 Phase 2 — it allows users to explore movies, post reviews, discuss their favorite moments, and share their individual perspectives.
Demo: Please watch the walkthrough video here.


## Prerequisites
.NET 8.0 SDK

Node.js & npm

SQL Server (local or remote)

## Cloning the Repository to your local machine
git clone https://github.com/liqinshen9/Movie-Perspectives.git
cd Movie-Perspectives

## Backend Setup
cd Backend

### Configure your database
Edit appsettings.json and set your connection string under ConnectionStrings:DefaultConnection.

### Enable EF Core
In Program.cs, make sure your SQL Server line is active:

builder.Services.AddDbContext<MovieContext>(options =>
  options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

### Apply migrations & seed data
dotnet ef migrations add InitialCreate

dotnet ef database update

### run the backend server
dotnet run

## Frontend Setup
cd Frontend

### Install the necessary packages and Material-UI dependencies
npm install

### Start the frontend development server
npm run dev

The dev server will start (by default) at http://localhost:5173.

### Accessing the App
Open your browser to the URL shown in your terminal (e.g. http://localhost:5173).

## Advanced Features
Theme Toggle (Dark/Light) via React Context & CSS variables

Unit Testing components (Vitest + React Testing Library)

End‑to‑End Testing components (Cypress)

## Running Tests
### Unit Tests
cd Frontend

npm test

### End‑to‑End (Cypress)
cd Frontend

npm run cypress:open


Thank you for exploring Movie Perspectives!
Feel free to dive into the Frontend/README.md and Backend/README.md for more in‑depth documentation on architecture and endpoints.
