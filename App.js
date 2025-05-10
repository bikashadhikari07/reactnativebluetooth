// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   Button,
//   PermissionsAndroid,
//   Platform,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   ActivityIndicator,
// } from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/Ionicons'; // Importing icons from Ionicons
// import {
//   getPairedDevices,
//   connectToDevice,
//   sendData,
//   listenToDevice,
// } from './src/bluetooth/BluetoothService';

// // Request Bluetooth permissions on Android
// const requestBluetoothPermissions = async () => {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, // needed for Android < 12
//       ]);
//       console.log('Bluetooth permissions:', granted);
//     } catch (err) {
//       console.warn('Permission request error:', err);
//     }
//   }
// };

// // Bluetooth Context and Bluetooth Management
// const BluetoothContext = React.createContext();

// const BluetoothProvider = ({children}) => {
//   const [devices, setDevices] = useState([]);
//   const [connectedDevice, setConnectedDevice] = useState(null);
//   const [receivedData, setReceivedData] = useState('');
//   const [customerData, setCustomerData] = useState('');
//   const [messageToSend, setMessageToSend] = useState('');
//   const [isLoading, setIsLoading] = useState(true); // Add a loading state

//   useEffect(() => {
//     const initialize = async () => {
//       await requestBluetoothPermissions();
//       const pairedDevices = await getPairedDevices();
//       setDevices(pairedDevices);
//       setIsLoading(false); // Set loading state to false after data is fetched
//     };

//     initialize();
//   }, []);

//   useEffect(() => {
//     if (connectedDevice) {
//       const unsubscribe = listenToDevice(connectedDevice, data => {
//         setReceivedData(prev => prev + '\n' + data);
//       });
//       return unsubscribe;
//     }
//   }, [connectedDevice]);

//   const handleConnect = async device => {
//     const connected = await connectToDevice(device);
//     if (connected) {
//       setConnectedDevice(device);
//     }
//   };

//   const handleSend = () => {
//     if (connectedDevice && messageToSend) {
//       sendData(connectedDevice, messageToSend);
//       setMessageToSend('');
//     }
//   };

//   return (
//     <BluetoothContext.Provider
//       value={{
//         devices,
//         connectedDevice,
//         receivedData,
//         messageToSend,
//         setMessageToSend,
//         handleConnect,
//         handleSend,
//         isLoading, // Provide the loading state
//       }}>
//       {children}
//     </BluetoothContext.Provider>
//   );
// };

// // Dashboard Screen
// const DashboardScreen = () => {
//   const {devices, connectedDevice, handleConnect, isLoading} =
//     React.useContext(BluetoothContext);

//   if (isLoading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Dashboard</Text>
//       {!connectedDevice ? (
//         <ScrollView>
//           {devices.map(device => (
//             <Button
//               key={device.address}
//               title={`Connect to ${device.name || device.address}`}
//               onPress={() => handleConnect(device)}
//             />
//           ))}
//         </ScrollView>
//       ) : (
//         <Text>Connected to {connectedDevice.name}</Text>
//       )}
//     </View>
//   );
// };

// // Serial Screen
// const SerialScreen = () => {
//   const {
//     connectedDevice,
//     receivedData,
//     messageToSend,
//     setMessageToSend,
//     handleSend,
//     isLoading,
//   } = React.useContext(BluetoothContext);

//   if (isLoading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Serial Monitor</Text>
//       {connectedDevice ? (
//         <>
//           <Text>Connected to {connectedDevice.name}</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter message"
//             value={messageToSend}
//             onChangeText={setMessageToSend}
//           />
//           <Button title="Send Data" onPress={handleSend} />
//           <ScrollView style={styles.output}>
//             <Text>{receivedData}</Text>
//           </ScrollView>
//         </>
//       ) : (
//         <Text>No device connected</Text>
//       )}
//     </View>
//   );
// };

// // Profile Screen
// const ProfileScreen = () => {
//   const {connectedDevice, isLoading} = React.useContext(BluetoothContext);

