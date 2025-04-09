import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { postWithoutToken } from '../utils/api';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const showToast = (type, title, message) => {
    Toast.show({
      type: type, // 'success' | 'error' | 'info'
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 2500,
    });
  };

  const handleRegister = async () => {
    if (!email || !username || !password) {
      showToast('error', 'Missing Fields', 'All fields are required!');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      showToast('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await postWithoutToken('register', {
        email,
        username,
        password,
      });

      setLoading(false);

      if (response.status === 200) {
        showToast('success', 'Registration Successful', 'Redirecting to login...');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else if (response.status === 409) {
        showToast('error', 'Duplicate Entry', 'This email or username is already taken.');
      } else {
        showToast('error', 'Error', response.data.error || 'Something went wrong.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Register error:', error);
      showToast('error', 'Network Error', 'Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create an Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="small" color="#43b7bf" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.text}>
        Already have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Login
        </Text>
      </Text>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4f535b', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#43b7bf',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  text: {
    textAlign: 'center',
    marginTop: 10,
  },
  link: {
    color: '#43b7bf',
    fontWeight: 'bold',
  },
});