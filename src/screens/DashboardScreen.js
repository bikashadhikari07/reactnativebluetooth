// import React, {useEffect, useState} from 'react';
// import {View, Text, Button, FlatList, TouchableOpacity} from 'react-native';
// import RNBluetoothClassic from 'react-native-bluetooth-classic';

// const DashboardScreen = () => {
//   const [devices, setDevices] = useState([]);
//   const [connectedDevice, setConnectedDevice] = useState(null);

//   useEffect(() => {
//     checkConnection();
//   }, []);

//   const checkConnection = async () => {
//     const connected = await RNBluetoothClassic.getConnectedDevices();
//     if (connected.length > 0) setConnectedDevice(connected[0]);
//   };

//   const scanForDevices = async () => {
//     try {
//       const bonded = await RNBluetoothClassic.getBondedDevices();
//       setDevices(bonded);
//     } catch (err) {
//       console.error('Scan Error', err);
//     }
//   };

//   const connectToDevice = async device => {
//     try {
//       const connected = await RNBluetoothClassic.connectToDevice(
//         device.address,
//       );
//       if (connected) setConnectedDevice(device);
//     } catch (err) {
//       console.error('Connection Error', err);
//     }
//   };

//   return (
//     <View>
//       {connectedDevice ? (
//         <Text>Connected to: {connectedDevice.name}</Text>
//       ) : (
//         <>
//           <Button title="Scan for Devices" onPress={scanForDevices} />
//           <FlatList
//             data={devices}
//             keyExtractor={item => item.address}
//             renderItem={({item}) => (
//               <TouchableOpacity onPress={() => connectToDevice(item)}>
//                 <Text>{item.name || item.address}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         </>
//       )}
//     </View>
//   );
// };

// export default DashboardScreen;
