// Input validation and sanitization utilities

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

export const validatePassword = (password: string): boolean => {
  // At least 6 characters
  return password.length >= 6 && password.length <= 128;
};

export const validateName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 100 && /^[a-zA-Z\s'-]+$/.test(name);
};

export const validateEventTitle = (title: string): boolean => {
  return title.length >= 3 && title.length <= 200;
};

export const validateDescription = (description: string): boolean => {
  return description.length >= 10 && description.length <= 5000;
};

export const validateNumberOfSeats = (seats: number): boolean => {
  return Number.isInteger(seats) && seats > 0 && seats <= 1000;
};

export const validateCapacity = (capacity: number): boolean => {
  return Number.isInteger(capacity) && capacity > 0 && capacity <= 10000;
};

export const validatePrice = (price: number): boolean => {
  return price >= 0 && price <= 1000000;
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

export const validateObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
