// Env variables ko ek hi jagah se typed access dete hain (direct import.meta.env chhune ke bajaye), taaki dhoondhna aur test me mock karna aasan rahe
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1',
} as const;
