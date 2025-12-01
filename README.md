# PlotGIS - Real Estate Property Management App

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=#D04A37)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Map](https://img.shields.io/badge/Map-Interactive-blue?style=for-the-badge)

A modern, interactive real estate application built with React Native and Expo that combines GIS mapping with property management. PlotGIS allows users to browse, list, and manage properties with precise geographic coordinates and custom polygon boundaries.

## 🌟 Features

### 🗺️ Interactive GIS Mapping
- **Real-time Map Integration**: View properties on an interactive map with precise geographic coordinates
- **Custom Polygon Boundaries**: Properties are displayed with accurate polygon shapes instead of simple markers
- **Location-based Filtering**: Filter properties by barangay (district) with precise geographic targeting
- **Map Navigation**: Smooth zoom and pan controls for exploring properties in General Santos City

### 📱 User Experience
- **Modern UI/UX**: Clean, intuitive interface with glassmorphism effects and smooth animations
- **Image Gallery**: Browse property photos with swipeable carousel functionality
- **Search & Filter**: Powerful search by title, address, and barangay with real-time filtering
- **Property Details**: Comprehensive property information with legal document previews

### 🏗️ Property Management
- **Smart Listing Creation**: Easy property listing with integrated map-based location and boundary setting
- **Polygon Drawing Tool**: Draw custom property boundaries directly on the map
- **Multiple Property Types**: Support for both Commercial and Private property categories
- **Document Management**: Secure document storage with pay-to-view functionality

### 🎨 Design Highlights
- **Glassmorphism UI**: Modern translucent design elements with blur effects
- **Color-coded Categories**: Visual distinction between Commercial (orange) and Private (teal) properties
- **Responsive Layout**: Optimized for various screen sizes and orientations
- **Smooth Animations**: Fluid transitions and micro-interactions throughout the app

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- Expo CLI: `npm install -g @expo/cli`
- A device or emulator with Expo Go installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/plotgis.git
   cd plotgis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in Expo Go**
   - Scan the QR code with the Expo Go app on your mobile device
   - Or use the web preview in your browser

## 📖 Usage

### Browsing Properties
1. **Explore the Map**: View all available properties on the interactive map
2. **Search Properties**: Use the search bar to find properties by name or address
3. **Filter by Location**: Select a barangay to filter properties in that area
4. **View Details**: Tap on a property marker or polygon to see detailed information

### Adding a New Property
1. **Navigate to Add Listing**: Tap the "+" button in the bottom navigation
2. **Upload Images**: Add property photos using the image upload section
3. **Fill Basic Info**: Enter property title, price, and select the property type
4. **Set Location**: 
   - Open the map modal
   - Tap to place the property pin
   - Tap additional points to draw the property boundary
   - Use undo/reset controls as needed
5. **Add Details**: Write property description and highlights
6. **Publish**: Review and submit your listing

### Property Management
- **View History**: Access your listing history through the sidebar menu
- **Manage Saved**: View and organize your saved favorite properties
- **Document Access**: Unlock legal documents for properties (simulated payment system)

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native with Expo
- **Navigation**: Expo Router with Drawer Navigation
- **State Management**: React Hooks (useState, useMemo, useRef)
- **Maps**: react-native-maps for interactive mapping
- **UI Components**: React Native Paper for Material Design components
- **Animations**: react-native-reanimated for smooth transitions
- **Gestures**: react-native-gesture-handler for touch interactions

### Key Components
- **MapScreen**: Main interface with interactive map and property listings
- **AddListingScreen**: Property creation with map-based location setting
- **CustomDrawer**: Personalized sidebar navigation
- **BottomSheet**: Expandable property listing panel
- **Modal System**: Property details with image gallery and document preview

### Data Structure
```typescript
interface Property {
  id: number;
  title: string;
  type: 'Commercial' | 'Private';
  price: string;
  address: string;
  lat: number;
  lng: number;
  details: string;
  images: string[];
  payToView: boolean;
  polygon: Array<{ latitude: number; longitude: number }>;
}
```

## 📱 Screenshots

### Main Interface
- **Interactive Map**: Properties displayed with custom polygons
- **Floating Search Bar**: Glassmorphism search and filter controls
- **Bottom Sheet Listings**: Expandable property listing panel

### Property Details
- **Image Gallery**: Swipeable photo carousel
- **Property Information**: Comprehensive details and pricing
- **Document Preview**: Blurred legal documents with unlock option

### Add Property Flow
- **Map-based Location**: Pin and draw property boundaries
- **Form Interface**: Clean, intuitive property creation
- **Image Upload**: Easy photo addition and management

## 🔧 Configuration

### Environment Setup
The app is configured for General Santos City, Philippines by default. To modify for other locations:

1. **Update Map Region** (in `app/(tabs)/index.tsx`):
   ```typescript
   const GENSAN_REGION = {
     latitude: YOUR_LATITUDE,
     longitude: YOUR_LONGITUDE,
     latitudeDelta: 0.15,
     longitudeDelta: 0.15,
   };
   ```

2. **Update Barangays** (in `constants/Data.ts`):
   ```typescript
   export const BARANGAYS = [
     'Your Barangay 1',
     'Your Barangay 2',
     // Add your locations
   ];
   ```

### Customization Options
- **Color Scheme**: Modify `constants/Colors.ts` for brand colors
- **Map Styles**: Customize map appearance in MapView components
- **Animation Speeds**: Adjust timing in animation functions
- **UI Radius**: Modify border radius values for design consistency

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Use TypeScript for type safety
- Follow the existing code style and naming conventions
- Add comments for complex logic
- Test on both iOS and Android devices
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team**: For the excellent React Native development platform
- **React Native Maps**: For powerful mapping capabilities
- **React Native Paper**: For beautiful Material Design components
- **Unsplash**: For placeholder images in the demo

## 📞 Contact

For questions, suggestions, or collaboration opportunities:

- **Repository**: [GitHub Link](https://github.com/your-username/plotgis)
- **Issues**: [Report Bugs](https://github.com/your-username/plotgis/issues)
- **Email**: your.email@example.com

---

**PlotGIS** - Where properties meet precision. 🏠📍