import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { getCaseById } from '../data/cases';
import { COLORS } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Result'>;
  route: RouteProp<RootStackParamList, 'Result'>;
};

export function ResultScreen({ navigation, route }: Props) {
  const { caseId, correct, accusedSuspectId, accusedWeaponId, accusedRoomId } = route.params;
  const murderCase = getCaseById(caseId);

  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(contentOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!murderCase) return null;

  const killerSuspect = murderCase.suspects.find((s) => s.id === murderCase.solutionSuspectId);
  const killerWeapon = murderCase.weapons.find((w) => w.id === murderCase.solutionWeaponId);
  const killerRoom = murderCase.rooms.find((r) => r.id === murderCase.solutionRoomId);

  const accusedSuspect = murderCase.suspects.find((s) => s.id === accusedSuspectId);
  const accusedWeapon = murderCase.weapons.find((w) => w.id === accusedWeaponId);
  const accusedRoom = murderCase.rooms.find((r) => r.id === accusedRoomId);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Animated.View style={[styles.verdict, { opacity, transform: [{ scale }] }]}>
          <LinearGradient
            colors={correct ? ['#1A3A1A', '#0D1A0D'] : ['#3A1A1A', '#1A0D0D']}
            style={styles.verdictGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons
              name={correct ? 'checkmark-circle' : 'close-circle'}
              size={64}
              color={correct ? COLORS.success : COLORS.error}
            />
            <Text style={[styles.verdictTitle, correct ? styles.verdictCorrect : styles.verdictWrong]}>
              {correct ? 'CASE CLOSED' : 'WRONG ACCUSATION'}
            </Text>
            <Text style={styles.verdictSubtitle}>
              {correct
                ? 'Your deduction was flawless. Justice is served.'
                : 'The killer walks free. The case goes cold.'}
            </Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={{ opacity: contentOpacity, gap: 20 }}>
          <View style={styles.revealBlock}>
            <Text style={styles.revealTitle}>THE TRUTH</Text>
            <Text style={styles.revealStory}>
              {killerSuspect?.name} committed the murder of {murderCase.victim} with the{' '}
              {killerWeapon?.name} in the {killerRoom?.name}.
            </Text>
            <Text style={styles.revealBio}>{killerSuspect?.bio}</Text>
          </View>

          {!correct && (
            <View style={styles.accusationBlock}>
              <Text style={styles.accusationTitle}>YOUR ACCUSATION</Text>
              <View style={styles.accusationRow}>
                <Ionicons name="person" size={14} color={COLORS.error} />
                <Text style={styles.accusationText}>{accusedSuspect?.name}</Text>
                {accusedSuspectId === murderCase.solutionSuspectId && (
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                )}
              </View>
              <View style={styles.accusationRow}>
                <Ionicons name="skull" size={14} color={COLORS.error} />
                <Text style={styles.accusationText}>{accusedWeapon?.name}</Text>
                {accusedWeaponId === murderCase.solutionWeaponId && (
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                )}
              </View>
              <View style={styles.accusationRow}>
                <Ionicons name="location" size={14} color={COLORS.error} />
                <Text style={styles.accusationText}>{accusedRoom?.name}</Text>
                {accusedRoomId === murderCase.solutionRoomId && (
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                )}
              </View>
            </View>
          )}

          <View style={styles.buttonGroup}>
            {!correct && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  navigation.navigate('Game', { caseId });
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.retryButtonText}>TRY AGAIN</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.casesButton}
              onPress={() => navigation.navigate('CaseSelect')}
              activeOpacity={0.8}
            >
              <Text style={styles.casesButtonText}>
                {correct ? 'NEXT CASE' : 'BACK TO CASES'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingTop: 24,
    gap: 20,
  },
  verdict: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  verdictGradient: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  verdictTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  verdictCorrect: {
    color: COLORS.success,
  },
  verdictWrong: {
    color: COLORS.error,
  },
  verdictSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  revealBlock: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  revealTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: COLORS.accentGold,
  },
  revealStory: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 26,
  },
  revealBio: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 4,
  },
  accusationBlock: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.error,
    gap: 10,
  },
  accusationTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: COLORS.error,
    marginBottom: 4,
  },
  accusationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accusationText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  buttonGroup: {
    gap: 10,
  },
  retryButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.textPrimary,
  },
  casesButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  casesButtonText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#FFF',
  },
});
