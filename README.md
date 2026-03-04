## AeroTrack - Global Flight Tracker

AeroTrack is a premium, real-time flight tracking web application built with Next.js. It features a modern, stunning UI that displays flight search results in an authentic digital boarding pass format, powered by live flight data.

## Features ✨

*   **Live Flight Data:** Integrated with the powerful **Aviation Stack API** to fetch real-time flight statuses, departure/arrival times, and airport details.

*   **Fully Typed Setup:** Robust TypeScript interfaces custom-built for the Aviation Stack API response payloads.
*   **Secure:** Configured to use `.env.local` for secure API key injection.

## Tech Stack 🛠️

*   **Framework:** Next.js (React)
*   **Styling:** Tailwind CSS (with arbitrary values and custom aesthetic utility classes)
*   **Icons:** Lucide-React
*   **Language:** TypeScript
*   **Data Source:** Aviation Stack API

## Getting Started 🚀

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd flight-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Environment Variables

Create a file named `.env.local` in the root of your project and add your Aviation Stack API key:

```env
AVIATION_STACK_API_KEY=your_api_key_here
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Search for live flights using standard IATA flight numbers (e.g., `AA123`, `SU1883`, `DL456`).

