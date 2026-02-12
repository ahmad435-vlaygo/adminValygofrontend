# VALYGO Admin Dashboard

A professional admin dashboard for managing the VALYGO platform with a modern UI design.

## Features

- **Dashboard**: Overview of key metrics and statistics
- **Users Management**: View, search, and manage platform users
- **Plans Management**: Create and manage subscription plans
- **Loyalty Points**: Track and manage user loyalty points and tiers
- **Team Members**: Manage admin team members and their roles
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Professional dark theme with VALYGO brand colors

## Tech Stack

- **Next.js 15.4.4**: React framework with App Router
- **TypeScript**: Type-safe development
- **Material-UI (MUI)**: Component library
- **Redux Toolkit**: State management
- **Styled Components**: CSS-in-JS styling
- **Axios**: HTTP client
- **React Query**: Data fetching and caching

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=VALYGO Admin
NEXT_PUBLIC_APP_VERSION=1.0.0
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Login Credentials

- Email: `admin@valygo.com`
- Password: `admin123`

## Project Structure

```
admin-dashboard/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Main dashboard
│   │   │   ├── users/            # Users management
│   │   │   ├── plans/            # Plans management
│   │   │   ├── loyalty/          # Loyalty points
│   │   │   └── team/             # Team members
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── Navbar.tsx            # Top navigation bar
│   │   └── DashboardLayout.tsx   # Dashboard wrapper
│   ├── providers/
│   │   ├── ThemeProvider.tsx     # MUI theme provider
│   │   └── ReduxProvider.tsx     # Redux store provider
│   ├── store/
│   │   ├── store.ts              # Redux store configuration
│   │   └── slices/               # Redux slices
│   ├── theme/
│   │   └── theme.ts              # Theme configuration
│   └── lib/
│       └── api/
│           └── apiClient.ts      # Axios API client
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Theme Colors

- **Primary**: `#004C00` (Green)
- **Secondary**: `#00C2FF` (Cyan)
- **Background**: `#0b0f33` (Dark Blue)
- **Paper**: `#1a1f4d` (Lighter Blue)
- **Error**: `#D32F2F` (Red)

## API Integration

The dashboard connects to the VALYGO backend API. Update the `NEXT_PUBLIC_API_URL` environment variable to point to your backend server.

### Authentication

- Login credentials are sent to `/admin/login` endpoint
- JWT token is stored in cookies
- Token is automatically included in all API requests

## Features in Detail

### Dashboard
- Real-time statistics cards
- User growth chart
- Recent activity feed
- Key performance indicators

### Users Management
- Search and filter users
- View user details
- Edit user information
- Delete users
- User status tracking

### Plans Management
- Create new subscription plans
- Edit existing plans
- Mark plans as featured
- Manage plan features
- Delete plans

### Loyalty Points
- View user loyalty points
- Track loyalty tiers (Bronze, Silver, Gold, Platinum)
- Add points to users
- Monitor last activity
- View total and average points

### Team Members
- Add new team members
- Assign roles (Super Admin, Manager, Support, Analyst)
- Edit member information
- Remove team members
- Track member status

## Customization

### Adding New Pages

1. Create a new folder in `src/app/dashboard/`
2. Add `page.tsx` file
3. Wrap content with `<DashboardLayout>`
4. Add menu item to `Sidebar.tsx`

### Styling

All components use styled-components. Modify theme colors in `src/theme/theme.ts`.

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
vercel deploy
```

## Support

For issues or questions, please contact the VALYGO team.

## License

© 2024 VALYGO. All rights reserved.
# adminValygofrontend
