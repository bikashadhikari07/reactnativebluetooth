import RNBluetoothClassic from 'react-native-bluetooth-classic';

export async function getPairedDevices() {
  const devices = await RNBluetoothClassic.getBondedDevices();
  return devices;
}

export async function connectToDevice(device) {
  const connected = await device.connect();
  return connected;
}

export async function sendData(device, data) {
  await device.write(data + '\n');
}

export function listenToDevice(device, onData) {
  const subscription = device.onDataReceived(event => {
    onData(event.data);
  });

  return () => subscription.remove();
}
