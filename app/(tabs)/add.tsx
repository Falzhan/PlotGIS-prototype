// app/(tabs)/add.tsx

import { PALETTE } from '@/constants/Colors';
import { BARANGAYS, BARANGAY_COORDINATES } from '@/constants/Data';
import { useListings } from '@/context/ListingContext'; // Import Context
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { Button, IconButton, Modal, Portal, Text, TextInput, Tooltip } from 'react-native-paper'; // Added Tooltip
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const GENSAN_REGION = {
  latitude: 6.1164,
  longitude: 125.1716,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Helper for Random Unsplash Images
const getRandomImage = (keyword: string) => {
  return `https://source.unsplash.com/random/400x300?${keyword}&sig=${Math.random()}`;
};

// Fallback if source.unsplash is slow, use these ID based ones
const MOCK_IMAGES = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
];

const MOCK_DOCS = [
    'https://images.unsplash.com/photo-1618044733300-9472054094ee?w=400', // Paper texture
    'https://images.unsplash.com/photo-1583521214690-73421a1829a9?w=400', // Envelope
];

export default function AddListingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  
  // Use Context
  const { addListing } = useListings();

  // --- FORM STATES ---
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [details, setDetails] = useState('');
  const [type, setType] = useState('Commercial');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [barangay, setBarangay] = useState('');

  // Location & Polygon
  const [mapVisible, setMapVisible] = useState(false);
  const [tempMarker, setTempMarker] = useState<any>(null); 
  const [tempPolygon, setTempPolygon] = useState<any[]>([]);

  // Images & Docs
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);

  // Handlers
  const handleAddImage = () => {
    // Pick a random image from mock list for speed/reliability
    const randomImg = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
    setImages([...images, randomImg]);
  };

  const handleAddDocument = () => {
    const randomDoc = MOCK_DOCS[Math.floor(Math.random() * MOCK_DOCS.length)];
    setDocuments([...documents, randomDoc]);
  };

  const handleOpenMap = () => {
    setMapVisible(true);
    let center = GENSAN_REGION;
    if (barangay && BARANGAY_COORDINATES[barangay]) {
        center = {
            latitude: BARANGAY_COORDINATES[barangay].latitude,
            longitude: BARANGAY_COORDINATES[barangay].longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015
        };
    }
    setTimeout(() => { mapRef.current?.animateToRegion(center, 500); }, 200);
  };

  const handleMapTap = (e: any) => {
    const coord = e.nativeEvent.coordinate;
    if (!tempMarker) setTempMarker(coord);
    else setTempPolygon([...tempPolygon, coord]);
  };

  const undoLastPoint = () => {
    if (tempPolygon.length > 0) setTempPolygon(tempPolygon.slice(0, -1));
    else if (tempMarker) setTempMarker(null);
  };

  const resetMap = () => { setTempMarker(null); setTempPolygon([]); };
  const saveLocation = () => { setMapVisible(false); };

  const handleSubmit = () => {
    // Create the Listing Object
    const newListing = {
      id: Math.random().toString(), // Random ID
      title: title || 'New Untitled Listing',
      price: price ? `₱${price}` : 'Price on Request',
      type,
      address: barangay ? `${barangay}, GenSan` : 'General Santos City',
      details: details || 'No details provided.',
      lat: tempMarker?.latitude || GENSAN_REGION.latitude,
      lng: tempMarker?.longitude || GENSAN_REGION.longitude,
      images: images.length > 0 ? images : [MOCK_IMAGES[0]], // Ensure at least one image
      documents: documents,
      payToView: true,
      polygon: tempPolygon,
      isUserCreated: true // MARK AS USER CREATED
    };

    addListing(newListing); // Save to Context
    router.replace('/'); // Go back to Map
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/')}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={PALETTE.support} />
        </TouchableOpacity>
        <Text variant="titleLarge" style={styles.title}>New Listing</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* IMAGES */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Property Images</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            <TouchableOpacity style={styles.uploadBox} onPress={handleAddImage}>
                <MaterialCommunityIcons name="camera-plus" size={30} color="gray" />
                <Text style={{color: 'gray', fontSize: 10, marginTop: 5}}>Add Photo</Text>
            </TouchableOpacity>
            {images.map((img, index) => (
                <View key={index} style={styles.imagePreview}>
                    <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} />
                    <TouchableOpacity style={styles.removeImg} onPress={() => setImages(images.filter((_, i) => i !== index))}>
                        <MaterialCommunityIcons name="close" size={12} color="#fff" />
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>

        {/* INPUTS */}
        <TextInput mode="outlined" label="Property Title" style={styles.input} activeOutlineColor={PALETTE.primary} value={title} onChangeText={setTitle}/>
        <View style={styles.rowInputs}>
            <TextInput mode="outlined" label="Price (PHP)" style={[styles.input, { flex: 1 }]} activeOutlineColor={PALETTE.primary} keyboardType="numeric" value={price} onChangeText={setPrice}/>
            <View style={{flex: 1, justifyContent:'center'}}>
                <View style={styles.typeRow}>
                    <TouchableOpacity style={[styles.typeBtn, type === 'Commercial' && styles.typeBtnActive]} onPress={() => setType('Commercial')}>
                        <Text style={{color: type === 'Commercial' ? '#fff' : 'gray', fontSize: 12}}>Commercial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.typeBtn, type === 'Private' && styles.typeBtnActive]} onPress={() => setType('Private')}>
                        <Text style={{color: type === 'Private' ? '#fff' : 'gray', fontSize: 12}}>Private</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        {/* LOCATION */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Location & Plot</Text>
        <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.dropdownTrigger}>
            <Text style={{ color: barangay ? '#000' : 'gray', fontSize: 16 }}>{barangay || "Select Barangay"}</Text>
            <MaterialCommunityIcons name="chevron-down" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapTrigger} onPress={handleOpenMap}>
            <View style={{flexDirection:'row', alignItems:'center', gap: 10}}>
                <MaterialCommunityIcons name="map-marker-path" size={24} color={tempMarker ? PALETTE.primary : "gray"} />
                <View>
                    <Text style={{fontWeight:'bold', color: PALETTE.support}}>{tempMarker ? "Location Set" : "Set Location on Map"}</Text>
                    <Text style={{fontSize: 12, color:'gray'}}>{tempPolygon.length > 2 ? `${tempPolygon.length} corners defined` : "Tap to pin and draw plot"}</Text>
                </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="gray" />
        </TouchableOpacity>

        {/* DOCUMENTS UPLOAD WITH TOOLTIP */}
        <View style={{flexDirection:'row', alignItems:'center', marginTop: 20, marginBottom: 10}}>
            <Text variant="titleMedium" style={{fontWeight: 'bold', color: PALETTE.support, marginRight: 5}}>Legal Documents</Text>
            <Tooltip title="Files are encrypted and stored securely. Only verified buyers can view previews.">
                <MaterialCommunityIcons name="shield-check" size={20} color={PALETTE.primary} />
            </Tooltip>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            <TouchableOpacity style={[styles.uploadBox, {borderColor: PALETTE.secondary}]} onPress={handleAddDocument}>
                <MaterialCommunityIcons name="file-document-plus" size={30} color={PALETTE.secondary} />
                <Text style={{color: PALETTE.secondary, fontSize: 10, marginTop: 5}}>Upload PDF/Img</Text>
            </TouchableOpacity>
            {documents.map((doc, index) => (
                <View key={index} style={styles.imagePreview}>
                    <Image source={{ uri: doc }} style={{ width: '100%', height: '100%', opacity: 0.7 }} />
                    <View style={{position:'absolute', inset:0, justifyContent:'center', alignItems:'center'}}>
                         <MaterialCommunityIcons name="lock" size={24} color="#333" />
                    </View>
                    <TouchableOpacity style={styles.removeImg} onPress={() => setDocuments(documents.filter((_, i) => i !== index))}>
                        <MaterialCommunityIcons name="close" size={12} color="#fff" />
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>

        {/* DESCRIPTION */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
        <TextInput mode="outlined" label="Property Details" style={styles.textArea} activeOutlineColor={PALETTE.primary} multiline numberOfLines={4} value={details} onChangeText={setDetails}/>

        <View style={{height: 20}} />
        <Button mode="contained" buttonColor={PALETTE.secondary} style={styles.submitBtn} textColor={PALETTE.support} onPress={handleSubmit} contentStyle={{height: 50}}>Publish Listing</Button>
        <View style={{height: 50}} />
      </ScrollView>

      {/* MODALS (Removed Picker Logic for brevity, assume same as before) */}
      <Portal>
         <Modal visible={pickerVisible} onDismiss={() => setPickerVisible(false)} contentContainerStyle={styles.pickerModal}>
            {/* Same Barangay Picker Logic */}
            <ScrollView style={{maxHeight: 300}}>
                {BARANGAYS.map(b => (
                    <TouchableOpacity key={b} style={styles.pickerItem} onPress={() => {setBarangay(b); setPickerVisible(false)}}>
                        <Text>{b}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Modal>

        <Modal visible={mapVisible} onDismiss={() => setMapVisible(false)} contentContainerStyle={styles.fullScreenModal}>
             {/* Same Map Modal Logic */}
             <View style={styles.mapHeader}>
                <Text variant="titleMedium" style={{color:'#fff', fontWeight:'bold'}}>{!tempMarker ? "Tap to Pin" : "Tap to Draw"}</Text>
                <IconButton icon="close" iconColor="#fff" onPress={() => setMapVisible(false)} />
             </View>
             <MapView ref={mapRef} style={{flex:1}} initialRegion={GENSAN_REGION} onPress={handleMapTap}>
                 {tempMarker && <Marker coordinate={tempMarker} />}
                 {tempPolygon.length > 0 && <Polygon coordinates={tempPolygon} strokeColor={PALETTE.primary} strokeWidth={2} fillColor="rgba(8,154,150,0.3)" />}
             </MapView>
             <View style={styles.mapControls}>
                <Button mode="contained" buttonColor={PALETTE.secondary} textColor={PALETTE.support} onPress={saveLocation}>Confirm</Button>
                <Button mode="contained" buttonColor="white" textColor="red" style={{marginTop:5}} onPress={resetMap}>Reset</Button>
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
  imageScroll: { flexDirection: 'row', marginBottom: 20 },
  uploadBox: { width: 80, height: 80, backgroundColor: '#f0f4f1', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  imagePreview: { width: 80, height: 80, borderRadius: 8, overflow:'hidden', marginRight: 10, position:'relative', backgroundColor:'#eee' },
  removeImg: { position:'absolute', top: 2, right: 2, backgroundColor:'rgba(0,0,0,0.5)', borderRadius: 10, padding: 2 },
  input: { marginBottom: 15, backgroundColor: '#fff' },
  rowInputs: { flexDirection: 'row', gap: 10 },
  textArea: { backgroundColor: '#fff' },
  typeRow: { flexDirection: 'row', backgroundColor: '#eee', borderRadius: 8, padding: 2, height: 50, alignItems:'center' },
  typeBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 6, height: '90%' },
  typeBtnActive: { backgroundColor: PALETTE.primary, shadowColor:'#000', elevation: 2 },
  dropdownTrigger: { borderWidth: 1, borderColor: 'gray', borderRadius: 4, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', marginBottom: 15 },
  mapTrigger: { borderWidth: 1, borderColor: PALETTE.primary, borderRadius: 8, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(8, 154, 150, 0.05)' },
  submitBtn: { marginTop: 10 },
  
  fullScreenModal: { flex: 1, backgroundColor: '#fff' },
  mapHeader: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', paddingTop: 40, paddingHorizontal: 20, paddingBottom: 10, backgroundColor: 'rgba(0,0,0,0.6)' },
  mapControls: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: 'transparent' },
  pickerModal: { backgroundColor: 'white', margin: 40, padding: 20, borderRadius: 10 },
  pickerItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' }
});