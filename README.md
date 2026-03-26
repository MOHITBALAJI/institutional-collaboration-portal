# INSTITUTIONAL COLLABORATION PORTAL 🚀

**Institutional Collaboration Portal for Academia and Industry**

Academia Connect Pro is a comprehensive platform designed to bridge the gap between educational institutions and industry partners. It streamlines collaboration, research management, and student engagement through a modern, data-driven interface.

---

## ✨ Key Features

- **📊 Advanced Dashboards**: Specialized views for Administrators and Faculty members.
- **🤝 Industry Collaboration**: Manage and track partnerships with industry leaders.
- **🔬 Research Hub**: A centralized space for research proposals, projects, and detailed tracking.
- **📡 Neural War Room**: Real-time communication and monitoring powered by Socket.io.
- **📅 Smart Scheduling**: Integrated hooks for managing student and faculty schedules.
- **📈 Data Visualization**: Interactive charts for engagement, finances, and facility utilization.
- **🔐 Secure Access**: Built-in authentication and role-based access control.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (Vite)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Icons & Graphics**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Real-time**: [Socket.io](https://socket.io/)
- **Environment Management**: [Dotenv](https://github.com/motdotla/dotenv)

### Database & Auth
- **Provider**: [Supabase](https://supabase.com/)

---

## 📁 Project Structure

```text
academia-connect-pro/
├── frontend/           # React + Vite application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/      # Custom React hooks (Data fetching)
│   │   ├── pages/      # Route-level components
│   │   └── lib/        # Utility functions
├── backend/            # Express.js server
│   ├── src/
│   │   ├── index.js    # Entry point & socket initialization
├── database/           # SQL scripts and schema documentation
└── package.json        # Root workspace configuration
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/academia-connect-pro.git
   cd academia-connect-pro
   ```

2. **Install dependencies for all modules**:
   ```bash
   npm run install:all
   ```

3. **Environment Setup**:
   - Create a `.env` file in the `backend/` directory.
   - Add your Supabase credentials and other environment variables (see `backend/.env.example` if available).

### Running Locally

To start both the frontend and backend in development mode:

```bash
npm run dev
```

- **Frontend**: Accessible at `http://localhost:5173`
- **Backend**: Running at `http://localhost:3000`

---

## 📜 Available Scripts

In the root directory, you can run:

- `npm run dev`: Starts both frontend and backend concurrently.
- `npm run install:all`: Installs dependencies in both `frontend/` and `backend/`.
- `npm run dev:frontend`: Starts only the frontend dev server.
- `npm run dev:backend`: Starts only the backend dev server.
- `npm run build:frontend`: Builds the frontend for production.

---

## 🤝 Contribution

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.
