
Project Documentation: ifiwereyou -

Last Updated: 7/8/2025
Project Lead: Srihari Rai
Version: 1.0 - Core Functionality Complete

1. Core Concept & Ideology

ifiwereyou is a Collective Consciousness Simulator, designed as a sanctuary for thought. Its core ideology is to provide a safe, anonymous, and focused platform where users can explore the infinite possibilities of choice by sharing real-life dilemmas, creative prompts, or hypothetical scenarios. The goal is not to find a single "right" answer but to illuminate situations through a multitude of diverse perspectives, fostering empathy and deeper understanding. The platform's "Digital Soul, Neon Glow" aesthetic reinforces a feeling of a private, futuristic, and contemplative space.

2. Technology Stack

Front-End:

Framework: React

Routing: react-router-dom

API Calls: axios

Icons: lucide-react

Styling: Pure CSS with a custom-designed dark theme.

Back-End:

Runtime: Node.js & Express.js

Authentication: JSON Web Tokens (JWT) with jsonwebtoken & bcryptjs.

File Uploads: multer for handling, cloudinary for cloud storage.

Database:

Type: NoSQL (MongoDB with Mongoose ODM).

3. Back-End API Documentation (/api)
3.1. Authentication (/api/users)

POST /register: Creates a new user.

POST /login: Authenticates a user and returns a JWT.

GET /me: (Private) Returns the data of the currently logged-in user.

POST /upload-picture: (Private) Handles profile picture uploads via multipart/form-data.

GET /profile/:username: (Public) Returns a user's public profile data and their non-anonymous dilemmas.

3.2. Dilemmas (/api/dilemmas)

POST /: (Private) Creates a new dilemma.

GET /: (Public) Retrieves a list of all dilemmas. Can be filtered by ?category= or ?tag=.

GET /search: (Public) Searches dilemmas by text query (?q=...). Searches against title and story fields.

GET /top: (Public) Retrieves top 50 dilemmas sorted by the size of the interestedBy array.

GET /trending: (Public) Retrieves top 50 dilemmas sorted by the number of perspectives.

GET /new: (Public) Retrieves the 50 newest dilemmas.

GET /:id: (Public) Retrieves a single dilemma, fully populated with its author and all perspectives (including their authors).

PUT /:id: (Private) Edits a dilemma. (Authorization: Author only).

DELETE /:id: (Private) Deletes a dilemma. (Authorization: Author only).

PUT /interesting/:id: (Private) Toggles the current user's ID in the dilemma's interestedBy array.

3.3. Perspectives (/api/perspectives)

POST /:dilemmaId: (Private) Posts a new perspective on a dilemma.

PUT /:id: (Private) Edits a perspective. (Authorization: Author only).

DELETE /:id: (Private) Deletes a perspective. (Authorization: Author only).

PUT /star/:id: (Private) Toggles the current user's ID in the perspective's starredBy array.

PUT /best/:id: (Private) Toggles the isMarkedBest status of a perspective. (Authorization: Dilemma author only).

4. Front-End Architecture & Features
4.1. Global Systems

AuthContext: A global state manager for the entire application. It handles user state (user, token, isAuthenticated), loading states, and provides functions for login, logout, and register.

Routing (App.js): A sophisticated routing system that uses a parent MainLayout route to provide a consistent UI (Navbar, Sidebar) for all main content pages, while leaving auth pages (/login, /register) as standalone, immersive experiences.

API Client (axios): Configured with an interceptor (setAuthToken) to automatically attach the user's JWT to all outgoing requests.

4.2. Core Components & Pages

Navbar: A fully responsive, custom-designed header featuring the brand logo, primary navigation links, a functional search bar, and dynamic authentication buttons ("Login/Sign Up" vs "Profile/Logout").

LeftMenu: A collapsible sidebar for primary content discovery, allowing users to navigate between Home, Trending, Top, New, and all the "Worlds" (categories).

HomePage / CategoryPage / TagPage / SearchPage: A suite of pages that use a reusable DilemmaCard component to display lists of stories fetched from different API endpoints, providing a consistent browsing experience.

DilemmaPage: The core content-viewing page. It displays a full story and its metadata, an interactive sidebar, and a fully functional perspectives section where logged-in users can post, edit, delete, star, and mark comments as best. It features a React-based confirmation modal for delete actions.

Authentication Pages (LoginPage, RegisterPage): Beautifully designed, immersive, full-screen forms with field-level validation (both front-end and back-end) and user-friendly features like show/hide password.

Profile Pages (ProfilePage, AuthorPage):

A private, editable /profile page for the logged-in user to manage their profile, including profile picture uploads.

A public, read-only /author/:username page that showcases any user's public stories and information.

5. Future Implementation & Missed Features

While the core functionality is robust, several features were planned but not implemented. These represent the next steps for evolving the platform.

Real-time Notifications:

Requirement: When a user's dilemma gets a new perspective, or their perspective gets starred, a notification should appear in the navbar.

Implementation: Would require a new Notification model on the back-end and WebSockets (using a library like Socket.io) for real-time communication between the server and client.

Emotional Reactions on Dilemmas:

Requirement: The ability for users to add an emotional reaction (e.g., 'Inspired', 'Concerned') to a dilemma, as designed in the Dilemma model.

Implementation: Requires a new PUT /api/dilemmas/react/:id endpoint and front-end UI buttons in the DilemmaPage sidebar.

Advanced Sorting & Filtering:

Requirement: Allow users to sort feeds by "Most Interesting" or filter by multiple tags/categories at once.

Implementation: Requires more complex aggregation pipelines on the back-end and a more advanced filtering UI on the front-end.

"Writer's Block" Sub-categories:

Requirement: The SharePage form should show sub-category options (e.g., "Pitch an idea," "Continue this line") when a user selects "Writer's Block."

Implementation: Requires conditional rendering logic in the SharePage.js form component.

Pagination:

Requirement: Instead of loading only the top 50 stories, feeds should have "Load More" buttons or infinite scroll to handle thousands of posts.

Implementation: The API needs to be updated to accept page and limit query parameters. The front-end would need to manage page state and trigger new fetches on scroll or button click.

User Profile Stats:

Requirement: The public AuthorPage should display the total number of stars the user has received on all their perspectives.

Implementation: Requires a complex aggregation query on the back-end to go through all of a user's perspectives and sum the size of their starredBy arrays.