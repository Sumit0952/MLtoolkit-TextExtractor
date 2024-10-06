import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import RNMLKitObjectDetection from 'rn-mlkit-object-detection';

const App = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [selectedTab, setSelectedTab] = useState('text'); // 'text' or 'object'
  const [detections, setDetections] = useState([]);

  // UseEffect to run detection based on selected mode
  useEffect(() => {
    if (image) {
      if (selectedTab === 'text') {
        handleTextRecognition(image);
      } else if (selectedTab === 'object') {
        handleObjectDetection(image);
      }
    }
  }, [image, selectedTab]);

  // Handle text recognition
  const handleTextRecognition = async (imagePath) => {
    try {
      const result = await TextRecognition.recognize(imagePath);
      setText(result.text);
    } catch (error) {
      console.error('Error recognizing text:', error);
    }
  };

  // Handle object detection
  const handleObjectDetection = async (imagePath) => {
    try {
      const result = await RNMLKitObjectDetection.detectFromUri(imagePath, {
        detectorMode: 'SINGLE_IMAGE',
        shouldEnableClassification: true,
        shouldEnableMultipleObjects: true,
      });
      if (result && result.length > 0) {
        setDetections(result);
        setText(`Detected ${result.length} objects`);
      } else {
        setText('No objects detected');
      }
    } catch (error) {
      console.error('Error detecting objects:', error);
      setText('Error detecting objects. Please try again.'); // User-friendly error message
    }
  };

  // Function to choose image from library
  const chooseImage = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets) {
        setImage(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MLKit App: Text Detection</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, selectedTab === 'text' && styles.selectedButton]}
          onPress={() => setSelectedTab('text')}
        >
          <Text style={styles.buttonText}>Text Recognition</Text>
        </TouchableOpacity>
       
        <TouchableOpacity style={styles.button} onPress={chooseImage}>
          <Text style={styles.buttonText}>Choose Image</Text>
        </TouchableOpacity>
      </View>

      {image && <Image source={{ uri: image }} style={styles.image} />}
      <ScrollView>
      <Text style={styles.resultText}>{text}</Text>
      </ScrollView>
      {detections.length > 0 &&
        detections.map((detection, index) => (
          <Text key={index} style={styles.detectionText}>
            Detected Object: {detection.label}
          </Text>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212', // Black background
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF', // White text
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50', // Green button
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    width: 120,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#388E3C', // Darker green for selected button
  },
  buttonText: {
    color: '#FFFFFF', // White text for button
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: '#4CAF50', // Green border
    borderWidth: 2,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text for result
    marginBottom: 10,
  },
  detectionText: {
    color: '#FFFFFF', // White text for detected objects
  },
});

export default App;
