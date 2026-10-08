import * as ImagePicker from 'expo-image-picker';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Alert } from './AppAlert';
import { colors } from '../constants/theme';
import { CloseIcon, UploadBoxIcon } from './jobIcons';

type Props = {
  /** Local image URIs. */
  photos: string[];
  onChange: (photos: string[]) => void;
  max?: number;
};

const SIZE = 68;

async function pickFromCamera(): Promise<string | null> {
  const { granted } = await ImagePicker.requestCameraPermissionsAsync();
  if (!granted) {
    Alert.alert('Camera access needed', 'Allow camera access in Settings to take a photo.');
    return null;
  }
  const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 });
  return result.canceled ? null : result.assets[0].uri;
}

async function pickFromLibrary(): Promise<string[]> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.7,
    allowsMultipleSelection: true,
  });
  return result.canceled ? [] : result.assets.map((a) => a.uri);
}

// Row of photo thumbnails (tap the cross to remove one) followed by an "add photo" tile.
export default function PhotoUploader({ photos, onChange, max = 6 }: Props) {
  const add = (uris: string[]) => onChange([...photos, ...uris].slice(0, max));

  const choose = () => {
    Alert.alert('Add photo', undefined, [
      {
        text: 'Take Photo',
        onPress: async () => {
          const uri = await pickFromCamera();
          if (uri) add([uri]);
        },
      },
      { text: 'Choose from Library', onPress: async () => add(await pickFromLibrary()) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.row}>
      {photos.map((uri, i) => (
        <View key={uri} style={styles.thumb}>
          <Image source={{ uri }} style={styles.image} />
          <Pressable
            style={styles.remove}
            onPress={() => onChange(photos.filter((_, j) => j !== i))}
            hitSlop={8}
            accessibilityLabel="Remove photo"
          >
            <CloseIcon size={10} />
          </Pressable>
        </View>
      ))}
      {photos.length < max && (
        <Pressable style={styles.add} onPress={choose} accessibilityLabel="Add photo">
          <UploadBoxIcon />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  thumb: { width: SIZE, height: SIZE, borderRadius: 8, overflow: 'hidden', backgroundColor: colors.border },
  image: { width: '100%', height: '100%' },
  remove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    width: SIZE,
    height: SIZE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