//   if (isLoading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Profile</Text>
//       {connectedDevice ? (
//         <Text>Device Address: {connectedDevice.address}</Text>
//       ) : (
//         <Text>No device connected</Text>
//       )}
//     </View>
//   );
// };

// // Navigation Setup with Icons
// const Tab = createBottomTabNavigator();

// const App = () => {
//   return (
//     <BluetoothProvider>
//       <NavigationContainer>
//         <Tab.Navigator
//           screenOptions={({route}) => ({
//             tabBarIcon: ({color, size}) => {
//               let iconName;
//               if (route.name === 'Dashboard') {
//                 iconName = 'ios-home'; // Dashboard icon
//               } else if (route.name === 'Serial') {
//                 iconName = 'ios-tv'; // Serial icon
//               } else if (route.name === 'Profile') {
//                 iconName = 'ios-person'; // Profile icon
//               }
//               return <Icon name={iconName} size={size} color={color} />;
//             },
//           })}>
//           <Tab.Screen name="Dashboard" component={DashboardScreen} />
//           <Tab.Screen name="Serial" component={SerialScreen} />
//           <Tab.Screen name="Profile" component={ProfileScreen} />
//         </Tab.Navigator>
//       </NavigationContainer>
//     </BluetoothProvider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, padding: 20, paddingTop: 50},
//   header: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
//   input: {
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginVertical: 10,
//     padding: 10,
//   },
//   output: {
//     height: 200,
//     backgroundColor: '#eee',
//     padding: 10,
//     marginTop: 10,
//   },
// });

// export default App;
///new code here
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  getPairedDevices,
  connectToDevice,
  sendData,
  listenToDevice,
} from './src/bluetooth/BluetoothService';

// Request Bluetooth permissions on Android
const requestBluetoothPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      console.log('Bluetooth permissions:', granted);
    } catch (err) {
      console.warn('Permission request error:', err);
    }
  }
};

const BluetoothContext = React.createContext();

const BluetoothProvider = ({children}) => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [receivedData, setReceivedData] = useState('');
  const [customerData, setCustomerData] = useState('');
  const [messageToSend, setMessageToSend] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      await requestBluetoothPermissions();
      const pairedDevices = await getPairedDevices();
      setDevices(pairedDevices);
      setIsLoading(false);
    };

    initialize();
  }, []);

  useEffect(() => {
    if (connectedDevice) {
      const unsubscribe = listenToDevice(connectedDevice, async data => {
        setReceivedData(prev => prev + '\n' + data);

        // Replace %20 logic
      });
      return unsubscribe;
    }
  }, [connectedDevice]);

  const handleConnect = async device => {
    const connected = await connectToDevice(device);
    if (connected) {
      setConnectedDevice(device);
    }
  };

  const handleSend = () => {
    if (connectedDevice && messageToSend) {
      sendData(connectedDevice, messageToSend);
      setMessageToSend('');
    }
  };

  return (
    <BluetoothContext.Provider
      value={{
        devices,
        connectedDevice,
        receivedData,
        messageToSend,
        setMessageToSend,
        handleConnect,
        handleSend,
        isLoading,
        customerData,
      }}>
      {children}
    </BluetoothContext.Provider>
  );
};

// Dashboard Screen
//json parse error

