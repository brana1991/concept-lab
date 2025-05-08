// Common utilities used across the application
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}; 