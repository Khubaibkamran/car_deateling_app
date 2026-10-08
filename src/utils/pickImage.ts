import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

async function fromCamera(): Promise<string | null> {
  const { granted } = await ImagePicker.requestCameraPermissionsAsync();
  if (!granted) {
    Alert.alert('Camera access needed', 'Allow camera access in Settings to take a photo.');
    return null;
  }
  const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
  return result.canceled ? null : result.assets[0].uri;
}

async function fromLibrary(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
  return result.canceled ? null : result.assets[0].uri;
}

/** Asks "camera or library?" and resolves with the chosen square photo's URI, or null if cancelled. */
export function chooseProfilePhoto(): Promise<string | null> {
  return new Promise((resolve) => {
    Alert.alert(
      'Change photo',
      undefined,
      [
        { text: 'Take Photo', onPress: () => fromCamera().then(resolve, () => resolve(null)) },
        { text: 'Choose from Library', onPress: () => fromLibrary().then(resolve, () => resolve(null)) },
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
      ],
      { cancelable: true, onDismiss: () => resolve(null) },
    );
  });
}
