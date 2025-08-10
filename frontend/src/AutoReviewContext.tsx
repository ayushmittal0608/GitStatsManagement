import React, { createContext, useContext, useEffect, useState } from "react";

type AutoReviewType = { [key: number]: boolean };

type AutoReviewContextType = {
  autoReview: AutoReviewType;
  toggleAutoReview: (id: number) => void;
  count: number;
};

const AutoReviewContext = createContext<AutoReviewContextType | undefined>(undefined);

export const AutoReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [autoReview, setAutoReview] = useState<AutoReviewType>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("autoReview");
    if (saved) {
      setAutoReview(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("autoReview", JSON.stringify(autoReview));
    }
  }, [autoReview, loaded]);

  const toggleAutoReview = (id: number) => {
    setAutoReview((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const count = Object.values(autoReview).filter(Boolean).length;

  return (
    <AutoReviewContext.Provider value={{ autoReview, toggleAutoReview, count }}>
      {children}
    </AutoReviewContext.Provider>
  );
};

// Custom hook for easy usage
export const useAutoReview = () => {
  const context = useContext(AutoReviewContext);
  if (!context) throw new Error("useAutoReview must be used within AutoReviewProvider");
  return context;
};
