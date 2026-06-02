# 🟩 Syncrix CRM — Independent Freelance CRM Workspace

[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com)
[![Software License](https://img.shields.io/badge/License-MIT-417E5A?style=flat-square)](LICENSE)

**Syncrix** is a visually crafted, zero-latency CRM workspace designed specifically for freelancers, consultants, and boutique agencies. It simplifies lead nurturing, client data mapping, and pipeline value visualization into a streamlined single-page workflow—eliminating the weight and setup issues of bloated enterprise suites.

---

## 💎 The Real-World Problem & Solution

### The Friction
Modern freelancers are forced to choose between two extremes:
* **Manual spreadsheet tracking:** Hard to maintain, lacks visual hierarchy, has no pipeline intelligence, and leads to valuable leads falling through the cracks.
* **Bloated Enterprise CRMs:** High costs, intrusive subscription tiers, complicated integration steps, and features that require hours of setup.

### The Solution: Syncrix
Syncrix provides a lightweight, focused, static CRM dashboard. Running directly on a fast local state machine, Syncrix lets you map clients, monitor sales funnels, and observe analytic revenue trajectories within seconds of loading. There are zero database keys or API dependencies required out of the box.

---

## 🛠 Features Matrix

* **📈 Live Performance Dashboard:** Get immediate feedback on active pipeline counts, average conversion rates, closed-won values, and detailed real-time event logs tracking workspace updates.
* **👥 Contact Directory Matrix:** Dynamic fields mapping email, company, telephone, and lead status. Features quick search filters and a modal-based edit workflow.
* **📂 Deals Kanban & Pipeline Tracker:** Visualise deal funnels through structured vertical pipeline stages. Easily move leads from "New Lead" to "Contract Won" with instantly recalculated value metrics.
* **📊 Analytics Center:** Responsive metric charts illustrating monthly pipelines and won revenues to help you easily forecast upcoming earnings.
* **⚙️ Sandbox Preference Controls:** Reset settings to a clean workspace, customize profile attributes, and review CRM system records in real time.

---

## ⚙️ Local Installation Guide

Get Syncrix up and running on your local machine in under two minutes:

### 1. Prerequisites
Ensure you have the following installed on your system:
* **Node.js** (v18.0.0 or higher is recommended)
* **NPM** (v9.0.0 or higher)

### 2. Setup Repository
Clone the repository and jump into the workspace directory:
```bash
git clone https://github.com/dikshitsoni/Syncrix.git
cd Syncrix
```

### 3. Install NPM Dependencies
Install the required design and state engine libraries:
```bash
npm install
```

### 4. Run Development Server
Boot up the fast local development server:
```bash
npm run dev
```
Open your browser and navigate to: **`http://localhost:3000`**

---


## 🔮 Strategic Roadmap (Future Scope)

Take Syncrix farther with these recommended production-ready expansions:

* **🔄 Phase 1: Real-time Cloud Auth & Sync**
  Build in Firebase Firestore and Authentication to introduce secure cloud-based multi-user workspace accounts, instant synchronization across teammate devices, and secure write privilege limits.
* **💳 Phase 2: Invoicing & Subscription Hooks**
  Connect Stripe or PayPal API webhooks to generate one-click customized HTML invoices automatically when deal cards are marked as "Contract Won."
* **📅 Phase 3: Calendering Interfacing**
  Configure Google Calendar or Cal.com OAuth redirects inside contacts matrix pipelines so pitch calls, meeting notes, and upcoming follow-up milestones synchronize straight to your personal calendar.

---

## 📝 License

Distributed under the **MIT License**. Check out `LICENSE` for more detailed information.
