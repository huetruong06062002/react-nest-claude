export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

export const APP_NAME = 'Ecommerce';

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
} as const;
