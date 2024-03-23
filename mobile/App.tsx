import { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Image, View, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { styles } from './styles';
import { Button } from './components/Button';

export default function App() {
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const imagePlaceholder = 'https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg'
  const [isLoading, setIsLoading] = useState(false)

  const getPermissionAsync = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
  }
  const handleSelectedImage = async () => {
    setIsLoading(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true
      });

      if (!result.canceled) {
        setSelectedImageUri(result.uri);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }

  }
  return (
    <View style={styles.container}>
      <StatusBar style="light"
        backgroundColor="transparent"
        translucent 
        />
      <Image style={styles.image}
        source={{ uri: selectedImageUri ? selectedImageUri : imagePlaceholder }}
      />
      <View style={styles.results}></View>
      {isLoading ?
        <ActivityIndicator color="#5F1BBF" />
        : <Button title='select an image' onPress={handleSelectedImage} />
      }
    </View>
  );
}


