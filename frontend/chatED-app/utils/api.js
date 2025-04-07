import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API func. with tokens
export const postWithToken = async (endpoint, body) => {
  const token = await AsyncStorage.getItem('token');
  console.log("Sending request with token:", token);

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return { status: response.status, data };
};

// requests for token is not necessary (login, register..)
export const postWithoutToken = async (endpoint, body) => {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return { status: response.status, data };
};
