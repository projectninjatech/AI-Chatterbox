import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import InputView from '../components/inputView';
import { openaiApiCall } from '../api/openAI';
import { geminiApiCall } from '../api/gemini';
import Markdown from 'react-native-markdown-display';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function ChatScreen() {

    const [inputBoxMsg, setinputBoxMsg] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [replyLabelName, setreplyLabelName] = useState(null);
    const [selectedModel, setSelectedModel] = useState('gpt');
    const scrollViewRef = useRef();


    useEffect(() => {
        // Load the selected model from AsyncStorage when the component mounts
        console.log("App started")
        loadSelectedModel();
    }, []);

    useEffect(() => {
        // Load messages when selectedModel changes
        loadMessages(selectedModel);
    }, [selectedModel]);

    const loadSelectedModel = async () => {
        try {
            const storedModel = await AsyncStorage.getItem('selectedRadioButton');
            if (storedModel !== null) {
                console.log("Stored Model:", storedModel);
                setSelectedModel(storedModel);

            } else {
                console.log("Stored Model is null")
                saveSelectedModel("gpt");
            }
        } catch (error) {
            console.error('Error loading selected model from AsyncStorage:', error);
        }
    };

    const loadMessages = async (model) => {
        try {
            console.log("Loading Messages...")
            const storedMessages = await AsyncStorage.getItem(`messages_${model}`);
            if (storedMessages !== null) {
                console.log("Stored Messages is not null")
                const parsedMessages = JSON.parse(storedMessages);
                console.log("Parsed Messages: ", parsedMessages);
                setMessages(parsedMessages);
            } else {
                setMessages([]);
                console.log("Stored messages is null")
            }
        } catch (error) {
            console.error('Error loading messages from AsyncStorage:', error);
        }

    }


    const saveSelectedModel = async (model) => {
        try {
            await AsyncStorage.setItem('selectedRadioButton', model);
        } catch (error) {
            console.error('Error saving selected model to AsyncStorage:', error);
        }
    };

    const saveMessages = async (model, allMessages) => {
        try {
            await AsyncStorage.setItem(`messages_${model}`, JSON.stringify(allMessages));
            console.log("Message saved in local storage");
        } catch (error) {
            console.error("Error saving messages to local storage", error);
        }
    }

    const sendMsg = async () => {
        if (inputBoxMsg === '') {
            console.error("Please write your message")
        } else {
            setisLoading(true);
            let newMessages = [...messages] // ...messages means whatever is there in the messages array will be copied to this newmessages array
            newMessages.push({ role: 'user', content: inputBoxMsg })
            setinputBoxMsg("");
            setMessages([...newMessages])

            if (selectedModel === "gpt") {
                setreplyLabelName("GPT")
                let responseData = await openaiApiCall(newMessages); // OpenAI api
                newMessages.push(responseData);
                setMessages(newMessages);
                saveMessages(selectedModel, newMessages);
            } else if (selectedModel === "gemini") {
                setreplyLabelName("Gemini")
                let responseData = await geminiApiCall(newMessages); // Gemini api
                newMessages.push(responseData);
                setMessages(newMessages);
                saveMessages(selectedModel, newMessages);
            }

            setisLoading(false);
            scrollToBottom();
            console.log("All messages", messages)
        }
    }

    const handleInputChange = (text) => {
        setinputBoxMsg(text)
    }

    const handleDeleteMessages = async () => {
        try {
            
            await AsyncStorage.removeItem(`messages_${selectedModel}`);
            setMessages([]);
        } catch (error) {
            console.error("Error removing messages from the local storage", error)
        }

    }

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      };


    return (
        <View style={styles.container} >
            <View style={styles.deleteIcon}>
                <MCIcon name="delete-circle" size={wp(8)} color="red" onPress={handleDeleteMessages} />
            </View>

            <ScrollView style={styles.messageContainer} ref={scrollViewRef} onContentSizeChange={() => scrollToBottom()}>
                {messages.map((message, index) => (
                    <View key={index} style={message.role === "user" ? styles.userMsg : styles.assistantMsg}>
                        {message.role === "user" ? (
                            <View style={styles.msgLabel}>
                                <FAIcon name="user" size={wp(3)} color="black" />
                                <Text style={{ marginLeft: wp(1), fontSize: wp(3), color: 'black' }}>User</Text>
                            </View>
                        ) : (
                            <View style={styles.msgLabel}>
                                <FAIcon name="server" size={wp(3)} color="black" />
                                <Text style={{ marginLeft: wp(1), fontSize: wp(3), color: 'black' }}>{replyLabelName}</Text>
                            </View>
                        )}

                        <Markdown style={markdown}>{message.content}</Markdown>
                    </View>
                ))}
            </ScrollView>
            <InputView inputBoxMsg={inputBoxMsg} onInputChange={handleInputChange} onSendPress={sendMsg} isLoading={isLoading}></InputView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 20,
        padding: wp(4.5),
        backgroundColor: '#343541',
    },
    messageContainer: {
        marginTop: hp(2.5),
    },
    userMsg: {
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
    },
    assistantMsg: {
        backgroundColor: '#82BF4F',
        borderRadius: 8,
        padding: 10,
        marginVertical: 5,
    },
    msgLabel: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteIcon: {
        padding: wp(1),
        alignSelf: 'flex-end',
        marginBottom: -wp(2),
    }
});

const markdown = StyleSheet.create({
    body: {
        fontSize: hp('2%'),
        color: 'black',
    },

    blockquote: {
        marginTop: 10,
        marginBottom: 10,
    },

    fence: {
        borderColor: '#883EF8',
        backgroundColor: '#883EF8',
        color: 'white',
        marginTop: wp(2)
    },

    code_inline: {
        borderColor: '#883EF8',
        backgroundColor: '#883EF8',
        color: 'white',
    }
})