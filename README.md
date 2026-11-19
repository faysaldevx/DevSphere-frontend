<div align="center">

# 🌍 DevSphere

### Connecting People, Inspiring Progress

A community-driven platform where people create, discover and join local social service events, from winter clothes distribution to tree plantations and neighbourhood cleanups.

</div>

---

## 📖 About

**DevSphere** helps volunteers find social development events in their area and helps organizers bring people together. Anyone can browse upcoming events and read the details. After logging in, users can create their own events, join others' events, and manage everything from their personal dashboard.

**Example events:**
- Winter Clothes Distribution – Mirpur 10, Dhaka
- Blanket Distribution for the Needy – Mohammadpur, Dhaka

---

## ✨ Key Features

- 🔐 **Secure Authentication** – Register and log in with email and password, or continue with Google, powered by BetterAuth with a MongoDB adapter.
- 📝 **Create Events** – Logged-in users can publish events with a title, description, type, cover image, location and a future date, with a live preview while typing.
- 📅 **Upcoming Events Only** – The public events page shows only events whose dates have not passed, with type filters and search by title or location.
- 🤝 **Join Events** – Users join an event with one click. The volunteer is saved with the event in the database, and duplicate joins are blocked.
- 🛠️ **Manage Your Events** – Organizers can update or delete only the events they created, with a confirmation before deleting.
- 📌 **Joined Events Dashboard** – A private page that lists every event the user has joined, sorted by event date.
- 🌗 **Light / Dark Theme** – A theme toggle in the navbar switches the whole site, and the choice is remembered.
- 🛡️ **Protected Routes & JWT** – Private pages are guarded on the server, and private API requests are verified with JWT.
- 📱 **Fully Responsive** – Works on mobile, tablet and desktop.

---

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | Next.js (App Router), React, Tailwind CSS |
| **Authentication** | BetterAuth, MongoDB Adapter, JWT, Google OAuth |
| **Backend** | Express.js, MongoDB |
| **UI Feedback** | React Hot Toast, SweetAlert2 |
| **Hosting** | Vercel |

---

## 🗺️ Pages

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Home: banner, features, 6 upcoming events, gallery, newsletter |
| `/events` | Public | All upcoming events with filter and search |
| `/events/:id` | Public | Event details (login required to join) |
| `/login` · `/register` | Public | Authentication pages |
| `/create-event` | Private | Create a new event |
| `/manage-events` | Private | Update or delete your own events |
| `/joined-events` | Private | Events you have joined |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/devsphere-client.git
cd devsphere-client
npm install
```

### 2. Add environment variables

Create a `.env` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_random_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> ⚠️ Never commit your `.env` file. Make sure it is listed in `.gitignore`.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The Express server must also be running on port `8000`.

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── (auth)/login · register
│   ├── api/auth/[...all]
│   ├── events/ · events/[id]/
│   ├── create-event/
│   ├── manage-events/
│   ├── joined-events/
│   ├── layout.js · page.js · globals.css
├── components/   Navbar, Footer, Hero, Features, EventCard, EventForm, ...
├── lib/          auth.js, auth-client.js, api.js
└── proxy.js      protects private routes
```

---

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- Email: your-email@example.com

---

<div align="center">

Made with 💚 for communities that show up for each other.

</div>
