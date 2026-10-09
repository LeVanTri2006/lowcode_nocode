# Cấu hình đăng nhập vận hành

1. Tạo/cập nhật tệp `.env` ở thư mục gốc (không commit). Đặt `AUTH_USERNAME` và `AUTH_ROLE=operator` cho tài khoản có quyền vận hành; dùng `viewer` để chỉ cho phép xem.
2. Tạo hash mật khẩu bằng `cd backend && npm run auth:hash-password`. Mật khẩu được nhập có che ký tự; chép dòng `scrypt$...` vào `AUTH_PASSWORD_HASH`. Mật khẩu cần ít nhất 12 ký tự.
3. Tạo khóa phiên bằng `openssl rand -hex 32` và đặt vào `SESSION_SECRET`. Không dùng lại khóa này ở Frontend.
4. Đặt `AUTH_ALLOWED_ORIGINS` thành danh sách origin chính xác, phân tách bằng dấu phẩy. Mặc định gồm `http://localhost:5173` và `https://enrich-tile-shale.ngrok-free.dev`.
5. Khởi động lại Backend bằng Docker Compose để nạp biến môi trường. Phiên được lưu trong PostgreSQL ở bảng `auth_sessions`; cookie `aca.sid` là HttpOnly, SameSite=Lax, tự đặt Secure khi Express nhận HTTPS qua reverse proxy.

Endpoint vận hành kiểm tra Origin, yêu cầu phiên và vai trò `operator`. WF01 và WF03 chỉ được gọi khi cấu hình Webhook tương ứng hợp lệ; phản hồi tiếp nhận không được coi là xác nhận workflow hoàn tất. Không cấu hình bí mật webhook trong `VITE_*`.

## Cấu hình Webhook WF03

Đặt `N8N_WF03_WEBHOOK_URL=https://levantri.app.n8n.cloud/webhook/wf03/analyze` và `N8N_WF03_WEBHOOK_TOKEN` bằng đúng giá trị Header Auth của Webhook WF03 trong `.env` gốc. Nếu credential đã mất, tạo token mới và cập nhật cùng giá trị trong n8n và Backend. Khởi động lại Backend để Compose nạp các biến. Token không được đặt trong Frontend hoặc commit. Endpoint WF03 chỉ gửi yêu cầu khi có SocialContent chưa có AiAnalysis; phản hồi tức thời từ n8n chỉ được coi là đã tiếp nhận, không phải hoàn thành.
