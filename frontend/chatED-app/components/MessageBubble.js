import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ sender, text, id }) => {
  return (
    <View key={id} style={[styles.bubble, sender === 'bot' ? styles.bot : styles.user]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    maxWidth: '80%',
    marginLeft: 10,
    marginRight: 10,
  },
  bot: {
    backgroundColor: '#d0ebff',
    alignSelf: 'flex-start',
  },
  user: {
    backgroundColor: '#e6ffe6',
    alignSelf: 'flex-end',
  },
  text: {
    fontSize: 16,
  },
});

export default MessageBubble;