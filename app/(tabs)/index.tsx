// app/(tabs)/index.tsx

import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { DrawerActions } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useNavigation, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { Button, Card, Divider, IconButton, Menu, Modal, Portal, Searchbar, SegmentedButtons, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PALETTE } from '@/constants/Colors';
import { BARANGAYS, LISTINGS } from '@/constants/Data';

const SCREEN_HEIGHT = Dimensions.get('window').height;

// GenSan Coordinates
const GENSAN_REGION = {
  latitude: 6.1164,
  longitude: 125.1716,
  latitudeDelta: 0.15, 
  longitudeDelta: 0.15,
};

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const sheetRef = useRef<BottomSheet>(null);

  // --- STATES ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Barangay Filter State
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);

  // Modal State
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const snapPoints = useMemo(() => ['24%', '50%', '80%'], []);

  // --- LOGIC ---
  const filteredListings = LISTINGS.filter(l => {
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
    setCurrentImgIndex(0); // Reset gallery
    setDetailsModalVisible(true);
    // Initial centering when clicking card
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
        // Zoom in tighter when "Go to Map" is pressed
        setTimeout(() => {
            mapRef.current?.animateToRegion({
                latitude: selectedItem.lat,
                longitude: selectedItem.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }, 800);
        }, 300); // Small delay to allow modal to close smoothly
    }
  };

  // Image Gallery Logic
  const nextImage = () => {
    if (selectedItem?.images) {
        setCurrentImgIndex((prev) => (prev + 1) % selectedItem.images.length);
    }
  };
  
  const prevImage = () => {
    if (selectedItem?.images) {
        setCurrentImgIndex((prev) => (prev - 1 + selectedItem.images.length) % selectedItem.images.length);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* --- 1. GIS MAP --- */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={GENSAN_REGION}
      >
        {filteredListings.map((item) => (
          <React.Fragment key={item.id}>
            {/* GIS POLYGON SHAPE */}
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

            {/* PIN MARKER */}
            <Marker
                coordinate={{ latitude: item.lat, longitude: item.lng }}
                onPress={() => handleCardPress(item)}
            >
                <View style={[styles.markerBadge, { backgroundColor: item.type === 'Commercial' ? PALETTE.secondary : PALETTE.primary }]}>
                  <MaterialCommunityIcons name={item.type === 'Commercial' ? "office-building" : "home"} size={14} color="#fff" />
                </View>
            </Marker>
          </React.Fragment>
        ))}
      </MapView>

      {/* --- 2. FLOATING TOP ELEMENTS --- */}
      <BlurView intensity={95} tint="light" style={[styles.burgerContainer, { top: insets.top + 10 }]}>
        <TouchableOpacity onPress={openDrawer} style={styles.burgerBtn}>
          <MaterialCommunityIcons name="menu" size={28} color={PALETTE.support} />
        </TouchableOpacity>
      </BlurView>

      {/* --- FLOATING SEARCH & FILTER --- */}
      {/* UPDATED: Increased zIndex to 100 to beat the map */}
      <View style={[styles.searchContainerWrapper, { top: insets.top + 10 }]}>
        
        {/* The BlurView provides the glass effect */}
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
            <Menu
              visible={visibleMenu}
              onDismiss={() => setVisibleMenu(false)}
              anchor={
                <TouchableOpacity onPress={() => setVisibleMenu(true)} style={styles.filterBtn}>
                  <MaterialCommunityIcons
                    name="filter-variant"
                    size={24}
                    color={selectedBarangay ? PALETTE.secondary : PALETTE.support}
                  />
                </TouchableOpacity>
              }
              // UPDATED: Added marginTop to push menu down slightly so it doesn't cover the bar
              contentStyle={{ backgroundColor: '#fff', marginTop: 40 }}
            >
              <Menu.Item onPress={() => { setSelectedBarangay(null); setVisibleMenu(false); }} title="All Barangays" />
              <Divider />
              <ScrollView style={{ maxHeight: 250, width: 200 }}>
                 {/* Added width to ensure it doesn't look squashed */}
                {BARANGAYS.map((brgy) => (
                  <Menu.Item
                    key={brgy}
                    onPress={() => { setSelectedBarangay(brgy); setVisibleMenu(false); }}
                    title={brgy}
                  />
                ))}
              </ScrollView>
            </Menu>
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

      {/* --- 3. BOTTOM SHEET --- */}
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
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
          {filteredListings.length === 0 && (
             <Text style={{textAlign:'center', marginTop: 20, color:'gray'}}>No listings found.</Text>
          )}

          {filteredListings.map((item) => (
            <Card key={item.id} style={styles.listingCard} mode="elevated" onPress={() => handleCardPress(item)}>
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

      {/* --- 4. DETAILS MODAL --- */}
      <Portal>
        <Modal 
            visible={detailsModalVisible} 
            onDismiss={() => setDetailsModalVisible(false)} 
            contentContainerStyle={styles.modalContainer}
        >
            {selectedItem && (
                <View style={{ flex: 1 }}>
                    {/* SECTION 1: TOP STATIC CAROUSEL */}
                    <View style={styles.carouselContainer}>
                        <ImageBackground 
                            source={{ uri: selectedItem.images[currentImgIndex] }} 
                            style={styles.carouselImage}
                        >
                            <View style={styles.carouselControls}>
                                <TouchableOpacity onPress={prevImage} style={styles.navBtn}>
                                    <MaterialCommunityIcons name="chevron-left" size={30} color="#fff" />
                                </TouchableOpacity>
                                <View style={styles.imgCounter}>
                                    <Text style={{color:'#fff', fontWeight:'bold', fontSize: 12}}>
                                        {currentImgIndex + 1} / {selectedItem.images.length}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={nextImage} style={styles.navBtn}>
                                    <MaterialCommunityIcons name="chevron-right" size={30} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </View>

                    {/* SECTION 2: SCROLLABLE DETAILS & DOCUMENTS */}
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

                        <Text style={styles.descriptionText}>
                            {selectedItem.details}
                        </Text>
                        
                        <Divider style={{marginVertical: 15}} />
                        
                        <Text variant="titleMedium" style={{fontWeight:'bold', marginBottom: 10, color: PALETTE.support}}>
                            Legal Documents
                        </Text>

                        {/* Blurred Document Section */}
                        <View style={styles.blurredDocContainer}>
                             <ImageBackground 
                                source={{ uri: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }} 
                                style={styles.docImage}
                                blurRadius={8}
                             >
                                <View style={styles.lockOverlay}>
                                    <MaterialCommunityIcons name="file-document-outline" size={40} color="#fff" />
                                    <Text style={styles.lockText}>Tax Declaration & Title</Text>
                                    <Button 
                                        mode="contained" 
                                        buttonColor={PALETTE.secondary}
                                        textColor={PALETTE.support}
                                        style={{marginTop: 10}}
                                        onPress={() => alert('Payment Gateway...')}
                                    >
                                        Unlock for ₱50
                                    </Button>
                                </View>
                             </ImageBackground>
                        </View>

                        <View style={{height: 20}} /> 
                    </ScrollView>

                    {/* SECTION 3: STATIC BOTTOM FOOTER */}
                    <View style={styles.modalFooter}>
                        
                        {/* 1. Messenger Button */}
                        <Button 
                            mode="contained" 
                            icon="facebook-messenger" 
                            buttonColor="#25D366" 
                            style={{ flex: 1, marginRight: 5 }}
                            onPress={() => alert('Opening Messenger...')}
                        >
                            Chat
                        </Button>

                        {/* 2. Go To Map Button */}
                        <Button 
                            mode="contained" 
                            icon="map-search" 
                            buttonColor={PALETTE.primary} 
                            style={{ flex: 1, marginRight: 5 }}
                            onPress={handleGoToMap}
                        >
                            Map
                        </Button>
                        
                        {/* 3. Close Button */}
                        <IconButton 
                            icon="close" 
                            mode="outlined"
                            size={20}
                            style={{ borderColor: 'gray' }}
                            onPress={() => setDetailsModalVisible(false)}
                        />
                    </View>
                </View>
            )}
        </Modal>
      </Portal>

      {/* --- 5. BOTTOM NAV --- */}
      <View style={[styles.glassBottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem} onPress={closeListings}>
          <MaterialCommunityIcons name="map-marker-radius" size={45} color="#fff" />
          <Text variant="labelSmall" style={{ color: '#fff' }}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItemMain} onPress={openListings}>
          <View style={styles.mainBtn}>
            <MaterialCommunityIcons name="view-list" size={42} color="#fff" />
          </View>
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
  
  burgerContainer: {
    position: 'absolute', left: 16, zIndex: 10,
    borderRadius: 12, overflow: 'hidden', paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.9)'
  },
  burgerBtn: { padding: 4 },
  // --- UPDATED STYLES FOR SEARCH CONTAINER ---
  
  // 1. The Wrapper handles Position and Z-Index ONLY (No overflow hidden)
  searchContainerWrapper: {
    position: 'absolute',
    left: 80,
    right: 16,
    zIndex: 100, // Boosted Z-Index
    elevation: 10, // For Android
    borderRadius: 12, // Move borderRadius here for the shadow to look right
    // REMOVED: overflow: 'hidden' -> This was likely clipping your menu
  },

  // 2. The BlurView handles the Visuals and Clipping of the background only
  blurBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 12, // Apply radius here
    overflow: 'hidden', // Clip ONLY the blur effect, not the children (React Native treats this differently on BlurViews)
  },

  searchBar: { flex: 1, height: 45, backgroundColor: 'transparent', elevation: 0 },
  filterBtnContainer: { marginRight: 5 },
  filterBtn: { padding: 8 },

  segmentedContainer: {
    position: 'absolute', left: 80, right: 16, zIndex: 10,
    borderRadius: 8, overflow: 'hidden', paddingHorizontal: 0, paddingVertical: 0,
  },
  segmentedBtn: { backgroundColor: 'transparent', borderRadius: 8 },
  
  markerBadge: {
    padding: 6, borderRadius: 20, borderWidth: 2, borderColor: '#fff',
    elevation: 5, backgroundColor: PALETTE.primary, justifyContent:'center', alignItems:'center'
  },
  sheetBackground: { borderRadius: 24, shadowColor: "#000", shadowOpacity: 0.2, elevation: 10 },
  sheetHeader: { alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sheetContent: { padding: 16 },
  listingCard: { marginBottom: 16, backgroundColor: '#fff' },
  
  glassBottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end',
    height: 110, borderTopLeftRadius: 25, borderTopRightRadius: 25, overflow: 'hidden',
    backgroundColor: '#089A96',
    borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.3)'
  },
  navItem: { alignItems: 'center', justifyContent: 'center', height: 100, flex: 1 },
  navItemMain: { alignItems: 'center', justifyContent: 'center', height: 100, flex: 1, bottom: 10 },
  mainBtn: {
    width: 50, height: 50, borderRadius: 15, backgroundColor: PALETTE.secondary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4, elevation: 5
  },
  cardImage: { height: 120 },
  cardContent: { paddingTop: 10 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  tagText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },

  // --- MODAL STYLES ---
  modalContainer: { 
    backgroundColor: 'white', 
    margin: 15, 
    borderRadius: 15, 
    overflow: 'hidden', 
    height: SCREEN_HEIGHT * 0.85, // INCREASED HEIGHT
    display: 'flex',
    flexDirection: 'column'
  },
  // Section 1: Carousel
  carouselContainer: { height: 200, width: '100%', backgroundColor: '#000' },
  carouselImage: { width: '100%', height: '100%', justifyContent: 'center' },
  carouselControls: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 
  },
  navBtn: { 
    backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 5 
  },
  imgCounter: {
    backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10
  },

  // Section 2: Content
  scrollableContent: { padding: 20, paddingBottom: 10 },
  detailTitle: { fontWeight: 'bold', color: PALETTE.support, marginBottom: 5 },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  descriptionText: { fontSize: 14, lineHeight: 22, color: '#333' },

  // Blurred Doc
  blurredDocContainer: { 
    height: 180, width: '100%', borderRadius: 10, overflow: 'hidden', marginTop: 5,
    borderWidth: 1, borderColor: '#eee'
  },
  docImage: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  lockOverlay: { 
    alignItems: 'center', justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.4)', width: '100%', height: '100%' 
  },
  lockText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginTop: 5 },

  // Section 3: Footer
  modalFooter: { 
    padding: 15, borderTopWidth: 1, borderTopColor: '#eee', 
    flexDirection: 'row', backgroundColor: '#fff',
    elevation: 5, alignItems: 'center'
  },
});