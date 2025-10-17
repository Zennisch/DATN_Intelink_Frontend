# Intelink Mobile App

A modern React Native mobile application for URL shortening and analytics, converted from the original ReactJS web application.

## 🚀 Features

### ✅ Authentication
- **Login/Register**: Secure user authentication with form validation
- **Social Login**: Google and GitHub OAuth2 integration (UI ready)
- **Password Reset**: Forgot password functionality
- **Route Protection**: Automatic redirects based on authentication status

### ✅ Dashboard
- **User Statistics**: Display total URLs and clicks
- **Quick Actions**: Easy navigation to main features
- **Account Information**: User profile display
- **Logout**: Secure session termination

### ✅ Short URL Management
- **Create URLs**: Generate short URLs from long URLs
- **URL List**: View all created short URLs
- **Copy to Clipboard**: One-tap URL copying
- **Click Tracking**: Monitor URL performance
- **Toast Notifications**: User-friendly feedback

### ✅ Analytics
- **Overview Stats**: Key metrics at a glance
- **Chart Placeholders**: Ready for data visualization
- **Recent Activity**: Latest user actions

### ✅ Settings
- **Profile Management**: User account settings
- **Preferences**: Notification and theme controls
- **Security**: Password and privacy settings
- **Account Actions**: Export data and support

### ✅ Technical Features
- **Error Boundary**: Graceful error handling
- **Network Status**: Offline/online detection
- **Loading States**: Smooth user experience
- **TypeScript**: Full type safety
- **Modern UI**: NativeWind styling

## 🛠️ Tech Stack

- **Framework**: React Native + Expo
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context + Custom Hooks
- **HTTP Client**: Axios with interceptors
- **Storage**: AsyncStorage for tokens
- **Icons**: Expo Vector Icons
- **Language**: TypeScript

## 📱 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. **Clone and navigate to the project:**
```bash
cd intelink-mobile-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

4. **Run on specific platform:**
```bash
# iOS
npm run ios

# Android  
npm run android

# Web
npm run web
```

## 🔧 Configuration

### Environment Variables
Update `src/types/environment.ts` with your backend API URL:
```typescript
export const BACKEND_URL = "https://your-api-domain.com/api";
```

### API Endpoints
The app expects the following API endpoints:
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `POST /auth/refresh` - Refresh tokens
- `POST /auth/forgot-password` - Password reset request
- `POST /short-urls` - Create short URL
- `GET /short-urls` - Get user's short URLs
- `DELETE /short-urls/:id` - Delete short URL

## 📁 Project Structure

```
src/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   └── _layout.tsx
│   ├── (main)/            # Main app screens
│   │   ├── dashboard.tsx
│   │   ├── short-urls.tsx
│   │   ├── analytics.tsx
│   │   ├── settings.tsx
│   │   └── _layout.tsx
│   ├── index.tsx          # Entry point
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── atoms/            # Basic UI components
│   ├── auth/             # Auth-specific components
│   ├── ui/               # UI components
│   ├── ErrorBoundary.tsx # Error handling
│   └── NetworkStatus.tsx # Network monitoring
├── contexts/             # React Context providers
│   └── AuthContext.tsx
├── hooks/                # Custom React hooks
│   ├── useAuth.ts
│   ├── useForm.ts
│   └── useShortUrl.ts
├── services/             # API services
│   ├── AuthService.ts
│   ├── ShortUrlService.ts
│   └── AxiosConfig.ts
├── models/               # Data models
├── dto/                  # Data transfer objects
├── types/                # TypeScript definitions
├── utils/                # Utility functions
└── constants/            # App constants
```

## 🎨 UI Components

### Atoms
- **Button**: Customizable button with variants
- **TextInput**: Form input with validation
- **Checkbox**: Toggle input component
- **Spinner**: Loading indicator
- **Toast**: Notification component

### Layout
- **SafeAreaView**: Safe area handling
- **ErrorBoundary**: Error catching and display
- **NetworkStatus**: Connection status indicator

## 🔐 Authentication Flow

1. **Login**: User enters credentials → API validation → Token storage
2. **Auto-login**: App checks stored tokens → Profile fetch → Dashboard
3. **Logout**: Token cleanup → Redirect to login
4. **Token Refresh**: Automatic token renewal on API calls

## 📊 State Management

- **AuthContext**: Global authentication state
- **Custom Hooks**: Reusable state logic
- **Local State**: Component-specific state with useState

## 🚀 Deployment

### Development Build
```bash
expo build:android
expo build:ios
```

### Production Build
```bash
expo build:android --type app-bundle
expo build:ios --type archive
```

## 🧪 Testing

Run the linter:
```bash
npm run lint
```

Format code:
```bash
npm run pretty
```

## 🔮 Future Enhancements

- **Charts**: Victory Native for analytics visualization
- **Push Notifications**: Real-time click notifications
- **Deep Linking**: Handle short URL redirects
- **Offline Support**: Cache data for offline use
- **Biometric Auth**: Touch ID/Face ID login
- **Dark Mode**: Theme switching
- **Internationalization**: Multi-language support

## 📞 Support

For issues or questions:
1. Check the `CONVERSION_GUIDE.md` for detailed migration info
2. Review the code in the `src/` directory
3. Consult Expo Router documentation
4. Contact the development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**🎉 Intelink Mobile App - Ready for production deployment!**