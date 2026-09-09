# FlexWare AI — The Intelligent Warehouse Operating System 🚀

![FlexWare AI Banner](frontend/public/hero-video.mp4) <!-- Replace with an actual screenshot or keep the video reference if supported -->

**FlexWare AI** is a next-generation Smart Warehouse Management System (WMS) built for the Flex India Hackathon. It transforms traditional, static warehouses into dynamic, AI-driven logistics hubs.

By integrating real-time inventory tracking, AI-powered predictive demand forecasting, and dynamic routing, FlexWare AI solves the most complex supply chain challenges—reducing picker travel time, preventing stockouts, and ensuring macro-level logistics resilience.

---

## 🏆 Key Features

### 1. 🤖 AI Command Center (Gemini Powered)
An immersive, full-screen AI assistant tailored for warehouse managers. 
* **Live System Context:** The AI is constantly aware of live inventory levels, active facilities, and critical stock.
* **Smart Actions:** Generate Purchase Orders (POs) automatically, analyze demand forecasts, or ask complex logistics questions using text or **voice commands**.
* **Rich Markdown Formatting:** AI responses render beautifully with tables, bullet points, and actionable data.

### 2. ⚡ SmartFlow: Dynamic Routing & Slotting
Say goodbye to static, inefficient picking routes.
* **2D Live Heatmap:** Visualizes the warehouse grid. Fast-moving items glow red, slow-moving items glow blue.
* **TSP Optimization:** The AI calculates the fastest possible pick path (Traveling Salesperson Problem) for any given order.
* **Live Simulation:** Generates a Route Stop Sequence instantly, drawing the exact path a warehouse picker should take to minimize travel time.

### 3. 📈 Demand AI & What-If Simulator
Forecast the future to prevent stockouts before they happen.
* **Time-Horizon Predictions:** See what products will move fastest Daily, Monthly, and Yearly.
* **Fast-Moving AI Ranking:** Products receive a "Demand Score" to dictate where they should be slotted (closer to dispatch vs. back of the warehouse).
* **Interactive What-If Simulator:** Drag a slider to simulate a sudden demand spike (e.g., +20% or +50%). Watch the AI instantly recalculate stock-out dates and suggest new optimal reorder quantities in real-time!

### 4. 🌍 Global Logistics Map (Network AI)
Warehouses don't exist in isolation. 
* **Multi-Facility Grid:** Monitor capacity and stock across the West Coast, Central Hub, and East Coast facilities.
* **Demand Shock Simulator:** Trigger a "Regional Crisis" (e.g., a storm on the East Coast causing a demand spike). Watch the AI automatically draw paths and animate the transfer of stock from the Central Hub to the East Coast to prevent a shortage.

### 5. 📦 Live Inventory Feed
A robust, real-time table of all SKUs across all facilities.
* **Visual Stock Health:** Progress bars and warning icons immediately highlight critical inventory.
* **One-Click AI PO Generation:** Click a button to have Gemini instantly draft a professional Purchase Order for low-stock items.

---

## 🛠️ Technology Stack

* **Frontend:** React.js, Vite, Tailwind CSS v4, Lucide Icons, Recharts, React-Markdown.
* **Backend:** Node.js, Express.js
* **AI Engine:** Google Gemini API (integrated for Assistant chat, PO generation, and data analysis).
* **Architecture:** RESTful APIs with modular, scalable component design.

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/DharanSJIT/Flex-Hackathon.git
cd smart-warehouse
```

### 2. Setup the Backend
```bash
cd backend
npm install
# Create a .env file and add your GEMINI_API_KEY
npm start
```
The backend server will start on `http://localhost:5001`.

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will start on `http://localhost:5173`.

---

## 🎨 Design Philosophy
FlexWare AI was built with a premium, enterprise-grade aesthetic. It features a clean, highly legible **Light Theme** for the core dashboards, and a specialized **Dark Theme** for the cinematic landing page to instantly wow users. Interactive elements, smooth animations, and glassmorphism accents are used strategically to make complex data easy to digest.

---

*Built with ❤️ for the Flex India Hackathon.*
