export const createNotificationMocks = () => ({
  toast: vi.fn(),
  showSuccessNotification: vi.fn<(message: string) => void>(),
  showErrorNotification: vi.fn<(message: string) => void>(),
  showInfoNotification: vi.fn<(message: string) => void>(),
});
