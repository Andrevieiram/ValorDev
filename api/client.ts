import AsyncStorage from '@react-native-async-storage/async-storage';

// Usando environment variable ou fallback para localhost (10.0.2.2 para emulador Android se necessário)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8084';

class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function getAuthToken(): Promise<string | null> {
  try {
    const session = await AsyncStorage.getItem('pricing-pro.auth-session');
    if (session) {
      const parsed = JSON.parse(session);
      // Retorna o token armazenado
      return parsed?.token || null;
    }
  } catch (e) {
    console.error('Failed to read token', e);
  }
  return null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  const token = await getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      // Se receber 401 (Unauthorized), o JWT expirou ou é inválido
      if (response.status === 401) {
        // Remove o token do AsyncStorage
        await AsyncStorage.removeItem('pricing-pro.auth-session');
        // Redirecionamento e limpeza de estado costumam ser feitos observando a store,
        // mas garantir que limpamos a sessão aqui é crucial para não ficar preso.
      }

      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON
        errorData = { message: response.statusText };
      }
      throw new ApiError(response.status, errorData.message || 'Erro na requisição', errorData);
    }

    // Return empty object if no content
    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(error instanceof Error ? error.message : 'Network request failed');
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body: any, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body: any, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
