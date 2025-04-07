import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import uuid from 'react-native-uuid';
import MessageBubble from '../components/MessageBubble';
import { postWithToken } from '../utils/api';

console.log("ChatScreen rendered");

const ChatScreen = () => {
  const [chatText, setChatText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Session ID for the current chat session (remains same during the session)
  const sessionIdRef = useRef(uuid.v4());

  useEffect(() => {
    console.log("New chat session started:", sessionIdRef.current);
  }, []);

  const sendMessageToChatbot = async () => {
    if (!chatText.trim()) return;

    console.log("Chat text:", chatText);
    console.log("Sending to /chatbot with session:", sessionIdRef.current);

    // Add user's message to chat history
    const messageId = uuid.v4();  // Creating unique ID for each message
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { id: messageId, sender: 'user', text: chatText },
    ]);

    setLoading(true);
    setErrorMessage(null); 

    try {
      const { status, data } = await postWithToken('chatbot', {
        text: chatText,
        chat_session_id: sessionIdRef.current,
      });

      if (status === 200) {
        const botResponse = data?.response || "I'm not sure what you mean.";
        // Add bot's response to chat history
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { id: uuid.v4(), sender: 'bot', text: botResponse },
        ]);
      } else {
        setErrorMessage('Failed to get response from the bot.');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setErrorMessage('There was an error while communicating with the chatbot.');
    }

    setChatText('');
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with ChatED</Text>

      <ScrollView style={styles.chatContainer}>
        {chatMessages.map((msg) => (
          <MessageBubble key={msg.id} sender={msg.sender} text={msg.text} />
        ))}
      </ScrollView>

      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        value={chatText}
        onChangeText={setChatText}
      />

      {loading ? (
        <ActivityIndicator size="small" color="#43b7bf" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={sendMessageToChatbot}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send'}</Text>
        </TouchableOpacity>
      )}

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

export default ChatScreen;

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
  },
  chatContainer: {
    flex: 1,
    marginBottom: 20,
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});