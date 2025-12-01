// app/(tabs)/add.tsx

import { PALETTE } from '@/constants/Colors';
import { BARANGAYS } from '@/constants/Data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { Button, IconButton, Menu, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_HEIGHT = Dimensions.get('window').height;

// Default GenSan Region for the picker
const GENSAN_REGION = {
  latitude: 6.1164,
  longitude: 125.1716,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function AddListingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  // --- FORM STATES ---
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [details, setDetails] = useState('');
  const [type, setType] = useState('Commercial');
  
  // Barangay Dropdown
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [barangay, setBarangay] = useState('');

  // Location & Polygon States
  const [mapVisible, setMapVisible] = useState(false);
  const [tempMarker, setTempMarker] = useState<any>(null); // { latitude, longitude }
  const [tempPolygon, setTempPolygon] = useState<any[]>([]); // Array of coords

  // Image Simulation
  const [images, setImages] = useState<string[]>([]);

  // --- HANDLERS ---

  const handleAddImage = () => {
    // Simulating adding an image from gallery
    const newImage = `https://source.unsplash.com/random/400x300?house&sig=${Math.random()}`;
    setImages([...images, newImage]);
  };

  const handleMapTap = (e: any) => {
    const coord = e.nativeEvent.coordinate;

    if (!tempMarker) {
      // First tap sets the PIN (Location)
      setTempMarker(coord);
    } else {
      // Subsequent taps add corners to the POLYGON
      setTempPolygon([...tempPolygon, coord]);
    }
  };

  const undoLastPoint = () => {
    if (tempPolygon.length > 0) {
      setTempPolygon(tempPolygon.slice(0, -1));
    } else if (tempMarker) {
      setTempMarker(null);
    }
  };

  const resetMap = () => {
    setTempMarker(null);
    setTempPolygon([]);
  };

  const saveLocation = () => {
    setMapVisible(false);
  };

  const handleSubmit = () => {
    // Construct the final object
    const newListing = {
      id: Math.random(),
      title,
      price,
      type,
      address: `${barangay}, GenSan`,
      details,
      lat: tempMarker?.latitude,
      lng: tempMarker?.longitude,
      images: images,
      payToView: true,
      polygon: tempPolygon
    };

    console.log("Submitting Listing:", newListing);
    // Here you would typically POST to backend
    router.replace('/');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/')}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={PALETTE.support} />
        </TouchableOpacity>
        <Text variant="titleLarge" style={styles.title}>New Listing</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* 1. IMAGES SECTION */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Property Images</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            <TouchableOpacity style={styles.uploadBox} onPress={handleAddImage}>
                <MaterialCommunityIcons name="camera-plus" size={30} color="gray" />
                <Text style={{color: 'gray', fontSize: 10, marginTop: 5}}>Add Photo</Text>
            </TouchableOpacity>
            {images.map((img, index) => (
                <View key={index} style={styles.imagePreview}>
                    <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} />
                    <TouchableOpacity 
                        style={styles.removeImg} 
                        onPress={() => setImages(images.filter((_, i) => i !== index))}
                    >
                        <MaterialCommunityIcons name="close" size={12} color="#fff" />
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>

        {/* 2. BASIC INFO */}
        <TextInput 
            mode="outlined" 
            label="Property Title" 
            style={styles.input} 
            activeOutlineColor={PALETTE.primary} 
            value={title}
            onChangeText={setTitle}
        />
        
        <View style={styles.rowInputs}>
            <TextInput 
                mode="outlined" 
                label="Price (PHP)" 
                style={[styles.input, { flex: 1 }]} 
                activeOutlineColor={PALETTE.primary} 
                keyboardType="numeric" 
                value={price}
                onChangeText={setPrice}
            />
            {/* Type Selector */}
            <View style={{flex: 1, justifyContent:'center'}}>
                <View style={styles.typeRow}>
                    <TouchableOpacity 
                        style={[styles.typeBtn, type === 'Commercial' && styles.typeBtnActive]}
                        onPress={() => setType('Commercial')}
                    >
                        <Text style={{color: type === 'Commercial' ? '#fff' : 'gray', fontSize: 12}}>Commercial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.typeBtn, type === 'Private' && styles.typeBtnActive]}
                        onPress={() => setType('Private')}
                    >
                        <Text style={{color: type === 'Private' ? '#fff' : 'gray', fontSize: 12}}>Private</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        {/* 3. LOCATION & MAP */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Location & Plot</Text>
        
        {/* Barangay Picker */}
        <Menu
            visible={visibleMenu}
            onDismiss={() => setVisibleMenu(false)}
            anchor={
                <TouchableOpacity onPress={() => setVisibleMenu(true)} style={styles.dropdownTrigger}>
                        <Text style={{ color: barangay ? '#000' : 'gray', fontSize: 16 }}>
                        {barangay || "Select Barangay"}
                        </Text>
                        <MaterialCommunityIcons name="chevron-down" size={24} color="gray" />
                </TouchableOpacity>
            }
            contentStyle={{ maxHeight: 250, backgroundColor: '#fff' }}
        >
            <ScrollView style={{ maxHeight: 200 }}>
                {BARANGAYS.map((b) => (
                    <Menu.Item key={b} onPress={() => { setBarangay(b); setVisibleMenu(false); }} title={b} />
                ))}
            </ScrollView>
        </Menu>

        {/* Open Map Button */}
        <TouchableOpacity style={styles.mapTrigger} onPress={() => setMapVisible(true)}>
            <View style={{flexDirection:'row', alignItems:'center', gap: 10}}>
                <MaterialCommunityIcons name="map-marker-path" size={24} color={tempMarker ? PALETTE.primary : "gray"} />
                <View>
                    <Text style={{fontWeight:'bold', color: PALETTE.support}}>
                        {tempMarker ? "Location Set" : "Set Location on Map"}
                    </Text>
                    <Text style={{fontSize: 12, color:'gray'}}>
                        {tempPolygon.length > 2 ? `${tempPolygon.length} corners defined` : "Tap to pin and draw plot"}
                    </Text>
                </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="gray" />
        </TouchableOpacity>


        {/* 4. DETAILS */}
        <Text variant="titleMedium" style={[styles.sectionTitle, {marginTop: 20}]}>Description</Text>
        <TextInput 
            mode="outlined" 
            label="Property Details, Highlights, etc." 
            style={styles.textArea} 
            activeOutlineColor={PALETTE.primary} 
            multiline
            numberOfLines={4}
            value={details}
            onChangeText={setDetails}
        />

        <View style={{height: 20}} />

        <Button 
            mode="contained" 
            buttonColor={PALETTE.secondary} 
            style={styles.submitBtn} 
            textColor={PALETTE.support}
            onPress={handleSubmit}
            contentStyle={{height: 50}}
        >
            Publish Listing
        </Button>
        <View style={{height: 50}} />
      </ScrollView>

      {/* --- MAP MODAL FOR PINNING AND DRAWING --- */}
      <Portal>
        <Modal visible={mapVisible} onDismiss={() => setMapVisible(false)} contentContainerStyle={styles.fullScreenModal}>
            <View style={styles.mapHeader}>
                <Text variant="titleMedium" style={{color:'#fff', fontWeight:'bold'}}>
                    {!tempMarker ? "Step 1: Tap to Pin Location" : "Step 2: Tap corners to Draw Plot"}
                </Text>
                <IconButton icon="close" iconColor="#fff" size={20} onPress={() => setMapVisible(false)} />
            </View>
            
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                initialRegion={GENSAN_REGION}
                onPress={handleMapTap}
            >
                {/* 1. The Pin */}
                {tempMarker && (
                    <Marker coordinate={tempMarker} title="Property Center" />
                )}

                {/* 2. The Polygon being drawn */}
                {tempPolygon.length > 0 && (
                     <Polygon
                        coordinates={tempPolygon}
                        fillColor="rgba(8, 154, 150, 0.3)"
                        strokeColor={PALETTE.primary}
                        strokeWidth={2}
                    />
                )}
                
                {/* Show dots for polygon corners */}
                {tempPolygon.map((p, i) => (
                    <Marker key={i} coordinate={p} anchor={{x:0.5, y:0.5}}>
                        <View style={styles.polyDot} />
                    </Marker>
                ))}
            </MapView>

            {/* Map Controls */}
            <View style={styles.mapControls}>
                <View style={styles.controlRow}>
                    <Button mode="contained" buttonColor="#fff" textColor="red" onPress={resetMap} style={{marginRight: 10}}>
                        Reset
                    </Button>
                    <Button mode="contained" buttonColor="#fff" textColor="gray" onPress={undoLastPoint}>
                        Undo
                    </Button>
                </View>
                <Button 
                    mode="contained" 
                    buttonColor={PALETTE.secondary} 
                    textColor={PALETTE.support} 
                    style={{marginTop: 10}}
                    onPress={saveLocation}
                    disabled={!tempMarker}
                >
                    Confirm Location
                </Button>
            </View>
        </Modal>
      </Portal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 10 },
  title: { fontWeight: 'bold', color: PALETTE.support },
  content: { padding: 20 },
  
  sectionTitle: { fontWeight: 'bold', color: PALETTE.support, marginBottom: 10 },
  
  // Images
  imageScroll: { flexDirection: 'row', marginBottom: 20 },
  uploadBox: { 
    width: 80, height: 80, backgroundColor: '#f0f4f1', borderRadius: 8, borderWidth: 1, 
    borderColor: '#ddd', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginRight: 10 
  },
  imagePreview: { width: 80, height: 80, borderRadius: 8, overflow:'hidden', marginRight: 10, position:'relative' },
  removeImg: { position:'absolute', top: 2, right: 2, backgroundColor:'rgba(0,0,0,0.5)', borderRadius: 10, padding: 2 },

  // Inputs
  input: { marginBottom: 15, backgroundColor: '#fff' },
  rowInputs: { flexDirection: 'row', gap: 10 },
  textArea: { backgroundColor: '#fff' },

  // Type Toggle
  typeRow: { flexDirection: 'row', backgroundColor: '#eee', borderRadius: 8, padding: 2, height: 50, alignItems:'center' },
  typeBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 6, height: '90%' },
  typeBtnActive: { backgroundColor: PALETTE.primary, shadowColor:'#000', elevation: 2 },

  // Custom Dropdown & Map Trigger
  dropdownTrigger: {
      borderWidth: 1, borderColor: 'gray', borderRadius: 4, padding: 15,
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      backgroundColor: '#fff', marginBottom: 15
  },
  mapTrigger: {
      borderWidth: 1, borderColor: PALETTE.primary, borderRadius: 8, padding: 15,
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      backgroundColor: 'rgba(8, 154, 150, 0.05)'
  },

  submitBtn: { marginTop: 10 },

  // Map Modal
  fullScreenModal: { flex: 1, backgroundColor: '#fff' },
  mapHeader: { 
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems:'center',
    paddingTop: 40, paddingHorizontal: 20, paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.6)' 
  },
  mapControls: {
      position: 'absolute', bottom: 30, left: 20, right: 20,
      backgroundColor: 'transparent'
  },
  controlRow: { flexDirection: 'row', justifyContent:'space-between' },
  polyDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: PALETTE.secondary, borderWidth: 1, borderColor:'#fff' }
});