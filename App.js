import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  getPairedDevices,
  connectToDevice,
  sendData,
  listenToDevice,
} from './src/bluetooth/BluetoothService';

const requestBluetoothPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, // needed on Android < 12
      ]);

      console.log('Bluetooth permissions:', granted);
    } catch (err) {
      console.warn('Permission request error:', err);
    }
  }
};

const App = () => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [receivedData, setReceivedData] = useState('');
  const [messageToSend, setMessageToSend] = useState('');

  useEffect(() => {
    const initialize = async () => {
      await requestBluetoothPermissions(); // Step 1: Ask for Bluetooth permissions
      const pairedDevices = await getPairedDevices(); // Step 2: Fetch paired devices
      setDevices(pairedDevices);
    };

    initialize();
  }, []);

  useEffect(() => {
    if (connectedDevice) {
      const unsubscribe = listenToDevice(connectedDevice, data => {
        setReceivedData(prev => prev + '\n' + data);
      });

      return unsubscribe;
    }
  }, [connectedDevice]);

  const handleConnect = async device => {
    const connected = await connectToDevice(device);
    if (connected) setConnectedDevice(device);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bluetooth Classic</Text>
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
        <View>
          <Text>Connected to {connectedDevice.name}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter message"
            value={messageToSend}
            onChangeText={setMessageToSend}
          />
          <Button
            title="Send Data"
            onPress={() => sendData(connectedDevice, messageToSend)}
          />
          <ScrollView style={styles.output}>
            <Text>{receivedData}</Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, paddingTop: 50},
  header: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
  },
  output: {
    height: 200,
    backgroundColor: '#eee',
    padding: 10,
    marginTop: 10,
  },
});

export default App;
