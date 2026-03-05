import React, { createContext, useState, useContext, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FlashCardContext = createContext();

export const STORAGE_KEYS = {
  easy: "@flashcards_easy",
  medium: "@flashcards_medium",
  hard: "@flashcards_hard",
  rest: "@flashcards_rest",
  favorites: "@flashcards_favorites",
  firstLaunch: "@app_first_launch",
};

export const FlashCardProvider = ({ children }) => {
  const [easy, setEasy] = useState([]);
  const [medium, setMedium] = useState([]);
  const [hard, setHard] = useState([]);
  const [rest, setRest] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Load everything from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const results = await AsyncStorage.multiGet([
          STORAGE_KEYS.easy,
          STORAGE_KEYS.medium,
          STORAGE_KEYS.hard,
          STORAGE_KEYS.rest,
          STORAGE_KEYS.favorites,
          STORAGE_KEYS.firstLaunch,
        ]);

        const [
          easyData,
          mediumData,
          hardData,
          favData,
          restData,
          firstLaunchData,
        ] = results;

        if (easyData[1]) setEasy(JSON.parse(easyData[1]));
        if (mediumData[1]) setMedium(JSON.parse(mediumData[1]));
        if (hardData[1]) setHard(JSON.parse(hardData[1]));
        if (restData[1]) setRest(JSON.parse(restData[1]));
        if (favData[1]) setFavorites(JSON.parse(favData[1]));

        // If no stored value → first launch
        if (firstLaunchData[1] === null) {
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(firstLaunchData[1] === "true");
        }
      } catch (error) {
        console.error("Error loading flashcards:", error);
        // Even if there's an error, we need to set a default state
        setIsFirstLaunch(true); // Default to showing intro if something goes wrong
      } finally {
        setIsLoading(false); // Always mark loading as complete
      }
    };

    loadData();
  }, []);

  // Mark onboarding as completed
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.firstLaunch, "false");
      setIsFirstLaunch(false);
    } catch (error) {
      console.error("Error saving first launch flag:", error);
    }
  };

  // Other functions remain the same...
  const initializeCards = (moduleId, topicId, flashCards) => {
    const newRests = flashCards.map((c) => ({
      moduleId,
      topicId,
      cardId: c.id,
    }));
    setRest((prev) => [...prev, ...newRests]);
  };

  const classifyCard = (moduleId, topicId, cardId, level) => {
    const key = { moduleId, topicId, cardId };

    setEasy((prev) =>
      prev.filter((f) => !(f.moduleId === moduleId && f.topicId === topicId && f.cardId === cardId))
    );
    setMedium((prev) =>
      prev.filter((f) => !(f.moduleId === moduleId && f.topicId === topicId && f.cardId === cardId))
    );
    setHard((prev) =>
      prev.filter((f) => !(f.moduleId === moduleId && f.topicId === topicId && f.cardId === cardId))
    );
    setRest((prev) =>
      prev.filter((f) => !(f.moduleId === moduleId && f.topicId === topicId && f.cardId === cardId))
    );

    if (level === "easy") setEasy((prev) => [...prev, key]);
    else if (level === "medium") setMedium((prev) => [...prev, key]);
    else if (level ==="hard") setHard((prev) => [...prev, key]);
  };

  const toggleFavorite = (moduleId, topicId, cardId) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (fav) =>
          fav.moduleId === moduleId &&
          fav.topicId === topicId &&
          fav.cardId === cardId
      );

      if (exists) {
        return prev.filter(
          (fav) =>
            !(fav.moduleId === moduleId &&
              fav.topicId === topicId &&
              fav.cardId === cardId)
        );
      } else {
        return [...prev, { moduleId, topicId, cardId }];
      }
    });
  };

  return (
    <FlashCardContext.Provider
      value={{
        easy,
        medium,
        hard,
        rest,
        favorites,
        isFirstLaunch,
        isLoading, // Add this to the context
        completeOnboarding,
        initializeCards,
        classifyCard,
        toggleFavorite,
      }}
    >
      {children}
    </FlashCardContext.Provider>
  );
};

export const useFlashCards = () => useContext(FlashCardContext);