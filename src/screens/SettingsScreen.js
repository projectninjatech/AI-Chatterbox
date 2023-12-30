import { View, Text, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useState, useEffect } from 'react'
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [checked, setChecked] = useState('gpt');
  useEffect(() => {
    loadStoredValue();
  }, []);

  const loadStoredValue = async () => {
    try {
      const storedValue = await AsyncStorage.getItem('selectedRadioButton');
      console.log("Async Stored", storedValue);
      if (storedValue != null) {
        setChecked(storedValue);
      } else {
        saveValueToStorage("gpt")
      }
    } catch (error) {
      console.error("Error loading the value from storage", error)
    }
  }

  const saveValueToStorage = async (value) => {
    try {
      await AsyncStorage.setItem('selectedRadioButton', value)
    } catch (error) {
      console.error("Error storing the value", error)
    }
  }

  const handleRadioButtonPress = (value) => {
    setChecked(value);
    saveValueToStorage(value);
  }

  return (
    <View style={styles.container}>
      <Text style={{ color: 'white', fontSize: hp(2), marginTop: hp(2), marginBottom: hp(1) }}>Choose Your AI Text Model:</Text>
      <View style={styles.radioButtonGroup}>
        <RadioButton
          uncheckedColor='white'
          value="gpt"
          status={checked === 'gpt' ? 'checked' : 'unchecked'}
          onPress={() => handleRadioButtonPress('gpt')}
        />
        <Text style={{ color: 'white', fontSize: hp(2) }}>GPT 3.5</Text>
      </View>

      <View style={styles.radioButtonGroup}>
        <RadioButton
          uncheckedColor='white'
          value="gemini"
          status={checked === 'gemini' ? 'checked' : 'unchecked'}
          onPress={() => handleRadioButtonPress('gemini')}
        />
        <Text style={{ color: 'white', fontSize: hp(2) }}>Gemini</Text>
      </View>

      <Text style={{ color: 'red' }}>*You need to restart the app for the changes to take effect.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(5),
    backgroundColor: '#343541',
  },

  innerText: {
    color: 'white'
  },
  
  radioButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  }
})