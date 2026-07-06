"use client";
import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const useWishlist = () => {
    return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        // Load from local storage on init
        const saved = (typeof window !== 'undefined' ? localStorage.getItem.bind(localStorage) : () => null)("wishlist");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        // Save to local storage whenever changed
        (typeof window !== 'undefined' ? localStorage.setItem.bind(localStorage) : () => null)("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        setWishlist((prev) => {
            // Check if already exists
            if (prev.find((item) => item.id === product.id)) {
                return prev;
            }
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id) => {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
    };

    const isInWishlist = (id) => {
        return wishlist.some((item) => item.id === id);
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const clearWishlist = () => {
        setWishlist([]);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                toggleWishlist,
                clearWishlist
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};
