# ⚽ Global Transfer Analytics & Deal Evaluator

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)

A real-world football transfer valuation and deal-grading web application. Designed with a broadcast-style sports presentation UI, this engine evaluates proposed or completed football transfers using only **four inputs**—**Player Name**, **Selling Club (From)**, **Buying Club (To)**, and **Transfer Deal Price (£M)**—and grades the deal from **A to F** by computing the player's true **Market Value** and **Best Possible Deal** floor.

---

## 📌 Table of Contents
1. [Overview & Key Features](#-overview--key-features)
2. [How the Valuation Algorithm Works](#-how-the-valuation-algorithm-works)
3. [Deal Grading Scale (A–F)](#-deal-grading-scale-af)
4. [Data Pipeline & Scouting Architecture](#-data-pipeline--scouting-architecture)
5. [Tech Stack](#-tech-stack)
6. [Project Structure](#-project-structure)
7. [Local Installation & Setup](#-local-installation--setup)
8. [Environment Variables & Security](#-environment-variables--security)
9. [Deployment](#-deployment)

---

## 🚀 Overview & Key Features

* **Minimal 4-Field Input**: Requires only the Player Name, Selling Club, Buying Club, and Transfer Sum (£ Millions). All underlying scouting metrics are resolved automatically in the background.
* **Broadcast-Style Evaluation Card**: Displays a glowing shield grade (`A` through `F`), verdict banner (`EXCELLENT DEAL`, `GOOD DEAL`, `FAIR DEAL`, `POOR DEAL`, `TERRIBLE DEAL`), Transfer Sum, Calculated Market Value, and Best Possible Deal floor alongside an official player cutout render.
* **Automated Scouting Report Breakdown**: Reveals the player's **Current Ability (CA)**, **Potential Ability (PA)**, **Age**, **Position**, and a bulleted list of every market modifier that inflated or discounted the deal.
* **Multi-Tier Live Data Resolution**: Combines **TheSportsDB API** for official transparent player cutouts and biographical data, **Live Web-Grounded Scouting Analytics** for real-time ability metrics, and a built-in **Verified Global Scouting Database** for instant lookups.

---

## 🧮 How the Valuation Algorithm Works

Rather than generating random numbers, the valuation engine calculates a player's **Market Value** and **Best Possible Deal** using a multi-factor mathematical model inspired by real-world football analytics and algorithmic transfer systems:

### 1. Base Exponential Ability Curve
A player's baseline value scales exponentially with their **Current Ability ($\text{CA}$)** on a $1\text{–}99$ scale:
$$\text{Base Value (£M)} = 0.45 \times (1.202)^{\max(0, \text{CA} - 60)}$$
* Ensures a realistic nonlinear progression where squad rotation players ($\sim 72\text{ CA}$) carry modest base values while world-class starters ($88\text{–}91+\text{ CA}$) command elite baseline fees.

### 2. Age Curve & The 34+ Veteran Cliff
Age heavily impacts long-term asset value and resale potential:
* **Veteran Depreciation ($\text{Age} \ge 34$)**: Players aged 34 and older automatically lose **$40\%$** of their transfer value ($\times 0.60$ multiplier), regardless of how high their current ability rating remains.
* **U-21 Long-Term Asset Premium ($\text{Age} \le 21$)**: Young players receive a **$+15\%$ to $+18\%$** valuation boost due to long-term contract amortization and resale upside.

### 3. The $1.15$ Potential-to-Current Ability Ratio Spike
The algorithm compares a player's **Potential Ability ($\text{PA}$)** ceiling against their **Current Ability ($\text{CA}$)**:
$$\text{Upside Ratio} = \frac{\text{PA}}{\text{CA}}$$
* **Breakthrough Threshold ($\frac{\text{PA}}{\text{CA}} \ge 1.15$)**: When a player's potential ceiling is at least $15\%$ higher than their current rating (for example, an $18$-year-old with $74\text{ CA}$ and $86\text{ PA}$), their market worth spikes by **$+38\%$ to $+45\%$**.
* **Development Headroom ($\text{PA} - \text{CA} \ge 5$)**: Applies a moderate growth premium for developing talent who have not yet reached their peak.

### 4. League Reputation & Selling Market Tax
Transfer fees are heavily influenced by the financial power and coefficient of the selling club's league:
* **Top-5 League Selling Premium ($\text{HIGH}$ Tier)**: Buying from clubs in the English Premier League, Spanish La Liga, or top European heavyweights inflates market value by **$+85\%$ to $+90\%$**.
* **Mid-Tier Coefficient ($\text{MEDIUM}$ Tier)**: Buying from leagues such as the Eredivisie, Liga Portugal, English Championship, or MLS applies a moderate **$+35\%$ to $+40\%$** market adjustment.
* **Emerging & Undervalued Markets ($\text{LOW}$ Tier)**: Buying from leagues with lower financial inflation—such as **Brazil (Série A)**, **Ireland**, **India**, or the **Spanish Segunda División**—applies only a **$+10\%$** modifier, making them prime hunting grounds for undervalued hidden gems.

### 5. Release Clause Cultural & Gap Multipliers
* **The 30-Point Wonderkid Gap ($\text{PA} - \text{CA} \ge 30$)**: Prospects with massive growth gaps trigger protective buyout clauses of up to **$400\%$ ($4\times$)** their market value, though selling clubs will still accept negotiated bids below the clause.
* **Spanish Mandatory Buyout Culture**: Reflects Spain's universal release clause structure ($\sim 90\%$ coverage). While top-flight English and French buyouts carry an **$80\%$ markup**, scouting young talent in the **Spanish Segunda División** unlocks low-multiplier buyout bargains.

### 6. Loan-to-Buy & Squad Surplus Leverage ("Best Possible Deal")
* **Loan-to-Buy Eligibility ($\frac{\text{PA}}{\text{CA}} \ge 1.05$)**: Young players with at least $5\%$ potential headroom qualify for structured loan-to-buy deals where covering a higher wage share yields a **$\sim 5\%$ permanent transfer discount**.
* **Positional Hoarding & Squad Surplus Discount**: Major clubs that stockpile players in the same position (e.g., Center Backs or Central Midfielders at deep-squad giants) are willing to offload surplus talent at a **$15\%$ to $20\%$ discount** to rebalance their roster. This defines the **Best Possible Deal** target floor.

---

## 🏆 Deal Grading Scale (A–F)

Once **Player Market Value** and **Best Possible Deal** are computed, your input **Transfer Sum** is graded:

| Grade | Verdict Banner | Criteria | Color Theme |
| :---: | :--- | :--- | :--- |
| **A** | `EXCELLENT DEAL` | Transfer Sum is at or near the **Best Possible Deal** floor ($\le 1.03\times$ Best Deal) | Neon Green (`#00FF00`) |
| **B** | `GOOD DEAL` | Transfer Sum is below or equal to the true **Player Market Value** ($\le 1.00\times$ Market Value) | Lime Green (`#88FF00`) |
| **C** | `FAIR DEAL` | Slight market premium paid ($1.01\times\text{ to }1.15\times$ Market Value) | Cyber Yellow (`#FFFF00`) |
| **D** | `POOR DEAL` | Significant overpayment ($1.16\times\text{ to }1.35\times$ Market Value) | Amber Orange (`#FFA500`) |
| **F** | `TERRIBLE DEAL` | Severe overpayment ($> 1.35\times$ Market Value) | Crimson Red (`#FF0000`) |

---

## 🌐 Data Pipeline & Scouting Architecture

When you click **Evaluate Deal**, the application executes a parallel lookup pipeline:

1. **TheSportsDB Public API (`fetchTheSportsDB`)**:
   * Requires **no API key**.
   * Fetches official transparent player cutout renders (`strCutout`), thumbnail portraits, exact birth year (to compute real-world age), position, and nationality.
2. **Verified Scouting Database (`CURATED_SCOUTING_DB` / `VERIFIED_SCOUT_DB`)**:
   * Provides zero-latency verified Current Ability (CA), Potential Ability (PA), Age, and Position data for 50+ high-profile global stars and wonderkids (e.g., *Lamine Yamal, Jude Bellingham, Estêvão, Kylian Mbappé, Erling Haaland, Luka Modrić, Morgan Gibbs-White, Florian Wirtz, Viktor Gyökeres*).
3. **Optional Live Grounded Scouting Lookup**:
   * If `VITE_GEMINI_API_KEY` is provided in your local `.env` file, the app queries live web-grounded scouting data for any unindexed player in world football.
   * If no API key is configured, the app seamlessly falls back to combining **TheSportsDB** biographical data with its **Club Coefficient & Age Curve Model** so the app works $100\%$ out-of-the-box.

---

## 🛠️ Tech Stack

* **Frontend Framework**: [React 18](https://react.dev/) (Functional Components & Hooks)
* **Build Tool & Bundler**: [Vite 5](https://vitejs.dev/)
* **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) + Custom CSS Gradients & Masking
* **Typography & Icons**: Google Fonts (`Oswald` & `Inter`) + [Lucide React](https://lucide.dev/)
* **External Data API**: [TheSportsDB Free V1 API](https://www.thesportsdb.com/api.php)

---

## 📂 Project Structure

```text
transfer-analytics-evaluator/
├── index.html                 # Root HTML template
├── package.json               # Project dependencies and npm scripts
├── postcss.config.js          # PostCSS configuration for Tailwind
├── tailwind.config.js         # Tailwind CSS theme and content paths
├── vite.config.js             # Vite bundler configuration
├── .env.example               # Safe template for optional environment variables
├── .gitignore                 # Excludes node_modules, dist, and secret .env files
├── README.md                  # Project documentation
└── src/
    ├── main.jsx               # React DOM entry point
    ├── index.css              # Tailwind directives and global typography
    └── App.jsx                # Core Valuation Engine, API lookups, and Broadcast UI
```

---

## 💻 Local Installation & Setup

Follow these steps to run the project locally on your PC:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed. Verify by running:
```bash
node -v
npm -v
```

### 2. Clone the Repository
```bash
git clone https://github.com/Nirant07/transfer-analytics-evaluator.git
cd transfer-analytics-evaluator
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Optional Environment Setup
If you want to enable live web-grounded scouting lookups for obscure players, create a `.env` file from the example template:
```bash
cp .env.example .env
```
Open `.env` and replace `your_api_key_here` with your key:
```env
VITE_GEMINI_API_KEY=your_actual_api_key
```
*(Note: The app works immediately without this step using TheSportsDB and the built-in scouting engine.)*

### 5. Start the Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🔒 Environment Variables & Security

* **Never commit your `.env` file to GitHub.**
* The included `.gitignore` file explicitly blocks `.env`, `.env.local`, and `node_modules` from being tracked by Git.
* Only `.env.example` (which contains a placeholder string) should be committed to the repository.

---

## 🌍 Deployment

You can deploy this repository to a live public link for free in under a minute:

### Deploy on Vercel (Recommended)
1. Push your code to your GitHub repository (`Nirant07/transfer-analytics-evaluator`).
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your `transfer-analytics-evaluator` GitHub repository.
4. Vercel will automatically detect **Vite** (`npm run build`, output directory `dist`).
5. *(Optional)* Add `VITE_GEMINI_API_KEY` under **Environment Variables** in the Vercel dashboard.
6. Click **Deploy**.

---

## 📄 License

This project is open-source and available under the **MIT License**.