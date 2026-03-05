

import React, { useEffect, useState } from "react";
import { ScrollView, SafeAreaView } from "react-native";
import FlashCard from "../../../components/FlashCard";
import { flashCards } from "../../../data/flashCards";
import { ThemedView } from "../../../components/themed-view";
import { useLocalSearchParams } from "expo-router";
import { useFlashCards } from "../../../context/FlashCardContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../../../context/FlashCardContext";
const Card = () => {
  const { id, topicId } = useLocalSearchParams();
  const module = flashCards.find((item) => item.id.toString() === id);
  const topic = module?.content.find(
    (t) => t.id.toString() === topicId?.toString()
  );
  const { easy, medium, hard, rest, favorites, initializeCards } = useFlashCards();
  const [currentCard, setCurrentCard] = useState(null);
  // Cards of this topic
  const topicCards = topic?.content.map((card) => ({
    ...card,
    topic: topic.topic,
    topicId: topic.id,
  }));
  // Check if this topic is initialized
  const isInitialized = [...easy, ...medium, ...hard, ...rest].some(
    (f) => f.moduleId === module?.id && f.topicId === topic?.id
  );
  // Initialize flashcards if not yet done for this topic
  useEffect(() => {
    if (topicCards && !isInitialized) {
      initializeCards(module.id, topic.id, topicCards);
    }
  }, [topicCards, isInitialized, module?.id, topic?.id]);
  // Weighted random selection, avoiding the current card if possible
  const getWeightedRandomCard = (excludeId = null) => {
    if (!topicCards || !module || !topic) return null;

    // Filter lists for this specific module and topic
    const easyInTopic = easy
      .filter((f) => f.moduleId === module.id && f.topicId === topic.id)
      .map((f) => f.cardId);
    const mediumInTopic = medium
      .filter((f) => f.moduleId === module.id && f.topicId === topic.id)
      .map((f) => f.cardId);
    const hardInTopic = hard
      .filter((f) => f.moduleId === module.id && f.topicId === topic.id)
      .map((f) => f.cardId);
    const restInTopic = rest
      .filter((f) => f.moduleId === module.id && f.topicId === topic.id)
      .map((f) => f.cardId);

    const pool = [
      ...easyInTopic.map((id) => ({ id, weight: 3 })),
      ...mediumInTopic.map((id) => ({ id, weight: 2 })),
      ...hardInTopic.map((id) => ({ id, weight: 1 })),
      ...restInTopic.map((id) => ({ id, weight: 1 })),
    ];

    const available = topicCards.filter((card) =>
      pool.some((p) => p.id === card.id)
    );

    if (available.length === 0) return null;

    const totalWeight = pool.reduce((sum, c) => sum + c.weight, 0);

    let attempts = 0;
    let picked = null;

    do {
      const random = Math.random() * totalWeight;
      let cumulative = 0;
      for (const c of pool) {
        cumulative += c.weight;
        if (random <= cumulative) {
          picked = available.find((f) => f.id === c.id);
          break;
        }
      }
      attempts++;
    } while (picked?.id === excludeId && available.length > 1 && attempts < 10);

    return picked || available[0];
  };
  // Set random card initially and on level changes
  useEffect(() => {
    setCurrentCard(getWeightedRandomCard(currentCard?.id));
  }, [easy, medium, hard, rest]);

  // Save to AsyncStorage when states change
  useEffect(() => {
    const saveAll = async () => {
      try {
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.easy, JSON.stringify(easy)],
          [STORAGE_KEYS.medium, JSON.stringify(medium)],
          [STORAGE_KEYS.hard, JSON.stringify(hard)],
          [STORAGE_KEYS.rest, JSON.stringify(rest)],
          [STORAGE_KEYS.favorites, JSON.stringify(favorites)],
        ]);
      } catch (error) {
        console.error("Error saving flashcards:", error);
      }
    };
    saveAll();
  }, [easy, medium, hard, rest, favorites]);

  if (!module || !topic || !currentCard) return null;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedView>
          <FlashCard
            cardId={currentCard.id}
            color={module.color}
            topic={currentCard.topic}
            frontText={currentCard.front}
            backText={currentCard.back}
            moduleId={module.id}
            topicId={currentCard.topicId}
            showLevels={true}
          />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Card;