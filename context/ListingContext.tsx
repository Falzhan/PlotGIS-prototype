import { LISTINGS } from '@/constants/Data';
import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface Listing {
  id: number | string;
  title: string;
  type: string;
  price: string;
  address: string;
  lat: number;
  lng: number;
  images: string[];
  details: string;
  payToView: boolean;
  polygon?: any[];
  isUserCreated?: boolean;
  documents?: string[];
}

interface ListingContextType {
  listings: Listing[];
  addListing: (listing: Listing) => void;
  deleteListing: (id: number | string) => void;
  userListings: Listing[];
  // New Bookmark Logic
  savedListingIds: (number | string)[];
  toggleBookmark: (id: number | string) => void;
  savedListings: Listing[];
}

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export const ListingProvider = ({ children }: { children: ReactNode }) => {
  const [listings, setListings] = useState<Listing[]>(LISTINGS);
  const [savedListingIds, setSavedListingIds] = useState<(number | string)[]>([]);

  const addListing = (newListing: Listing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  const deleteListing = (id: number | string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    // Also remove from bookmarks if deleted
    setSavedListingIds((prev) => prev.filter((savedId) => savedId !== id));
  };

  // Bookmark Logic
  const toggleBookmark = (id: number | string) => {
    setSavedListingIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id); // Remove
      } else {
        return [...prev, id]; // Add
      }
    });
  };

  const userListings = listings.filter((item) => item.isUserCreated);
  const savedListings = listings.filter((item) => savedListingIds.includes(item.id));

  return (
    <ListingContext.Provider value={{ 
        listings, 
        addListing, 
        deleteListing, 
        userListings,
        savedListingIds,
        toggleBookmark,
        savedListings
    }}>
      {children}
    </ListingContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingContext);
  if (!context) throw new Error('useListings must be used within a ListingProvider');
  return context;
};