import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';
import { API_URL } from '@env';

const HomeScreen = ({ navigation }) => {
  const [tweetText, setTweetText] = useState('');
  const [tweetResult, setTweetResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const simulateTweetDetection = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: tweetText })
      });

      const result = await response.json();
      
      if (result.label === "ED") {
        setTweetResult('Risk is detected!');
        navigation.navigate('Chat');
      } else {
        setTweetResult('This tweet seems safe.');
      }
      
    } catch (error) {
      console.error(error);
      setTweetResult('Error analyzing tweet.');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to ChatED</Text>

      <Text style={styles.sectionTitle}>Simulate Tweet Detection</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a tweet..."
        value={tweetText}
        onChangeText={setTweetText}
      />

      {loading ? (
        <ActivityIndicator size="small" color="#43b7bf" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={simulateTweetDetection}
        >
          <Text style={styles.buttonText}>Analyze Tweet</Text>
        </TouchableOpacity>
      )}

      {tweetResult && <Text style={styles.result}>{tweetResult}</Text>}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Chat')}
        >
          <Text style={styles.buttonText}>Chat with Bot</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.buttonText}>View History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#4f535b', 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginVertical: 10,
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
  result: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
});