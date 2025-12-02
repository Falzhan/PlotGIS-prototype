import { PALETTE } from '@/constants/Colors';
import { useListings } from '@/context/ListingContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, Chip, Divider, IconButton, Text } from 'react-native-paper';

export default function MyListingsScreen() {
  const router = useRouter();
  const { userListings, deleteListing, toggleBookmark, savedListingIds } = useListings();

  // Confirm Delete Logic
  const handleDeletePress = (id: string | number) => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to remove this property? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteListing(id) }
      ]
    );
  };

  const handleEditPress = (item: any) => {
    Alert.alert("Prototype Info", "Edit functionality would open the form pre-filled with this item's data.");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
         <Appbar.BackAction onPress={() => router.back()} color="#fff" />
         <Appbar.Content title="My Listings" titleStyle={styles.headerTitle} />
         <Appbar.Action icon="plus" color="#fff" onPress={() => router.push('/(tabs)/add')} />
      </Appbar.Header>

      {userListings.length === 0 ? (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
                <MaterialCommunityIcons name="home-city-outline" size={60} color={PALETTE.primary} />
            </View>
            <Text variant="headlineSmall" style={{color: PALETTE.support, fontWeight:'bold', marginTop: 20}}>No Listings Yet</Text>
            <Text style={{color:'gray', textAlign:'center', marginHorizontal: 40, marginTop: 10}}>
                You haven't posted any properties yet. Start selling or renting today!
            </Text>
            <Button 
                mode="contained" 
                buttonColor={PALETTE.secondary} 
                textColor={PALETTE.support}
                style={{marginTop: 30, paddingHorizontal: 20}} 
                onPress={() => router.push('/(tabs)/add')}
            >
                Create First Listing
            </Button>
        </View>
      ) : (
        <FlatList
          data={userListings}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card style={styles.card} mode="elevated">
                {/* Status Badge Overlay */}
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>PUBLISHED</Text>
                </View>

                {/* Cover Image */}
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
                        <Text style={styles.viewsText}>
                            <MaterialCommunityIcons name="eye" size={14} /> 24 views
                        </Text>
                    </View>
                </Card.Content>

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

                <Divider />

                {/* Actions Footer */}
                <View style={styles.actionFooter}>
                    <Button 
                        icon="pencil" 
                        mode="text" 
                        textColor={PALETTE.primary}
                        onPress={() => handleEditPress(item)}
                        style={styles.actionBtn}
                    >
                        Edit
                    </Button>
                    
                    <View style={styles.verticalDivider} />

                    <Button 
                        icon="delete-outline" 
                        mode="text" 
                        textColor="#E53935" 
                        onPress={() => handleDeletePress(item.id)}
                        style={styles.actionBtn}
                    >
                        Delete
                    </Button>
                </View>
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
  
  // Card Styling
  card: { marginBottom: 20, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  cardCover: { height: 160 },
  cardContent: { paddingVertical: 12 },
  
  statusBadge: {
      position: 'absolute', top: 12, left: 12, zIndex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4
  },
  statusText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontWeight: 'bold', color: PALETTE.support, flex: 1, marginRight: 10 },
  cardPrice: { fontWeight: 'bold', color: PALETTE.primary },
  
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  addressText: { color: 'gray', fontSize: 12, marginLeft: 4, flex: 1 },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: { backgroundColor: '#f0f4f1', height: 26 },
  viewsText: { fontSize: 12, color: 'gray' },

  // Action Footer
  actionFooter: { flexDirection: 'row', paddingVertical: 4 },
  actionBtn: { flex: 1, borderRadius: 0 },
  verticalDivider: { width: 1, backgroundColor: '#eee', marginVertical: 8 },

  // Bookmark Overlay
  bookmarkOverlay: { position: 'absolute', top: 12, right: 12, zIndex: 10 },

  // Empty State
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIconBg: { width: 120, height: 120, backgroundColor: '#e0f2f1', borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
});