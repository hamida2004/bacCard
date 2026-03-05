

import React from "react";
import { ScrollView, SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { flashCards } from "../../../data/flashCards";
import { ThemedView } from "../../../components/themed-view";
const Cards = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const module = flashCards.find((item) => item.id.toString() === id);
  if (!module) return null;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 80,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: module.color,
            marginBottom: 20,
          }}
        >
          {module.module}
        </Text>
        {module.content.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            onPress={() =>
              router.push({
                pathname: "./Card",
                params: { id: module.id, topicId: topic.id },
              })
            }
          >
            <ThemedView
              style={{
                width: 300,
                padding: 20,
                marginVertical: 10,
                borderRadius: 12,
                backgroundColor: module.color + "33",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: module.color,
                }}
              >
                {topic.topic}
              </Text>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
    </SafeAreaView>
  );
};
export default Cards;