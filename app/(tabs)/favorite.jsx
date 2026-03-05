import React, { useEffect, useState } from "react";
import { ScrollView, SafeAreaView, View, StyleSheet } from "react-native";
import FlashCard from "../../components/FlashCard";
import { flashCards } from "../../data/flashCards";
import { useFlashCards } from "../../context/FlashCardContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../../context/FlashCardContext";



const Favorites = () => {
  const { favorites } = useFlashCards();

  // Flatten all flashcards across all modules
  const allFlashcards = flashCards.flatMap((module) =>
    module.content.flatMap((topic) =>
      topic.content.map((card, index) => ({
        ...card,
        uniqueId: `${module.id}-${topic.id}-${card.id || index}`,
        topic: topic.topic,
        topicId: topic.id,
        moduleColor: module.color,
        moduleId: module.id,
      }))
    )
  );

  // Filter only favorited cards
  const favoriteCards = allFlashcards.filter((card) =>
    favorites.some(
      (fav) =>
        fav.moduleId === card.moduleId &&
        fav.topicId === card.topicId &&
        fav.cardId === card.id
    )
  );

  // حفظ المفضلات في AsyncStorage
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.favorites,
          JSON.stringify(favorites)
        );
      } catch (error) {
        console.error("Error saving favorites:", error);
      }
    };
    saveFavorites();
  }, [favorites]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {favoriteCards.map((card) => (
          <View key={card.uniqueId} style={styles.cardWrapper}>
            <FlashCard
              cardId={card.id}
              color={card.moduleColor}
              topic={card.topic}
              frontText={card.front}
              backText={card.back}
              moduleId={card.moduleId}
              topicId={card.topicId}
              showLevels={false}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  scrollContent: {
    padding: 16,
    alignItems: "center",
  },
  cardWrapper: {
    marginBottom: 24,
    width: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default Favorites;
