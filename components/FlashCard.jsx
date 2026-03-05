
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "./themed-text";
import { useFlashCards } from "../context/FlashCardContext";
const FlashCard = ({
  cardId,
  color = "#4e73df",
  topic,
  frontText,
  backText,
  moduleId,
  topicId,
  showLevels = true,
}) => {
  const [flipped, setFlipped] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const { classifyCard, toggleFavorite, favorites } = useFlashCards();
  // Check if the current card is favorited
  const isFavorited = favorites.some(
    (fav) =>
      fav.moduleId === moduleId &&
      fav.topicId === topicId &&
      fav.cardId === cardId
  );
  // Flip animation logic
  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 180,
      useNativeDriver: true,
      friction: 8,
      tension: 10,
    }).start();
    setFlipped(!flipped);
  };
  // Handle difficulty level selection
  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    classifyCard(moduleId, topicId, cardId, level); // Update difficulty in context
  };
  // Reset flip and level when card changes
  useEffect(() => {
    setFlipped(false);
    setSelectedLevel(null);
    flipAnim.setValue(0);
  }, [cardId]);
  // Interpolations for flip animation
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });
  return (
    <View style={styles.wrapper}>
      {/* Flashcard container */}
      <TouchableOpacity onPress={flipCard} activeOpacity={0.9}>
        <View style={styles.container}>
          {/* Topic */}
          <ThemedText style={styles.topic}>{topic}</ThemedText>
          {/* Front side of the card */}
          <Animated.View
            style={[
              styles.card,
              { backgroundColor: color },
              { transform: [{ rotateY: frontInterpolate }] },
            ]}
          >
            <Text style={[styles.text, { color: "#fff" }]}>{frontText}</Text>
          </Animated.View>
          {/* Back side of the card */}
          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              { transform: [{ rotateY: backInterpolate }] },
            ]}
          >
            <Text style={[styles.text, { color: "#000" }]}>{backText}</Text>
          </Animated.View>
        </View>
      </TouchableOpacity>
      {/* Action buttons (favorite, difficulty levels) */}
      <View style={styles.actions}>
        {/* Favorite button */}
        <Pressable onPress={() => toggleFavorite(moduleId, topicId, cardId)}>
          <MaterialIcons
            name={isFavorited ? "favorite" : "favorite-border"}
            size={24}
            color={isFavorited ? "red" : "grey"}
          />
        </Pressable>
        {/* Difficulty level buttons */}
        {showLevels &&
          ["easy", "medium", "hard"].map((level) => (
            <Pressable
              key={level}
              onPress={() => handleLevelSelect(level)}
              style={[
                styles.levelButton,
                {
                  backgroundColor:
                    selectedLevel === level
                      ? level === "easy"
                        ? "green"
                        : level === "medium"
                        ? "orange"
                        : "red"
                      : "#ccc",
                },
              ]}
            >
              <ThemedText style={{ color: "#fff" }}>{level== "hard" ? "صعب" : level== "medium" ? "متوسط" :"سهل" }</ThemedText>
            </Pressable>
          ))}
      </View>
    </View>
  );
};
// Styles
const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    width: 280,
    height: 320,
    alignItems: "center",
    justifyContent: "center",
    perspective: 1000,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
    padding: 10,
    position: "absolute",
  },
  cardBack: {
    backgroundColor: "#eee",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
  topic: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  actions: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  levelButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    elevation: 2,
  },
});
export default FlashCard;