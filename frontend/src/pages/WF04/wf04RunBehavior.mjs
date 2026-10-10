export function createInFlightLock() {
  let locked = false;
  return {
    acquire() {
      if (locked) return false;
      locked = true;
      return true;
    },
    release() {
      locked = false;
    },
  };
}

export function getWf04RunErrorMessage(error) {
  const status = typeof error?.status === 'number' ? error.status : undefined;
  if (status === 401) return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
  if (status === 403) return 'Tài khoản của bạn không có quyền vận hành WF04.';
  if (status === 503) return 'Backend chưa được cấu hình đầy đủ để gửi yêu cầu WF04.';
  if (status === 502 && /Webhook WF04 trả về lỗi HTTP 404/i.test(error?.message ?? '')) return 'Backend đã nhận yêu cầu nhưng Webhook WF04 trên n8n trả HTTP 404. Hãy kiểm tra Production URL, Path và trạng thái Publish; chưa xác nhận workflow được tiếp nhận.';
  if (status === 502) return 'Không thể xác nhận n8n đã tiếp nhận yêu cầu. Hãy kiểm tra trạng thái WF04 trước khi thử lại.';
  if (status === 504) return 'Yêu cầu WF04 đã quá thời gian chờ; chưa rõ n8n đã tiếp nhận hay chưa. Hãy kiểm tra trạng thái trước khi thử lại.';
  if (status === undefined) return 'Mất kết nối khi gửi yêu cầu WF04; chưa rõ yêu cầu đã được tiếp nhận hay chưa. Hãy kiểm tra trạng thái trước khi thử lại.';
  if (status === 409) return 'Yêu cầu WF04 của bạn đang được gửi. Vui lòng đợi trước khi gửi lại.';
  if (status === 429) return 'WF04 vừa nhận một yêu cầu. Vui lòng đợi trước khi gửi yêu cầu khác.';
  if (status >= 500) return `Backend gặp lỗi (HTTP ${status}); hãy kiểm tra trạng thái WF04 trước khi thử lại.`;
  if (typeof error?.message === 'string' && error.message.trim()) return error.message;
  return 'Không thể gửi yêu cầu WF04. Vui lòng thử lại sau khi kiểm tra trạng thái.';
}

export function getAnalysisTimestamp(analysis) {
  const updatedAt = typeof analysis?.updatedAt === 'string' && !Number.isNaN(new Date(analysis.updatedAt).getTime())
    ? analysis.updatedAt
    : null;
  if (updatedAt) return { value: updatedAt, label: 'Cập nhật gần nhất' };
  return { value: analysis?.createdAt, label: 'Ngày tạo (chưa có lịch sử cập nhật)' };
}

export function formatVietnameseDate(value) {
  if (typeof value !== 'string' || !value.trim()) return 'Chưa có thời gian';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Thời gian không hợp lệ'
    : date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
}

export async function executeWf04Run(request) {
  try {
    const result = await request();
    if (result?.status === 'no_work') {
      return { status: 'no_work', message: 'Chưa có dữ liệu đủ điều kiện để phân tích hiệu suất.' };
    }
    return { status: 'accepted', message: 'n8n đã tiếp nhận yêu cầu chạy WF04. Chưa xác nhận phân tích hoàn tất.' };
  } catch (error) {
    return {
      status: 'error',
      message: getWf04RunErrorMessage(error),
      httpStatus: typeof error?.status === 'number' ? error.status : undefined,
    };
  }
}
