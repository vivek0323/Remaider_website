
# 🧠 Gentle Reminder App

A simple and elegant web application to create, view, and manage reminders — built with **React**, **TypeScript**, and **Tailwind CSS**. This app is perfect for staying organized and remembering tasks on time.

---

## 📌 Features

- ✅ Add custom reminders with messages
- 📋 View your reminders in a clean list
- 🧹 Easily delete completed or expired reminders
- 🎨 Modern UI built with Tailwind and ShadCN components
- ⚡ Fast development with Vite and TypeScript

---

## 🛠 Tech Stack

- **Frontend Framework**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: ShadCN UI
- **Bundler**: Vite
- **Package Manager**: npm (or Bun)
- **State Handling**: React Hooks

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)
- Git (for cloning the repo)

### Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/your-username/gentle-reminder-api-main.git
cd gentle-reminder-api-main

# Install dependencies
npm install
# or use Bun
bun install

# Start the development server
npm run dev
# or
bun run dev
```

Open your browser and go to `http://localhost:5173` to view the app.

---

## 📁 Project Structure

```
gentle-reminder-api-main/
├── public/               # Static assets (favicon, images, etc.)
├── src/
│   ├── components/       # UI components (Header, Footer, ReminderForm, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Pages (Index, NotFound)
│   ├── services/         # API calls and reminder logic
│   ├── types/            # TypeScript interfaces
│   └── App.tsx           # Root App component
├── index.html            # HTML template
├── tailwind.config.ts    # TailwindCSS configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Project metadata and scripts
```

---

## 🔧 Customization Tips

- Modify styles in `tailwind.config.ts` and `App.css`
- Add new pages in `src/pages`
- Extend the API logic in `src/services/messageService.ts`

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙌 Author

Built with ❤️ by [Your Name]

