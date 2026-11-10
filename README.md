# TasteCraft — Final React + Vite project

## Run the project
1. Extract this ZIP.
2. Open the extracted `tastecraft-final` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:
   ```bash
   npm.cmd install
   npm.cmd run dev
   ```
5. Open the localhost URL shown in the terminal (usually http://localhost:5173).

## Admin login
- Email: `admin@tastecraft.com`
- Password: `admin123`

## Included features
- User registration and login
- Admin login and dashboard
- Starter recipe collection with food photography
- Add recipes with ingredients and cooking steps
- Search by recipe name or ingredients (comma-separated)
- Category filters
- Recipe details and ratings (one rating per account; can update)
- Favourite recipes
- Browser localStorage persistence

## Important storage limitation
This version stores accounts, recipes, ratings and favourites in the current browser's localStorage. Data remains after refresh on the same browser, but is NOT shared with other devices or browsers. Passwords are also demo-only and are not securely stored. For a real multi-user deployment, connect Firebase or Supabase with secure authentication and a shared database.