const DashboardScreen = () => {
  const {devices, connectedDevice, handleConnect, isLoading, receivedData} =
    React.useContext(BluetoothContext);

  const [customerName, setCustomerName] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  // const handleSend = async () => {
  //   const encodedInput = encodeURIComponent(inputValue.trim());

  //   try {
  //     const response = await fetch(
  //       `http://192.168.1.65:3000/api/customer/${encodedInput}`,
  //       {
  //         headers: {
  //           Accept: 'application/json',
  //         },
  //       },
  //     );

  //     const contentType = response.headers.get('content-type');
  //     if (!contentType || !contentType.includes('application/json')) {
  //       const text = await response.text();
  //       console.warn('Expected JSON but received:', text);
  //       setResponseMessage(text);
  //       return;
  //     }

  //     const data = await response.json();
  //     const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

  //     if (parsedData.name) {
  //       setResponseMessage(`Customer Name: ${parsedData.name}`);
  //     } else {
  //       setResponseMessage('No customer found.');
  //     }
  //   } catch (err) {
  //     console.warn('Error sending request:', err.message);
  //     setResponseMessage('Error: ' + err.message);
  //   }
  // };

  // useEffect(() => {}, [receivedData]);
  useEffect(() => {
    if (receivedData) {
      const lines = receivedData.trim().split('\n');
      const lastLine = lines[lines.length - 1];

      const rfidMatch = lastLine.match(/RFID:([^;]+)/);
      const rawRfid = rfidMatch ? rfidMatch[1].trim() : null;

      if (!rawRfid) {
        console.warn('RFID not found in received data:', lastLine);
        return;
      }

      const formattedRfid = encodeURIComponent(rawRfid);
      console.log('Formatted RFID:', formattedRfid);

      const fetchCustomer = async () => {
        try {
          const response = await fetch(
            `http://192.168.1.65:3000/api/customer/${formattedRfid}`,
            {
              headers: {
                Accept: 'application/json',
              },
            },
          );

          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.warn('Expected JSON but received:', text);
            return;
          }

          const data = await response.json();
          const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

          if (parsedData.name) {
            setCustomerName(parsedData.name);
          }
        } catch (err) {
          console.warn(
            'Error fetching customer from device data:',
            err.message,
          );
        }
      };

      fetchCustomer();
    }
  }, [receivedData]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
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
        <>
          <Text>Connected to {connectedDevice.name}</Text>
          <TextInput
            style={{
              height: 40,
              borderColor: '#888',
              borderWidth: 1,
              paddingHorizontal: 10,
              marginVertical: 10,
            }}
            placeholder="Enter RFID or ID"
            value={inputValue}
            onChangeText={setInputValue}
          />
          {/*  <Button title="Send" onPress={handleSend} />
          {responseMessage ? (
            <Text style={{marginTop: 10}}>{responseMessage}</Text>
          ) : null} */}
          {customerName ? (
            <Text style={{marginTop: 20, fontSize: 18}}>
              Name: {customerName}
            </Text>
          ) : (
            <Text style={{marginTop: 20}}>Waiting for data...</Text>
          )}
        </>
      )}
    </View>
  );
};

// Serial Screen
const SerialScreen = () => {
  const {
    connectedDevice,
    receivedData,
    messageToSend,
    setMessageToSend,
    handleSend,
    isLoading,
  } = React.useContext(BluetoothContext);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Serial Monitor</Text>
      {connectedDevice ? (
        <>
          <Text>Connected to {connectedDevice.name}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter message"
            value={messageToSend}
            onChangeText={setMessageToSend}
          />
          <Button title="Send Data" onPress={handleSend} />
          <ScrollView style={styles.output}>
            <Text>{receivedData}</Text>
          </ScrollView>
        </>
      ) : (
        <Text>No device connected</Text>
      )}
    </View>
  );
};

// Profile Screen
const ProfileScreen = () => {
  const {connectedDevice, isLoading} = React.useContext(BluetoothContext);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      {connectedDevice ? (
        <Text>Device Address: {connectedDevice.address}</Text>
      ) : (
        <Text>No device connected</Text>
      )}
    </View>
  );
};

// Navigation Setup with Icons
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <BluetoothProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({color, size}) => {
              let iconName;
              if (route.name === 'Dashboard') {
                iconName = 'ios-home';
              } else if (route.name === 'Serial') {
                iconName = 'ios-tv';
              } else if (route.name === 'Profile') {
                iconName = 'ios-person';
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
          })}>
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Serial" component={SerialScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </BluetoothProvider>
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
