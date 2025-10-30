# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/cca692a3-300d-4c58-82e5-f9064fdb0416

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cca692a3-300d-4c58-82e5-f9064fdb0416) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Auth backend (Node.js) - How to run

1. Install frontend deps (once):

```sh
npm i
```

2. Install and run the auth server:

```sh
cd server
npm i
npm run dev
```

This starts the server at `http://localhost:3001` with a SQLite DB file `auth.sqlite` in the `server` folder.

3. In a separate terminal, run the frontend from the project root:

```sh
npm run dev
```

The Vite dev server (port 8080) proxies API calls from `/api/*` to the auth server.

### Auth endpoints

- POST `/api/auth/signup` `{ email, password, name? }`
- POST `/api/auth/login` `{ email, password }`
- GET `/api/auth/me`
- POST `/api/auth/logout`

Auth uses httpOnly cookies with JWT. For production set `JWT_SECRET` and `CLIENT_ORIGIN` env vars in the server process and enable `secure` cookies.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cca692a3-300d-4c58-82e5-f9064fdb0416) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
