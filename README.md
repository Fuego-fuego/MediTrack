# 🏥 MediTrack

> A modern patient records management interface built with Vanilla JavaScript.

MediTrack is a CRUD application designed to demonstrate **real-world frontend engineering skills**—including asynchronous data handling and form validation.

---

## ✨ Highlights  #TODO

* ⚡ Full CRUD operations with persistent data (JSON Server)
* 🔄 Asynchronous API handling using the Fetch API
* 🧠 Real-time, user-friendly form validation
* 🔍 Search, filtering, and sorting capabilities
* 🌓 Light/Dark mode with localStorage persistence
* 🔔 Toast notifications for feedback
* ⏳ Loading states and robust error handling 
* ✏️ Inline editing for seamless UX
* 🖥️ Responsive UI design

---

## 🛠️ Tech Stack

| Technology  | Purpose                         |
| ----------- | ------------------------------- |
| HTML5       | Structure                       |
| CSS3        | Styling (custom properties, UI) |
| JavaScript  | Logic (DOM, state, events)      |
| Fetch API   | Async data handling             |
| JSON Server | Mock REST API                   |
| Vite        | Development tooling             |

---

## 🧠 Key Engineering Concepts

* DOM manipulation (no frameworks)
* API abstraction and reusable services
* State management using Vanilla JS patterns
* UX-focused validation and feedback systems

---

## 📂 Project Structure #TODO

src/
├── api/
├── components/
├── modules/
├── utils/
├── styles.css
├── main.js
└── index.html

---

## ⚙️ Getting Started

```bash
# Install dependencies
npm install

# Start JSON Server from src/api
json-server --watch db.json --port 3000

# Run dev server
npm run dev
```

---

## 📸 Preview

Light & Dark mode UI with structured data tables and form interactions.

---

## 🌱 Branching Strategy

* main → production-ready code
* develop → integration branch
* feature/* → new features
* chore/* → setup & tooling
* fix/* → bug fixes

---

## 💬 Commit Convention

* feat: new feature
* fix: bug fix
* style: UI changes
* refactor: code improvements
* chore: setup/config

---

## 🎯 Why This Project Matters

This project demonstrates the ability to:

* Handle real-world data flows
* Design clean and intuitive user interfaces
* Write maintainable, production-style code


---

## 📜 License

MIT
