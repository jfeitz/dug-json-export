import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MurderCase } from '../types';
import { COLORS } from '../theme';

interface Props {
  murderCase: MurderCase;
  onPress: () => void;
  isLocked?: boolean;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#4CAF50',
  medium: '#FF9800',
  hard: '#F44336',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export function CaseCard({ murderCase, onPress, isLocked = false }: Props) {
  return (
    <TouchableOpacity onPress={isLocked ? undefined : onPress} activeOpacity={isLocked ? 1 : 0.8} style={styles.wrapper}>
      <LinearGradient
        colors={[COLORS.surfaceElevated, COLORS.surface]}
        style={[styles.card, isLocked && styles.locked]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {isLocked && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={32} color={COLORS.textMuted} />
            <Text style={styles.lockText}>Solve previous case</Text>
          </View>
        )}
        <View style={styles.header}>
          <View style={styles.caseNumber}>
            <Text style={styles.caseNumberText}>Case #{murderCase.id.replace('case-', '')}</Text>
          </View>
          <View style={[styles.difficultyBadge, { borderColor: DIFFICULTY_COLORS[murderCase.difficulty] }]}>
            <Text style={[styles.difficultyText, { color: DIFFICULTY_COLORS[murderCase.difficulty] }]}>
              {DIFFICULTY_LABELS[murderCase.difficulty]}
            </Text>
          </View>
        </View>
        <Text style={styles.title}>{murderCase.title}</Text>
        <Text style={styles.subtitle}>{murderCase.subtitle}</Text>
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Ionicons name="person" size={12} color={COLORS.textMuted} />
            <Text style={styles.footerText}>Victim: {murderCase.victim}</Text>
          </View>
          <View style={styles.footerRow}>
            <Ionicons name="location" size={12} color={COLORS.textMuted} />
            <Text style={styles.footerText}>{murderCase.setting}</Text>
          </View>
        </View>
        {!isLocked && (
          <View style={styles.arrowWrapper}>
            <Ionicons name="arrow-forward-circle" size={24} color={COLORS.accent} />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  locked: {
    opacity: 0.5,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    gap: 8,
  },
  lockText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  caseNumber: {},
  caseNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  difficultyBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  footer: {
    gap: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  arrowWrapper: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});
