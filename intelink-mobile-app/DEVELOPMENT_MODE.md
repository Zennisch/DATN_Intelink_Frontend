# Development Mode - Intelink Mobile App

## 🚀 Offline Development

Ứng dụng Intelink Mobile đã được cấu hình để hoạt động trong chế độ **Development Mode** khi backend không khả dụng.

### ✅ Tính năng hoạt động offline:

1. **Authentication Mock Data**
   - User profile với demo data
   - Tự động login với user "demo_user"
   - Statistics: 150 clicks, 25 short URLs

2. **Short URL Management**
   - Tạo, xem, search short URLs
   - Mock data với 3 sample URLs
   - Pagination và filtering
   - Copy to clipboard

3. **API Keys Management**
   - Tạo, xem, xóa API keys
   - Mock data với 2 sample keys
   - Rate limiting configuration

4. **Dashboard**
   - Hiển thị user statistics
   - Quick actions navigation
   - Account information

### 🔧 Cách hoạt động:

Khi backend không khả dụng (ERR_CONNECTION_REFUSED), app sẽ:
- Tự động chuyển sang mock mode
- Log "Backend not available, using mock data" vào console
- Hiển thị demo data thay vì lỗi

### 🌐 Kết nối Backend:

Để kết nối với backend thực tế:
1. Đảm bảo backend đang chạy trên `http://localhost:8080`
2. App sẽ tự động detect và sử dụng real API
3. Mock mode chỉ hoạt động khi backend không khả dụng

### 📱 Test App:

```bash
# Chạy development server
npm run web

# Hoặc trên mobile device
npm run android
npm run ios
```

### 🎯 Demo Features:

- **Dashboard**: Xem statistics và quick actions
- **Short URLs**: Tạo và quản lý URLs với search/filter
- **API Keys**: Quản lý API keys với copy functionality
- **Settings**: User preferences và account management

### 🔄 Switch between modes:

- **Offline Mode**: Backend không chạy → Mock data
- **Online Mode**: Backend chạy → Real API calls

App sẽ tự động detect và chuyển đổi giữa 2 modes mà không cần restart.
