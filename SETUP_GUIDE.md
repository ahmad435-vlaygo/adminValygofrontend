# VALYGO Admin Dashboard - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd admin-dashboard
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=VALYGO Admin
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Login

Use the following credentials to access the dashboard:

- **Email**: `admin@valygo.com`
- **Password**: `admin123`

## Project Features

### 📊 Dashboard
- Overview of key metrics
- User growth statistics
- Recent activity feed
- Performance indicators

### 👥 Users Management
- Search and filter users
- View user details
- Edit user information
- Manage user status

### 📦 Plans Management
- Create subscription plans
- Edit plan details
- Mark featured plans
- Manage plan features

### 🎁 Loyalty Points
- Track user loyalty points
- Manage loyalty tiers
- Add points to users
- Monitor user activity

### 👨‍💼 Team Members
- Add team members
- Assign roles and permissions
- Edit member details
- Remove team members

## Theme & Branding

The dashboard uses VALYGO's brand colors:

- **Primary Green**: `#004C00`
- **Accent Cyan**: `#00C2FF`
- **Dark Background**: `#0b0f33`
- **Card Background**: `#1a1f4d`

All components are styled with Material-UI and Styled Components for consistency.

## API Integration

The dashboard connects to your VALYGO backend API. Make sure:

1. Backend is running on the configured API URL
2. Admin login endpoint is available at `/admin/login`
3. JWT token authentication is implemented
4. CORS is properly configured

## Building for Production

```bash
npm run build
npm start
```

## Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel deploy
```

### Docker
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Traditional Server
```bash
npm run build
npm start
```

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running
- Verify CORS configuration

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

## Development Tips

### Adding New Pages
1. Create folder in `src/app/dashboard/`
2. Add `page.tsx` file
3. Wrap with `<DashboardLayout>`
4. Update `Sidebar.tsx` menu

### Styling Components
- Use `styled-components` for component styles
- Follow the theme colors from `src/theme/theme.ts`
- Maintain consistency with existing components

### State Management
- Use Redux for global state
- Redux slices are in `src/store/slices/`
- Use `useSelector` and `useDispatch` hooks

## Support & Documentation

- Next.js: https://nextjs.org/docs
- Material-UI: https://mui.com/
- Redux: https://redux.js.org/
- Styled Components: https://styled-components.com/

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Start development server
4. ✅ Login to dashboard
5. 📝 Customize theme colors if needed
6. 🔌 Connect to your backend API
7. 🚀 Deploy to production

Enjoy building with VALYGO Admin Dashboard!
