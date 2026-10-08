import axios from 'axios';

// Android emulator reaches the host machine via 10.0.2.2. On a real phone set EXPO_PUBLIC_API_URL
// to your computer's address, e.g. http://192.168.100.252:8000/api/v1
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8000/api/v1';

export const api = axios.create({ baseURL: API_URL, timeout: 10000 });
