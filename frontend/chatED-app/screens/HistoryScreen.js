import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { postWithToken } from '../utils/api';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChatHistory = async () => {
    try {
      const { status, data } = await postWithToken('history', {});
      if (status === 200) {
        setHistory(data.history || []);
        console.log("Fetched history:", data.history);
      } else {
        console.error("History fetch failed:", data);
        setHistory([]);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setHistory([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const renderChatSessions = () => {
    return Object.entries(history).map(([sessionId, messages], index) => (
      <View key={sessionId} style={styles.chatSession}>
        <Text style={styles.sessionTitle}>Chat Session {index + 1}</Text>
        {messages.map((msg, i) => (
          <View key={i} style={styles.messageBlock}>
            <Text style={styles.userMessage}>You: {msg.user_message}</Text>
            <Text style={styles.botMessage}>Bot: {msg.bot_response}</Text>
            <Text style={styles.timestamp}>{new Date(msg.timestamp).toLocaleString()}</Text>
          </View>
        ))}
      </View>
    ));
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Chat History</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : Object.keys(history).length === 0 ? (
        <Text style={styles.noHistory}>No chat history available.</Text>
      ) : (
        <ScrollView>{renderChatSessions()}</ScrollView>
      )}
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flex: 1,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4f535b', 
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  chatSession: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  messageBlock: {
    marginBottom: 10,
  },
  userMessage: {
    fontWeight: 'bold',
    color: '#333',
  },
  botMessage: {
    color: '#444',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  noHistory: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});