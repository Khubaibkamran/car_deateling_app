import * as ImagePicker from 'expo-image-picker';
import { Alert } from '../components/AppAlert';

type Aspect = [number, number];

async function fromCamera(aspect: Aspect): Promise<string | null> {
  const { granted } = await ImagePicker.requestCameraPermissionsAsync();
  if (!granted) {
    Alert.alert('Camera access needed', 'Allow camera access in Settings to take a photo.');
    return null;
  }
  const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, aspect, quality: 0.8 });
  return result.canceled ? null : result.assets[0].uri;
}

async function fromLibrary(aspect: Aspect): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect, quality: 0.8 });
  return result.canceled ? null : result.assets[0].uri;
}

/** Asks "camera or library?" and resolves with the chosen square photo's URI, or null if cancelled. */
export function chooseProfilePhoto(): Promise<string | null> {
  return choosePhoto('Change photo', [1, 1]);
}

/** Same as above for a vehicle: a wide 16:9 photo. */
export function chooseVehiclePhoto(): Promise<string | null> {
  return choosePhoto('Vehicle photo', [16, 9]);
}

function choosePhoto(title: string, aspect: Aspect): Promise<string | null> {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      undefined,
      [
        { text: 'Take Photo', onPress: () => fromCamera(aspect).then(resolve, () => resolve(null)) },
        { text: 'Choose from Library', onPress: () => fromLibrary(aspect).then(resolve, () => resolve(null)) },
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
      ],
      { cancelable: true, onDismiss: () => resolve(null) },
    );
  });
}
