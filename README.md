# E-commerce Full-Stack Application

A modern, full-stack e-commerce application built with React, Remix, and TypeScript.

## Tech Stack

### Frontend
- **React** + **Remix** + **Vite** + **TypeScript** - Modern React framework with SSR
- **tRPC** - End-to-end typesafe APIs
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality React components
- **Framer Motion** - Animation library
- **Zustand** - State management
- **TanStack Query (React Query)** - Data fetching and caching
- **React Hook Form** + **Zod** - Form handling and validation
- **ESLint** + **Prettier** - Code formatting and linting

### Backend
- **Node.js** + **TypeScript** - Runtime and language
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage
- **Remix Auth** - Authentication

## Features

- 🛒 **E-commerce Core**
  - Product catalog with categories
  - Shopping cart functionality
  - User authentication and registration
  - Product search and filtering
  - Responsive design

- 🔒 **Authentication**
  - Email/password authentication
  - Session management with Redis
  - Protected routes and admin panel

- 🎨 **Modern UI/UX**
  - Dark/light mode support
  - Responsive design
  - Smooth animations with Framer Motion
  - Accessible components with Radix UI

- 🚀 **Performance**
  - Server-side rendering (SSR)
  - Optimistic updates
  - Data caching with React Query
  - Type-safe API calls with tRPC

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis server

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your database and Redis URLs:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"
   REDIS_URL="redis://localhost:6379"
   SESSION_SECRET="your-super-secret-session-key-here"
   NODE_ENV="development"
   BASE_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Project Structure

```
app/
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   ├── layout/         # Layout components (Header, Footer)
│   └── product/        # Product-specific components
├── lib/                # Utility libraries
│   ├── stores/         # Zustand stores
│   ├── trpc/           # tRPC setup and routers
│   ├── validations/    # Zod schemas
│   └── utils.ts        # Utility functions
├── routes/             # Remix routes
├── styles/             # CSS files
└── root.tsx           # Root application component

prisma/
├── schema.prisma      # Database schema
└── seed.ts           # Database seeding script
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript checks
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## Database Schema

The application uses a comprehensive e-commerce database schema including:

- **Users** - Customer and admin accounts
- **Products** - Product catalog with categories
- **Categories** - Product categorization
- **Cart** - Shopping cart items
- **Orders** - Order management
- **Reviews** - Product reviews and ratings
- **Addresses** - Customer shipping addresses

## API Routes

The application uses tRPC for type-safe API routes:

- `products.*` - Product management (CRUD, search, filtering)
- `categories.*` - Category management
- `cart.*` - Shopping cart operations
- `auth.*` - Authentication and user management

## Authentication

- Email/password authentication using Remix Auth
- Session-based authentication with Redis storage
- Protected routes for authenticated users
- Role-based access control (Customer/Admin)

## Deployment

The application is ready for deployment on platforms like:

- **Vercel** - Recommended for Remix applications
- **Railway** - Full-stack deployment
- **Render** - Alternative deployment option

Make sure to set up your environment variables and database in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
