# 🩺 Health Companion AI

A personalised health and diet web app that combines your active medicines, medical conditions, and allergies to generate safe, condition-aware meal plans powered by Google Gemini AI.

---

## Problem Statement

Managing your diet alongside multiple medicines and medical conditions is genuinely hard. Certain foods interact badly with common medications — grapefruit with statins, leafy greens with blood thinners, dairy with antibiotics — and conditions like diabetes, hypertension, or GERD add their own dietary restrictions on top. Most people have no easy way to track all of these rules at once, let alone get a meal plan that respects all of them simultaneously.

Health Companion AI solves this by acting as a personal dietary safety layer. Users log their active medicines and conditions once, and the app continuously surfaces food conflicts, safe choices, and AI-generated full-day meal plans that account for every constraint at once — no manual cross-referencing required.

---

## Features

- **Medicine Checker** — Search a database of medicines and see exactly which foods are safe, which to avoid, and which to use with caution.
- **Condition Guide** — Browse 30+ medical conditions (diabetes, hypertension, GERD, etc.) and get tailored dietary rules and recovery tips for each.
- **AI Meal Planner** — Generate a full-day meal plan (breakfast, lunch, dinner, snacks, hydration) personalised to your active medicines, conditions, and allergies using Gemini 1.5 Flash.
- **Dietary Alerts** — Dashboard warnings that surface food conflicts across all your active medicines and conditions at a glance.
- **User Profiles** — Firebase Authentication with per-user Firestore storage for saved medicines, conditions, allergies, and meal history.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| Routing | React Router v6 |
| State / Data | React Context + TanStack Query |
| Auth & DB | Firebase Authentication + Firestore |
| AI | Google Gemini 1.5 Flash API |
| Testing | Vitest + Testing Library |

---

## Project Structure

```
src/
├── components/         # Reusable UI components (cards, banners, nav)
│   └── ui/             # shadcn/ui primitive components
├── context/            # React contexts (AuthContext, HealthContext)
├── data/               # Static medicine and condition data (JS)
├── hooks/              # Custom hooks (useMedicine, useCondition, useMealPlan, useAuth)
├── lib/                # Shared utilities (cn helper)
├── pages/              # Route-level page components
│   ├── Dashboard.jsx
│   ├── MedicineChecker.jsx
│   ├── ConditionGuide.jsx
│   ├── AIMealPlanner.jsx
│   ├── Profile.jsx
│   ├── Login.jsx
│   └── Signup.jsx
├── services/           # External service clients
│   ├── firebase.js     # Firebase app, auth, Firestore
│   ├── geminiService.js# Gemini API meal plan generation
│   ├── conditionService.js
│   ├── medicineService.js
│   └── mealService.js
└── test/               # Vitest setup and example tests
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (or [Bun](https://bun.sh/))
- A [Firebase](https://console.firebase.google.com/) project with Authentication and Firestore enabled
- A [Google AI Studio](https://aistudio.google.com/) API key for Gemini

### Installation

```bash
git clone https://github.com/your-username/health-companion-ai.git
cd health-companion-ai
npm install        # or: bun install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Security note:** The Gemini API key is used directly from the browser during development. For production, proxy the Gemini API calls through a backend to avoid exposing the key in the JS bundle.

### Firebase Configuration

Update `src/services/firebase.js` with your own Firebase project credentials, or set them via environment variables:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

### Running Locally

```bash
npm run dev        # Start dev server at http://localhost:5173
```

### Building for Production

```bash
npm run build      # Output to /dist
npm run preview    # Preview the production build locally
```

### Running Tests

```bash
npm run test       # Run all tests once
npm run test:watch # Watch mode
```

---

## Key Pages

### Dashboard
Greets the user by name and shows active medicine/condition counts, food-conflict alerts for the day, and quick-action links to all features.

### Medicine Checker
Live search across the medicines database. Each result card shows safe foods (green), foods to avoid (red), and caution foods (amber). Medicines can be toggled on/off to build the user's active list.

### Condition Guide
Dropdown selection of 30+ conditions. Each condition card displays recommended foods, foods to avoid, relevant medicines, and dietary recovery tips. Conditions can be added to the active list to influence meal plan generation.

### AI Meal Planner
One-click generation of a personalised full-day meal plan. The Gemini prompt is automatically built from the user's active medicines, conditions, and profile allergies. The response includes breakfast, lunch, dinner, snacks, dietary warnings, and hydration guidance. Plans can be regenerated at any time.

### Profile
Manage personal details and allergy entries. Allergy data is stored per user in Firestore and fed directly into meal plan generation.

---

## ⚠️ Disclaimer

This app is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider before making changes to your diet or medication.
