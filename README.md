 # Movie-Perspectives

Movie Perspectives is a full‑stack project built with a React + TypeScript front end and a .NET 8.0 backend with a SQL database. Inspired by my passion for films and storytelling, this web application serves as a practical project for NZMSA 2025 Phase 2 — it allows users to explore movies, post reviews, discuss their favorite moments, and share their individual perspectives.

Demo: Please watch the walkthrough video here: https://drive.google.com/file/d/18_6gK08P0U21WKqhgeejaEYwNCXM-Xfg/view?usp=sharing

Movie Perspectives follows the “networking” theme by making it easy to connect with others: you can follow fellow movie fans to build your own circle, send one‑on‑one messages in chat, share contact details only with people you trust, and start threaded talks under each film. These social features turn the app from a simple movie database into a lively space where people share unique thoughts about movies, talk about favourites, and grow their network around their love of movies.


## Prerequisites (Please download the following prior to running the app)
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

Here is a screenshot of the azure SQL database I am using. 
<img width="1892" height="962" alt="image" src="https://github.com/user-attachments/assets/45c70be2-fbfc-4010-ac55-5ba7a7d348f1" />


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
<img width="1880" height="905" alt="image" src="https://github.com/user-attachments/assets/ddcba00e-de95-4a26-82cf-347a839948b7" />
<img width="1916" height="907" alt="image" src="https://github.com/user-attachments/assets/e6344c7d-a98d-401e-a140-5fff5ca3561e" />

Unit Testing components (Vitest + React Testing Library)

End‑to‑End Testing components (Cypress)

## Running Tests
### Unit Tests
cd Frontend

npm test

### End‑to‑End Tests (Cypress)
cd Frontend

npm run cypress:open


Thank you for exploring Movie Perspectives!
