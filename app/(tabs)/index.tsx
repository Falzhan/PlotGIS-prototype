import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { DrawerActions } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useNavigation, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, ImageBackground, LayoutAnimation, Platform, ScrollView, StyleSheet, TouchableOpacity, UIManager, View } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { Button, Card, Divider, IconButton, Modal, Portal, Searchbar, SegmentedButtons, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PALETTE } from '@/constants/Colors';
import { BARANGAYS, BARANGAY_COORDINATES } from '@/constants/Data';
import { useListings } from '@/context/ListingContext';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

const GENSAN_REGION = {
  latitude: 6.1164,
  longitude: 125.1716,
  latitudeDelta: 0.15, 
  longitudeDelta: 0.15,
};

// Pseudo User Location (Tambler Area)
const USER_LOCATION = {
  latitude: 6.0640469,
  longitude: 125.1268962,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const sheetRef = useRef<BottomSheet>(null);

  // States
  const { listings, toggleBookmark, savedListingIds } = useListings(); // Use Context
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  
  // Track GPS Button Visibility
  const [isGpsVisible, setIsGpsVisible] = useState(true);
  const gpsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const snapPoints = useMemo(() => ['24%', '50%', '80%'], []);

  // --- SHEET ANIMATION LOGIC ---

  // Triggered immediately when the sheet starts moving
  const handleSheetAnimate = (fromIndex: number, toIndex: number) => {
    // If moving AWAY from the bottom (index 0), hide immediately
    if (fromIndex === 0) {
        setIsGpsVisible(false);
    }
  };

  // Triggered when the sheet settles at a snap point
  const handleSheetChange = (index: number) => {
    // Clear any existing timer to prevent flickering
    if (gpsTimerRef.current) clearTimeout(gpsTimerRef.current);

    if (index === 0) {
        // If settled at bottom (24%), wait before showing
        gpsTimerRef.current = setTimeout(() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Smooth fade in
            setIsGpsVisible(true);
        }, 200); // .2 second delay
    } else {
        // Ensure hidden if at other snap points
        setIsGpsVisible(false);
    }
  };


  // --- MAP ACTIONS ---

  const centerOnUser = () => {
    mapRef.current?.animateToRegion(USER_LOCATION, 1000);
  };

  const handleMapNavPress = () => {
    closeListings(); // Close sheet
    centerOnUser();  // Center map
  };

  const handleBarangaySelect = (brgy: string) => {
    setPickerVisible(false);
    
    if (brgy === 'All Barangays') {
      setSelectedBarangay(null);
      mapRef.current?.animateToRegion(GENSAN_REGION, 1000);
    } else {
      setSelectedBarangay(brgy);
      const coords = BARANGAY_COORDINATES[brgy];
      
      if (coords) {
        mapRef.current?.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }, 1000);
      }
    }
  };

  const filteredListings = listings.filter(l => {
    const matchesType = filterType === 'all' ? true : l.type.toLowerCase() === filterType;
    const query = searchQuery.toLowerCase();
    const matchesSearch = l.title.toLowerCase().includes(query) || l.address.toLowerCase().includes(query);
    const matchesBarangay = selectedBarangay ? l.address.includes(selectedBarangay) : true;
    return matchesType && matchesSearch && matchesBarangay;
  });

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());
  const openListings = () => sheetRef.current?.snapToIndex(1);
  const closeListings = () => sheetRef.current?.snapToIndex(0);
  const goToAdd = () => router.push('/(tabs)/add');

  const handleCardPress = (item: any) => {
    setSelectedItem(item);
    setCurrentImgIndex(0);
    setDetailsModalVisible(true);
    mapRef.current?.animateToRegion({
        latitude: item.lat,
        longitude: item.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
    }, 500);
  };

  const handleGoToMap = () => {
    if (selectedItem) {
        setDetailsModalVisible(false);
        setTimeout(() => {
            mapRef.current?.animateToRegion({
                latitude: selectedItem.lat,
                longitude: selectedItem.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }, 800);
        }, 300);
    }
  };

  const nextImage = () => { if (selectedItem?.images) setCurrentImgIndex((prev) => (prev + 1) % selectedItem.images.length); };
  const prevImage = () => { if (selectedItem?.images) setCurrentImgIndex((prev) => (prev - 1 + selectedItem.images.length) % selectedItem.images.length); };

  return (
    <View style={styles.container}>
      
      <MapView ref={mapRef} style={styles.map} initialRegion={GENSAN_REGION} showsUserLocation={true}>
        {filteredListings.map((item) => (
          <React.Fragment key={item.id}>
            {item.polygon && (
                <Polygon
                    coordinates={item.polygon}
                    fillColor={item.type === 'Commercial' ? "rgba(250, 183, 0, 0.3)" : "rgba(8, 154, 150, 0.3)"}
                    strokeColor={item.type === 'Commercial' ? PALETTE.secondary : PALETTE.primary}
                    strokeWidth={2}
                    tappable={true}
                    onPress={() => handleCardPress(item)}
                />
            )}
            <Marker coordinate={{ latitude: item.lat, longitude: item.lng }} onPress={() => handleCardPress(item)}>
                <View style={[styles.markerBadge, { backgroundColor: item.type === 'Commercial' ? PALETTE.secondary : PALETTE.primary }]}>
                  <MaterialCommunityIcons name={item.type === 'Commercial' ? "office-building" : "home"} size={14} color="#fff" />
                </View>
            </Marker>
          </React.Fragment>
        ))}
        {/* User Location Marker (Simulation) */}
        <Marker coordinate={USER_LOCATION} title="You are here">
            <View style={styles.userDot}>
                <View style={styles.userDotInner} />
            </View>
        </Marker>
      </MapView>

      <BlurView intensity={95} tint="light" style={[styles.burgerContainer, { top: insets.top + 10 }]}>
        <TouchableOpacity onPress={openDrawer} style={styles.burgerBtn}>
          <MaterialCommunityIcons name="menu" size={28} color={PALETTE.support} />
        </TouchableOpacity>
      </BlurView>

      <View style={[styles.searchContainerWrapper, { top: insets.top + 10 }]}>
        <BlurView intensity={95} tint="light" style={styles.blurBackground}>
          <Searchbar
            placeholder="Search..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={{ minHeight: 0 }}
            iconColor={PALETTE.primary}
          />
          <View style={styles.filterBtnContainer}>
            <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.filterBtn}>
                <MaterialCommunityIcons name="filter-variant" size={24} color={selectedBarangay ? PALETTE.secondary : PALETTE.support} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>

      <BlurView intensity={67} tint="light" style={[styles.segmentedContainer, { top: insets.top + 70 }]}>
        <SegmentedButtons
          value={filterType}
          onValueChange={setFilterType}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'commercial', label: 'Commercial' },
            { value: 'private', label: 'Private' },
          ]}
          style={styles.segmentedBtn}
          theme={{ colors: { secondaryContainer: PALETTE.secondary } }}
        />
      </BlurView>

      {/* Center Location Button */}
      {isGpsVisible && (
        <View style={styles.gpsButtonContainer}>
            <TouchableOpacity onPress={centerOnUser} style={styles.gpsButton}>
                <MaterialCommunityIcons name="crosshairs-gps" size={24} color={PALETTE.support} />
            </TouchableOpacity>
        </View>
      )}

      {/* --- BOTTOM SHEET --- */}
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        onAnimate={handleSheetAnimate} // Detect movement start
        onChange={handleSheetChange}   // Detect movement end
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={{ backgroundColor: '#ccc', width: 40 }}
        enablePanDownToClose={false}
        enableOverDrag={false}
        enableDynamicSizing={false}
      >
        <View style={styles.sheetHeader}>
          <Text variant="titleLarge" style={{ color: PALETTE.support, fontWeight: 'bold' }}>
            {selectedBarangay ? `${selectedBarangay} Listings` : 'Available Listings'}
          </Text>
        </View>

        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          {filteredListings.length === 0 && <Text style={{textAlign:'center', marginTop: 20, color:'gray'}}>No listings found.</Text>}
          {filteredListings.map((item) => (
            <Card key={item.id} style={styles.listingCard} mode="elevated" onPress={() => handleCardPress(item)}>
              {/* Bookmark Overlay */}
              <View style={styles.bookmarkOverlay}>
                <IconButton
                  icon={savedListingIds.includes(item.id) ? "bookmark" : "bookmark-outline"}
                  iconColor={savedListingIds.includes(item.id) ? PALETTE.secondary : "white"}
                  containerColor="rgba(0,0,0,0.6)"
                  size={20}
                  onPress={(e) => {
                    e.stopPropagation(); // Prevent card press
                    toggleBookmark(item.id);
                  }}
                />
              </View>
              
              <Card.Cover source={{ uri: item.images[0] }} style={styles.cardImage} />
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardRow}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold', color: PALETTE.support }}>{item.price}</Text>
                  <View style={[styles.tag, { backgroundColor: item.type === 'Commercial' ? PALETTE.secondary : PALETTE.primary }]}>
                    <Text style={styles.tagText}>{item.type}</Text>
                  </View>
                </View>
                <Text variant="bodyMedium">{item.title}</Text>
                <Text variant="bodySmall" style={{ color: 'gray' }}>{item.address}</Text>
              </Card.Content>
            </Card>
          ))}
          <View style={{ height: 120 }} /> 
        </BottomSheetScrollView>
      </BottomSheet>

      <Portal>
         <Modal visible={pickerVisible} onDismiss={() => setPickerVisible(false)} contentContainerStyle={styles.pickerModal}>
            <Text variant="titleLarge" style={{marginBottom: 10, fontWeight:'bold', color: PALETTE.support}}>Select Barangay</Text>
            <Divider style={{marginBottom: 10}} />
            <FlatList
                data={['All Barangays', ...BARANGAYS]}
                keyExtractor={(item) => item}
                style={{maxHeight: 400}}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.pickerItem} 
                        onPress={() => handleBarangaySelect(item)} 
                    >
                        <Text style={{fontSize: 16, color: (selectedBarangay === item || (item === 'All Barangays' && !selectedBarangay)) ? PALETTE.primary : '#333'}}>
                            {item}
                        </Text>
                        {(selectedBarangay === item || (item === 'All Barangays' && !selectedBarangay)) && 
                            <MaterialCommunityIcons name="check" size={20} color={PALETTE.primary} />
                        }
                    </TouchableOpacity>
                )}
            />
            <Button mode="text" onPress={() => setPickerVisible(false)} style={{marginTop: 10}}>Cancel</Button>
        </Modal>

        <Modal visible={detailsModalVisible} onDismiss={() => setDetailsModalVisible(false)} contentContainerStyle={styles.modalContainer}>
            {selectedItem && (
                <View style={{ flex: 1 }}>
                    <View style={styles.carouselContainer}>
                        <ImageBackground source={{ uri: selectedItem.images[currentImgIndex] }} style={styles.carouselImage}>
                            <View style={styles.carouselControls}>
                                <TouchableOpacity onPress={prevImage} style={styles.navBtn}><MaterialCommunityIcons name="chevron-left" size={30} color="#fff" /></TouchableOpacity>
                                <View style={styles.imgCounter}><Text style={{color:'#fff', fontWeight:'bold', fontSize: 12}}>{currentImgIndex + 1} / {selectedItem.images.length}</Text></View>
                                <TouchableOpacity onPress={nextImage} style={styles.navBtn}><MaterialCommunityIcons name="chevron-right" size={30} color="#fff" /></TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </View>
                    <ScrollView contentContainerStyle={styles.scrollableContent}>
                        <Text variant="headlineSmall" style={styles.detailTitle}>{selectedItem.title}</Text>
                        <View style={styles.detailRow}>
                            <View style={[styles.tag, { backgroundColor: selectedItem.type === 'Commercial' ? PALETTE.secondary : PALETTE.primary, paddingHorizontal: 12, paddingVertical: 4 }]}>
                                <Text style={[styles.tagText, {fontSize: 12}]}>{selectedItem.type}</Text>
                            </View>
                            <Text variant="titleLarge" style={{ color: PALETTE.primary, fontWeight:'bold' }}>{selectedItem.price}</Text>
                        </View>
                        <View style={styles.locationRow}>
                             <MaterialCommunityIcons name="map-marker" size={18} color="gray" />
                             <Text style={{color:'gray', marginLeft: 4, flex: 1}}>{selectedItem.address}</Text>
                        </View>
                        <Text style={styles.descriptionText}>{selectedItem.details}</Text>
                        <Divider style={{marginVertical: 15}} />
                        <Text variant="titleMedium" style={{fontWeight:'bold', marginBottom: 10, color: PALETTE.support}}>Legal Documents</Text>
                        <View style={styles.blurredDocContainer}>
                             <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400' }} style={styles.docImage} blurRadius={12}>
                                <View style={styles.lockOverlay}>
                                    <MaterialCommunityIcons name="file-document-outline" size={40} color="#fff" />
                                    <Text style={styles.lockText}>Tax Declaration & Title</Text>
                                    <Button mode="contained" buttonColor={PALETTE.secondary} textColor={PALETTE.support} style={{marginTop: 10}} onPress={() => alert('Payment Gateway...')}>Unlock for ₱50</Button>
                                </View>
                             </ImageBackground>
                        </View>
                        <View style={{height: 20}} /> 
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <Button mode="contained" icon="facebook-messenger" buttonColor="#00C6FF" style={{ flex: 1, marginRight: 5 }} onPress={() => alert('Opening Messenger...')}>Chat</Button>
                        <Button mode="contained" icon="map-search" buttonColor={PALETTE.primary} style={{ flex: 1, marginRight: 5 }} onPress={handleGoToMap}>Map</Button>
                        <IconButton
                            icon={savedListingIds.includes(selectedItem.id) ? "bookmark" : "bookmark-outline"}
                            iconColor={savedListingIds.includes(selectedItem.id) ? PALETTE.secondary : "gray"}
                            mode="outlined"
                            size={20}
                            style={{ borderColor: 'gray' }}
                            onPress={() => toggleBookmark(selectedItem.id)}
                        />
                        <IconButton icon="close" mode="outlined" size={20} style={{ borderColor: 'gray' }} onPress={() => setDetailsModalVisible(false)}/>
                    </View>
                </View>
            )}
        </Modal>
      </Portal>

      <View style={[styles.glassBottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem} onPress={handleMapNavPress}>
          <MaterialCommunityIcons name="map-marker-radius" size={45} color="#fff" />
          <Text variant="labelSmall" style={{ color: '#fff' }}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemMain} onPress={openListings}>
          <View style={styles.mainBtn}><MaterialCommunityIcons name="view-list" size={42} color="#fff" /></View>
          <Text variant="labelSmall" style={{ color: '#fff', fontWeight: 'bold' }}>Listings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={goToAdd}>
          <MaterialCommunityIcons name="plus-box-multiple" size={45} color="#fff" />
          <Text variant="labelSmall" style={{ color: '#fff' }}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: '100%', height: '100%' },
  burgerContainer: { position: 'absolute', left: 16, zIndex: 10, borderRadius: 12, overflow: 'hidden', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.9)' },
  burgerBtn: { padding: 4 },
  searchContainerWrapper: { position: 'absolute', left: 80, right: 16, zIndex: 100, elevation: 10, borderRadius: 12 },
  blurBackground: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 5, borderRadius: 12, overflow: 'hidden' },
  searchBar: { flex: 1, height: 45, backgroundColor: 'transparent', elevation: 0 },
  filterBtnContainer: { marginRight: 5 },
  filterBtn: { padding: 8 },
  segmentedContainer: { position: 'absolute', left: 80, right: 16, zIndex: 10, borderRadius: 8, overflow: 'hidden' },
  segmentedBtn: { backgroundColor: 'transparent', borderRadius: 8 },
  
  // GPS Button: Updated Positioning
  gpsButtonContainer: { 
    position: 'absolute', 
    right: 16, 
    bottom: '27%', // Positioned just above the 24% sheet
    zIndex: 10 
  },
  gpsButton: { 
    backgroundColor: '#fff', 
    width: 45, height: 45, 
    borderRadius: 23, 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowOffset: {width: 0, height: 2} 
  },

  userDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(0, 122, 255, 0.3)', alignItems: 'center', justifyContent: 'center' },
  userDotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#007AFF', borderWidth: 2, borderColor: '#fff' },

  markerBadge: { padding: 6, borderRadius: 20, borderWidth: 2, borderColor: '#fff', elevation: 5, backgroundColor: PALETTE.primary, justifyContent:'center', alignItems:'center' },
  
  // Bookmark Overlay
  bookmarkOverlay: { position: 'absolute', top: 5, right: 5, zIndex: 10 },
  sheetBackground: { borderRadius: 24, shadowColor: "#000", shadowOpacity: 0.2, elevation: 10 },
  sheetHeader: { alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sheetContent: { padding: 16 },
  listingCard: { marginBottom: 16, backgroundColor: '#fff' },
  glassBottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 110, borderTopLeftRadius: 25, borderTopRightRadius: 25, overflow: 'hidden', backgroundColor: '#089A96', borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  navItem: { alignItems: 'center', justifyContent: 'center', height: 100, flex: 1 },
  navItemMain: { alignItems: 'center', justifyContent: 'center', height: 100, flex: 1, bottom: 10 },
  mainBtn: { width: 50, height: 50, borderRadius: 15, backgroundColor: PALETTE.secondary, alignItems: 'center', justifyContent: 'center', marginBottom: 4, elevation: 5 },
  cardImage: { height: 120 },
  cardContent: { paddingTop: 10 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  tagText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },
  modalContainer: { backgroundColor: 'white', margin: 15, borderRadius: 15, overflow: 'hidden', height: SCREEN_HEIGHT * 0.85, display: 'flex', flexDirection: 'column' },
  carouselContainer: { height: 200, width: '100%', backgroundColor: '#000' },
  carouselImage: { width: '100%', height: '100%', justifyContent: 'center' },
  carouselControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 },
  navBtn: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 5 },
  imgCounter: { backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  scrollableContent: { padding: 20, paddingBottom: 10 },
  detailTitle: { fontWeight: 'bold', color: PALETTE.support, marginBottom: 5 },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  descriptionText: { fontSize: 14, lineHeight: 22, color: '#333' },
  blurredDocContainer: { height: 180, width: '100%', borderRadius: 10, overflow: 'hidden', marginTop: 5, borderWidth: 1, borderColor: '#eee' },
  docImage: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  lockOverlay: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', width: '100%', height: '100%' },
  lockText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginTop: 5 },
  modalFooter: { padding: 15, borderTopWidth: 1, borderTopColor: '#eee', flexDirection: 'row', backgroundColor: '#fff', elevation: 5, alignItems: 'center' },
  pickerModal: { backgroundColor: 'white', margin: 40, padding: 20, borderRadius: 10 },
  pickerItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection:'row', justifyContent:'space-between', alignItems:'center' }
});