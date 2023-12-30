import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState, useRef } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import InputView from '../components/inputView';
import { dalleApiCall } from '../api/dalle';
import ImageView from "react-native-image-viewing";
import RNFetchBlob from 'rn-fetch-blob'

export default function ImageScreen() {

  const [inputBoxMsg, setinputBoxMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const scrollViewRef = useRef();
  const [visible, setIsVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const sendMsg = async () => {
    if (inputBoxMsg === '') {
      console.error("Please write your message")
    } else {
      setisLoading(true);
      let newMessages = [...messages]
      newMessages.push({ role: 'user', content: inputBoxMsg })
      setinputBoxMsg("");
      setMessages([...newMessages])
      let responseData = await dalleApiCall(inputBoxMsg); // Gemini api
      newMessages.push(responseData);
      setMessages(newMessages);
      setisLoading(false);
      scrollToBottom()
      console.log("All messages", messages)
    }
  }

  const handleInputChange = (text) => {
    setinputBoxMsg(text);
  }

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const openImageViewer = (index) => {
    setSelectedImageIndex(index);
    setIsVisible(true);
  }


  const closeImageViewer = () => {
    setIsVisible(false);
  }

  const handleDownload = (downloadLink) => {

    const date = new Date();
    
    RNFetchBlob
      .config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: 'Downloaded File',
          mime: 'image/png',
          description: 'File downloaded from your app',
          path: RNFetchBlob.fs.dirs.DownloadDir+'/downloadedFile'+Math.floor(date.getDate() + date.getSeconds() / 2)+'.png', // Change the file name and extension accordingly
        },
      })
      .fetch('GET', downloadLink, {
        //some headers ..
      })
      .then((res) => {
        // the temp file path
        console.log('The file saved to ', res.path())
      })
  }

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} onContentSizeChange={() => scrollToBottom()}>
        {messages.map((message, index) => (

          <View key={index} style={message.role === "user" ? styles.userMsg : styles.assistantMsg}>
            {message.role === 'user' ? (
              <Text style={styles.userText}>{message.content}</Text>
            ) : (
              <TouchableOpacity key={index} onPress={() => openImageViewer(index)}>
                <Image source={{ uri: message.content }} style={styles.image} />
              </TouchableOpacity>
            )}

            {
              message.role !== "user" && (
                <TouchableOpacity onPress={() => handleDownload(message.content)}>
                  <FAIcon style={styles.downloadIcon} name="download" size={wp(5)} color="white" />
                </TouchableOpacity>
              )
            }
          </View>

        ))}
      </ScrollView>


      <ImageView images={[{ uri: messages[selectedImageIndex]?.content }]} imageIndex={0} visible={visible} onRequestClose={closeImageViewer} />

      <InputView inputBoxMsg={inputBoxMsg} onInputChange={handleInputChange} onSendPress={sendMsg} isLoading={isLoading}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#343541'
  },

  userMsg: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  assistantMsg: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },

  image: {
    width: wp('80%'),
    height: hp('30%'),
    borderRadius: 8,
  },

  downloadIcon: {
    marginTop: hp(1)
  }
})