import { PALETTE } from '@/constants/Colors';
import { useListings } from '@/context/ListingContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, Chip, IconButton, Text } from 'react-native-paper';

export default function BookmarksScreen() {
  const router = useRouter();
  const { savedListings, toggleBookmark } = useListings();

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
         <Appbar.BackAction onPress={() => router.back()} color="#fff" />
         <Appbar.Content title="Saved Listings" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      {savedListings.length === 0 ? (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
                <MaterialCommunityIcons name="bookmark-outline" size={60} color={PALETTE.primary} />
            </View>
            <Text variant="headlineSmall" style={{color: PALETTE.support, fontWeight:'bold', marginTop: 20}}>No Saved Items</Text>
            <Text style={{color:'gray', textAlign:'center', marginHorizontal: 40, marginTop: 10}}>
                Tap the heart icon on any listing to save it here for later.
            </Text>
            <Button 
                mode="contained" 
                buttonColor={PALETTE.secondary} 
                textColor={PALETTE.support}
                style={{marginTop: 30, paddingHorizontal: 20}} 
                onPress={() => router.push('/(tabs)')}
            >
                Browse Map
            </Button>
        </View>
      ) : (
        <FlatList
          data={savedListings}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card style={styles.card} mode="elevated">
                {/* Remove Bookmark Action */}
                <View style={styles.bookmarkOverlay}>
                    <IconButton 
                        icon="bookmark-remove" 
                        iconColor="white"
                        containerColor="rgba(0,0,0,0.6)"
                        size={20}
                        onPress={() => toggleBookmark(item.id)}
                    />
                </View>

                <Card.Cover source={{ uri: item.images[0] }} style={styles.cardCover} />
                
                <Card.Content style={styles.cardContent}>
                    <View style={styles.rowBetween}>
                        <Text variant="titleMedium" numberOfLines={1} style={styles.cardTitle}>{item.title}</Text>
                        <Text variant="titleMedium" style={styles.cardPrice}>{item.price}</Text>
                    </View>
                    
                    <View style={styles.locationRow}>
                         <MaterialCommunityIcons name="map-marker" size={16} color="gray" />
                         <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Chip icon="home" textStyle={{fontSize: 10, lineHeight: 10}} style={styles.chip} compact>{item.type}</Chip>
                        <Button mode="text" compact onPress={() => router.push('/(tabs)')}>View Map</Button>
                    </View>
                </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { backgroundColor: PALETTE.support, elevation: 4 },
  headerTitle: { color: '#fff', fontWeight: 'bold' },
  listContent: { padding: 16, paddingBottom: 40 },
  card: { marginBottom: 20, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  cardCover: { height: 160 },
  cardContent: { paddingVertical: 12 },
  
  bookmarkOverlay: { position: 'absolute', top: 5, right: 5, zIndex: 10 },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontWeight: 'bold', color: PALETTE.support, flex: 1, marginRight: 10 },
  cardPrice: { fontWeight: 'bold', color: PALETTE.primary },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  addressText: { color: 'gray', fontSize: 12, marginLeft: 4, flex: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: { backgroundColor: '#f0f4f1', height: 26 },
  
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIconBg: { width: 120, height: 120, backgroundColor: '#e0f2f1', borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
});