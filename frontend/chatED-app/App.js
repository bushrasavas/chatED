import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const API_URL = "http://172.20.10.2:5000";

const App = () => {
  const [tweetText, setTweetText] = useState(""); // Simulate tweet state
  const [tweetResult, setTweetResult] = useState(null); // Simulate tweet result

  const [chatText, setChatText] = useState(""); // Chatbot input state
  const [chatMessages, setChatMessages] = useState([]); // Chatbot message history
  const [chatbotVisible, setChatbotVisible] = useState(false); // Chatbot visibility

  const [loading, setLoading] = useState(false);

  // **Tweet Simulation (ED Risk Detection)**
  const simulateTweetDetection = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: tweetText }) 
      });

      const result = await response.json();
      handleTweetResult(result.prediction);
    } catch (error) {
      console.error("Error:", error);
      setTweetResult("Error analyzing tweet.");
    }

    setTweetText(""); // Clear text box
    setLoading(false);
  };

  const handleTweetResult = (prediction) => {
    if (!prediction || prediction.length === 0) {
      setTweetResult("Could not analyze the tweet.");
      return;
    }

    const scores = prediction[0];
    const maxIndex = scores.indexOf(Math.max(...scores));

    if (maxIndex === 1) {
      setTweetResult("Risk is detected!");
      setChatMessages([
        { sender: "bot", text: "I noticed a risky tweet. Are you okay? How can I help?" }
      ]);
      setChatbotVisible(true);
    } else {
      setTweetResult("This tweet seems safe.");
    }
  };

  // **Simple Rule-Based Chatbot**
  const chatbotLogic = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase();

    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      return "Hello! How can I support you today? 😊";
    } else if (lowerCaseMessage.includes("bad") || lowerCaseMessage.includes("help")) {
      return "I'm here to help. Would you like professional advice or some relaxation tips? 🧘‍♂️";
    } else if (lowerCaseMessage.includes("meditation") || lowerCaseMessage.includes("relax")) {
      return "I recommend trying a 5-minute mindfulness session. 🌿";
    } else {
      return "I'm here to listen. Tell me more. 💙";
    }
  };

  // **Chatbot Function**
  const sendMessageToChatbot = () => {
    if (!chatText.trim()) return;

    setChatMessages((prevMessages) => [
      ...prevMessages, 
      { sender: "user", text: chatText }
    ]);

    const botResponse = chatbotLogic(chatText);
    
    setTimeout(() => {
      setChatMessages((prevMessages) => [
        ...prevMessages, 
        { sender: "bot", text: botResponse }
      ]);
    }, 1000); 

    setChatText(""); // Clear input box
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>

        {/* Simulate Tweet Detection */}
        <Text style={styles.sectionTitle}>Simulate Tweet Detection</Text>
        <TextInput
          style={styles.input}
          value={tweetText}
          onChangeText={setTweetText}
          placeholder="Enter a tweet to simulate..."
        />
        <Button title="Simulate Tweet" onPress={() => {
          simulateTweetDetection();
          setChatMessages([]); // Clear chat history
        }} />
        {loading && <ActivityIndicator size="large" color="blue" />}
        {tweetResult && <Text style={styles.result}>{tweetResult}</Text>}

        {/* Chatbot Toggle Button */}
        <TouchableOpacity onPress={() => setChatbotVisible(!chatbotVisible)} style={styles.chatbotToggle}>
          <Text style={styles.chatbotToggleText}>{chatbotVisible ? "Close Chatbot" : "Open Chatbot"}</Text>
        </TouchableOpacity>

        {/* Chatbot Section */}
        {chatbotVisible && (
          <View>
            <Text style={styles.sectionTitle}>Chatbot</Text>
            <View style={styles.chatContainer}>
              {chatMessages.map((msg, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageBubble,
                    msg.sender === "bot" ? styles.botMessage : styles.userMessage
                  ]}
                >
                  <Text style={styles.messageText}>{msg.text}</Text>
                </View>
              ))}
            </View>

            <TextInput
              style={styles.input}
              value={chatText}
              onChangeText={setChatText}
              placeholder="Type a message..."
            />
            <Button title="Send" onPress={sendMessageToChatbot} />
          </View>
        )}
      
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 100
  },
  scrollView: {
    flexGrow: 1
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center"
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff"
  },
  chatbotToggle: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center"
  },
  chatbotToggleText: {
    color: "#fff",
    fontWeight: "bold"
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#d0ebff"
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#e6ffe6"
  }
});

export default App;
