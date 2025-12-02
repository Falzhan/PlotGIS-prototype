import { PALETTE, PaperTheme } from '@/constants/Colors';
import { ListingProvider } from '@/context/ListingContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Image, StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Avatar, Divider, IconButton, Provider as PaperProvider, Text } from 'react-native-paper';

// Custom Sidebar Content
function CustomDrawerContent(props: any) {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
            
            {/* 1. LOGO HEADER */}
            <View style={styles.drawerHeader}>
                {/* Assuming the image exists, otherwise fallback to icon */}
                <Image 
                    source={require('../assets/images/splash-icon.png')} 
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <Divider style={{marginBottom: 10}} />

            {/* 2. MENU ITEMS */}
            <View style={styles.menuContainer}>
                <DrawerItem
                    label="Home Map"
                    icon={({ size }) => <MaterialCommunityIcons name="map" color={PALETTE.support} size={size} />}
                    labelStyle={styles.drawerLabel}
                    onPress={() => router.navigate('/(tabs)')}
                />
                <DrawerItem
                    label="My Listings"
                    icon={({ size }) => <MaterialCommunityIcons name="home-analytics" color={PALETTE.support} size={size} />}
                    labelStyle={styles.drawerLabel}
                    onPress={() => router.push('/my_listings')} 
                />
                <DrawerItem
                    label="Bookmarked"
                    icon={({ size }) => <MaterialCommunityIcons name="bookmark" color={PALETTE.support} size={size} />}
                    labelStyle={styles.drawerLabel}
                    onPress={() => router.push('/bookmarks')} 
                />
                <DrawerItem
                    label="Notifications"
                    icon={({ size }) => <MaterialCommunityIcons name="bell-outline" color={PALETTE.support} size={size} />}
                    labelStyle={styles.drawerLabel}
                    onPress={() => {}} 
                />
                <DrawerItem
                    label="History"
                    icon={({ size }) => <MaterialCommunityIcons name="history" color={PALETTE.support} size={size} />}
                    labelStyle={styles.drawerLabel}
                    onPress={() => {}} 
                />
                
                <Divider style={{marginVertical: 10}} />

                <DrawerItem
                    label="About"
                    icon={({ size }) => <MaterialCommunityIcons name="information-outline" color={PALETTE.support} size={size} />}
                    labelStyle={styles.drawerLabel}
                    onPress={() => {}} 
                />
                <DrawerItem
                    label="Settings"
                    icon={({ size }) => <MaterialCommunityIcons name="cog-outline" color={PALETTE.support} size={size} />}
                    labelStyle={styles.drawerLabel}
                    onPress={() => {}} 
                />
            </View>
        </DrawerContentScrollView>

        {/* 3. FOOTER ACCOUNT */}
        <View style={styles.footer}>
            <Divider />
            <View style={styles.accountRow}>
                <Avatar.Image size={45} source={{ uri: 'https://i.pravatar.cc/150?img=12' }} />
                <View style={styles.accountInfo}>
                    <Text variant="bodyLarge" style={{fontWeight:'bold', color: PALETTE.support}}>Juan Dela Cruz</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <MaterialCommunityIcons name="check-decagram" size={14} color={PALETTE.primary} />
                        <Text variant="labelSmall" style={{color: 'gray', marginLeft: 2}}>Verified Agent</Text>
                    </View>
                </View>
                <IconButton icon="logout" iconColor="red" size={20} onPress={() => alert('Logging out...')} />
            </View>
        </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ListingProvider>
        <PaperProvider theme={PaperTheme}>
          <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
              headerShown: false,
              drawerType: 'front',
              // Sidebar is now WHITE
              drawerStyle: { backgroundColor: '#fff', width: '80%' },
              overlayColor: 'rgba(0,0,0,0.5)',
            }}
            initialRouteName="(tabs)"
          >
            <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Home' }} />
            <Drawer.Screen name="my_listings" options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="bookmarks" options={{ drawerItemStyle: { display: 'none' } }} />
          </Drawer>
        </PaperProvider>
      </ListingProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
    drawerHeader: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
        backgroundColor: '#fff'
    },
    logo: {
        width: 120,
        height: 120,
    },
    menuContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    drawerLabel: {
        color: PALETTE.support,
        fontSize: 16,
        marginLeft: -10
    },
    footer: {
        marginBottom: 20,
        backgroundColor: '#fff'
    },
    accountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    accountInfo: {
        flex: 1,
        marginLeft: 12
    }
});