import { TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import React from 'react'
import LottieView from 'lottie-react-native';

export default function InputView({ inputBoxMsg, onInputChange, onSendPress, isLoading }) {
  return (
    <KeyboardAvoidingView style={styles.inputContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <TextInput style={styles.input}
        placeholder="Type your message..."
        placeholderTextColor={'white'}
        value={inputBoxMsg}
        onChangeText={onInputChange}></TextInput>

      <TouchableOpacity onPress={onSendPress}>
        {isLoading ? (
          // <LottieView style={styles.loading} source={require('../../assets/loading.json')} autoPlay loop />
          <LottieView style={styles.loading} source={require('../../assets/loading-earth.json')} autoPlay loop />
        ) : (
          <FAIcon name="arrow-circle-up" size={wp(10.5)} color="white" />

        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({

  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: hp('2%'),
    color: 'white',
    width: wp('75%'),
    height: hp('5%')
  },
  image: {
    width: wp('80%'),
    height: hp('30%'),
    borderRadius: 8,
  },
  loading: {
    width: wp(10),
    height: hp(5),
  }
})