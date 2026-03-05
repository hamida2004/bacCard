import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { useFlashCards } from "../context/FlashCardContext";
import FlashCard from "../components/FlashCard";

const { width } = Dimensions.get("window");

export default function Intro() {
  const scrollRef = useRef(null);
  const router = useRouter();
  const { completeOnboarding } = useFlashCards();
  const [index, setIndex] = useState(0);
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";

  const theme = useMemo(() => ({
    background: isDark ? "#0F172A" : "#FFFFFF",
    text: isDark ? "#F1F5F9" : "#1E293B",
    secondaryText: isDark ? "#CBD5E1" : "#475569",
    button: "#4A90E2",
  }), [isDark]);

  const finishIntro = async () => {
    await completeOnboarding();
    router.replace("/(tabs)");
  };

  const goNext = () => {
    if (index < 3) {
      scrollRef.current?.scrollTo({
        x: width * (index + 1),
        animated: true,
      });
      setIndex(index + 1);
    } else {
      finishIntro();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
      >
        {/* 1️⃣ تعريف التطبيق */}
        <View style={styles.slide}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.icon}
          />
          <Text style={[styles.title, { color: theme.text }]}>
            Bac Card
          </Text>
          <Text style={[styles.text, { color: theme.secondaryText }]}>
            تطبيق يساعدك على حفظ مصطلحات التاريخ والجغرافيا،
            الفلسفة والتربية الإسلامية بطريقة البطاقات التعليمية.
          </Text>
        </View>

        {/* 2️⃣ قلب البطاقة */}
        <View style={styles.slide}>
          <Text style={[styles.title, { color: theme.text }]}>
            اضغط على البطاقة
          </Text>

          <FlashCard
            cardId={0}
            color="#4A90E2"
            topic="مثال"
            frontText="ما هو تعريف الدولة؟"
            backText="كيان سياسي يمتلك سيادة على إقليم محدد."
            moduleId={0}
            topicId={0}
            showLevels={false}
          />

          <Text style={[styles.text, { color: theme.secondaryText }]}>
            اضغط على البطاقة لقلبها ورؤية الجواب.
          </Text>
        </View>

        {/* 3️⃣ التكرار الذكي */}
        <View style={styles.slide}>
          <Image
            source={require("../assets/images/intro3.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.text }]}>
            التصنيف الذكي
          </Text>
          <Text style={[styles.text, { color: theme.secondaryText }]}>
            كلما صنفت البطاقة إلى سهل، متوسط أو صعب،
            سيتم تعديل تكرار ظهورها لمساعدتك على تثبيت المعلومات
            بطريقة فعالة.
          </Text>
        </View>

        {/* 4️⃣ المفضلة */}
        <View style={styles.slide}>
          <Image
            source={require("../assets/images/intro4.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.text }]}>
            المفضلة
          </Text>
          <Text style={[styles.text, { color: theme.secondaryText }]}>
            يمكنك حفظ المصطلحات المهمة في المفضلة
            والعودة إليها لاحقًا من أجل مراجعة مركزة.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.button }]}
        onPress={goNext}
      >
        <Text style={styles.buttonText}>
          {index === 3 ? "ابدأ الآن" : "التالي"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical:40 },
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  icon: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  image: {
    height: "60%",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    padding: 16,
    margin: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});