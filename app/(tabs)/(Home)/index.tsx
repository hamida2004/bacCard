import { ScrollView, StyleSheet, View } from 'react-native';
import Module from '../../../components/Module';
import { flashCards } from '../../../data/flashCards';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
   return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {flashCards.map((element) => (
          <Module key={element.id} id={element.id} name={element.module} color={element.color} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
});
