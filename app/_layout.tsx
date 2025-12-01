import { PALETTE, PaperTheme } from '@/constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Avatar, Divider, Provider as PaperProvider, Text } from 'react-native-paper';

// Custom Sidebar Content
function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: PALETTE.support }}>
      <View style={{ padding: 20, alignItems: 'center', marginBottom: 20 }}>
        <Avatar.Image size={80} source={{ uri: 'https://i.pravatar.cc/150?img=12' }} />
        <Text variant="titleMedium" style={{ color: '#fff', marginTop: 10, fontWeight: 'bold' }}>
          Juan Dela Cruz
        </Text>
        <Text style={{ color: PALETTE.secondary, fontSize: 12 }}>Verified Account</Text>
      </View>
      <Divider style={{ backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 10 }} />

      <DrawerItem
        label="History"
        icon={({ color, size }) => <MaterialCommunityIcons name="history" color="#fff" size={size} />}
        labelStyle={{ color: '#fff' }}
        onPress={() => {}}
      />
      <DrawerItem
        label="Saved Listings"
        icon={({ color, size }) => <MaterialCommunityIcons name="bookmark" color="#fff" size={size} />}
        labelStyle={{ color: '#fff' }}
        onPress={() => {}}
      />
    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={PaperTheme}>
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerType: 'front',
            drawerStyle: { backgroundColor: PALETTE.support },
          }}
          initialRouteName="(tabs)"
        >
          <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Home' }} />
          {/* We hide the modal from the drawer menu */}
          <Drawer.Screen name="modal" options={{ drawerItemStyle: { display: 'none' } }} />
        </Drawer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
