# Customer Portal

## 🌟 Overview

The Customer Portal is a modern web application designed to streamline business operations by providing a user-friendly interface for managing customer interactions, orders, and inventory. It serves as a bridge between your business and customers, offering real-time access to important business data through seamless integration with Microsoft Dynamics 365 Business Central.

### Who is this for?
- **Business Owners**: Get a clear overview of your operations
- **Sales Teams**: Manage customer orders and track inventory in real-time
- **Customers**: Self-service portal for order tracking and account management
- **Developers**: A modern tech stack with clear documentation

### Key Benefits
- **Efficiency**: Automate routine tasks and reduce manual data entry
- **Accessibility**: Access your business data anytime, anywhere
- **Insights**: Make data-driven decisions with real-time reporting
- **Scalability**: Built to grow with your business needs

## 📋 Table of Contents
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Development](#-development)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **Modern UI**: Built with React and Tailwind CSS
- **Real-time Data**: Live updates from Business Central
- **Secure Authentication**: Protected routes and API endpoints
- **Responsive Design**: Works on all devices
- **Type Safety**: Full TypeScript support

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)
- Access to a Business Central environment

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/winfrey-Git/customer-portal.git
   cd customer-portal
   ```

2. **Install dependencies** for both frontend and backend:
   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

## ⚙️ Configuration

1. **Create environment files**:
   - In the root directory, copy `.env.example` to `.env`
   - In the `server` directory, copy `.env.example` to `.env`

2. **Configure environment variables** in both `.env` files:

   Frontend (root/.env):
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

   Backend (server/.env):
   ```env
   # Server
   PORT=3000
   NODE_ENV=development

   # Business Central
   BC_API_BASE_URL=your_bc_api_url
   BC_TENANT_ID=your_tenant_id
   BC_CLIENT_ID=your_client_id
   BC_CLIENT_SECRET=your_client_secret
   BC_COMPANY_NAME=your_company_name
   ```

## 🚀 Running the Application

1. **Start the backend server**:
   ```bash
   cd server
   npm run dev
   ```

2. **In a new terminal, start the frontend**:
   ```bash
   # From the project root
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
customer-portal/
├── src/                  # Frontend source code
│   ├── components/       # Reusable components
│   ├── pages/            # Page components
│   ├── context/          # React context providers
│   └── assets/           # Static assets
├── server/              # Backend server
│   ├── src/             # Server source code
│   └── package.json     # Server dependencies
├── public/              # Public assets
└── .env                 # Environment variables
```

## 🐛 Troubleshooting

1. **Port already in use**:
   - Check if another instance is running: `lsof -i :3000` (or your port)
   - Kill the process: `kill -9 $(lsof -t -i:3000)`

2. **Missing dependencies**:
   ```bash
   # From project root
   rm -rf node_modules package-lock.json
   npm install
   cd server
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Environment variables not loading**:
   - Ensure `.env` files exist in both root and server directories
   - Restart your development server after changing environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI powered by [Tailwind CSS](https://tailwindcss.com/)
- Backend with [Express](https://expressjs.com/)
- Integration with [Business Central API](https://learn.microsoft.com/en-us/dynamics365/business-central/)
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
