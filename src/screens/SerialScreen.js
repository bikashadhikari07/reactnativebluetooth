import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  getPairedDevices,
  connectToDevice,
  sendData,
  listenToDevice,
} from '../bluetooth/BluetoothService'; // Adjust path if needed

const requestBluetoothPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, // for Android < 12
      ]);
      console.log('Permissions:', granted);
    } catch (error) {
      console.warn('Permission error:', error);
    }
  }
};

const SerialScreen = () => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [messageToSend, setMessageToSend] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(() => {
    const initializeBluetooth = async () => {
      await requestBluetoothPermissions();
      const pairedDevices = await getPairedDevices();
      setDevices(pairedDevices);
    };

    initializeBluetooth();
  }, []);

  useEffect(() => {
    if (connectedDevice) {
      const unsubscribe = listenToDevice(connectedDevice, data => {
        setReceivedMessages(prev => [...prev, data]);
      });

      return unsubscribe;
    }
  }, [connectedDevice]);

  const handleConnect = async device => {
    const isConnected = await connectToDevice(device);
    if (isConnected) setConnectedDevice(device);
  };

  const handleSend = () => {
    if (connectedDevice && messageToSend) {
      sendData(connectedDevice, messageToSend);
      setMessageToSend('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Serial Monitor</Text>
      {!connectedDevice ? (
        <ScrollView>
          {devices.map(device => (
            <Button
              key={device.address}
              title={`Connect to ${device.name || device.address}`}
              onPress={() => handleConnect(device)}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={{flex: 1}}>
          <Text style={styles.connectedText}>
            Connected to {connectedDevice.name}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={messageToSend}
            onChangeText={setMessageToSend}
          />
          <Button title="Send" onPress={handleSend} />
          <ScrollView style={styles.messageBox}>
            {receivedMessages.map((msg, index) => (
              <Text key={index} style={styles.messageText}>
                {msg}
              </Text>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, paddingTop: 40},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  connectedText: {fontSize: 16, marginBottom: 10},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  messageBox: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  messageText: {
    fontSize: 14,
    marginVertical: 2,
  },
});

export default SerialScreen;
