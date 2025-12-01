# PlotGIS - Real Estate Property Management App

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=#D04A37)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prototype](https://img.shields.io/badge/Prototype-Alpha-blue)

A prototype real estate application built with React Native and Expo that combines GIS mapping with property management. PlotGIS is a proof-of-concept app that demonstrates how to display properties with precise geographic coordinates and custom polygon boundaries.

**Note**: This is a prototype/demo application. It's designed to showcase functionality and UI concepts rather than serve as a production-ready system.

## Features

### Interactive GIS Mapping
- **Map Integration**: View properties on an interactive map with geographic coordinates
- **Custom Polygon Boundaries**: Properties displayed with polygon shapes instead of simple markers
- **Location-based Filtering**: Filter properties by barangay (district)
- **Map Controls**: Basic zoom and pan functionality for exploring General Santos City

### User Experience
- **Clean Interface**: Simple, intuitive design with modern styling
- **Image Gallery**: Browse property photos with carousel functionality
- **Search & Filter**: Search by title, address, and barangay
- **Property Details**: View property information and document previews

### Property Management
- **Listing Creation**: Add new properties with map-based location setting
- **Polygon Drawing**: Draw property boundaries directly on the map
- **Property Types**: Support for Commercial and Private categories
- **Document Preview**: View document placeholders with unlock simulation

### Design Features
- **Modern UI**: Clean design with subtle visual effects
- **Category Colors**: Color distinction between property types
- **Responsive Layout**: Works on different screen sizes
- **Smooth Interactions**: Basic animations and transitions

## Getting Started

This is a prototype, so setup is straightforward for demonstration purposes.

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
1. **Explore the Map**: View properties on the interactive map
2. **Search Properties**: Use the search bar to find properties
3. **Filter by Location**: Select a barangay to filter properties
4. **View Details**: Tap on property markers to see information

### Adding a New Property
1. **Navigate to Add Listing**: Tap the "+" button
2. **Upload Images**: Add property photos
3. **Fill Basic Info**: Enter title, price, and property type
4. **Set Location**:
   - Open the map modal
   - Tap to place the property pin
   - Tap points to draw the boundary
   - Use undo/reset as needed
5. **Add Details**: Write property description
6. **Publish**: Submit your listing (demo only)

### Property Management
This prototype includes basic property management features for demonstration:
- View property listings
- Browse property details
- Simulated document access

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
- **MapScreen**: Main interface with map and property listings
- **AddListingScreen**: Property creation with map-based location
- **CustomDrawer**: Sidebar navigation
- **BottomSheet**: Expandable property listing panel
- **Modal System**: Property details with gallery and documents

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
- **Color Scheme**: Modify `constants/Colors.ts` for different colors
- **Map Styles**: Customize map appearance in MapView components
- **Animation Speeds**: Adjust timing in animation functions
- **UI Radius**: Modify border radius values for design consistency

**Note**: This is a prototype, so extensive customization may require additional development.

## Contributing

This is a prototype project, but contributions are welcome if you want to extend or improve it:

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

**Note**: Since this is a prototype, major architectural changes should be discussed first.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Expo Team**: For the React Native development platform
- **React Native Maps**: For mapping capabilities
- **React Native Paper**: For Material Design components
- **Unsplash**: For placeholder images in the demo

## Contact

For questions, suggestions, or collaboration opportunities:

- **Repository**: [GitHub Link](https://github.com/your-username/plotgis)
- **Issues**: [Report Bugs](https://github.com/your-username/plotgis/issues)
- **Email**: your.email@example.com

---

**PlotGIS** - A real estate mapping prototype