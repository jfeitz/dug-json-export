import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Clue } from '../types';
import { COLORS } from '../theme';

interface ClueListItemProps {
  clue: Clue;
  index: number;
}

export function ClueListItem({ clue, index }: ClueListItemProps) {
  return (
    <View style={styles.clueItem}>
      <View style={styles.clueIcon}>
        <Ionicons name="document-text" size={14} color={COLORS.accentGold} />
      </View>
      <View style={styles.clueContent}>
        <Text style={styles.clueNumber}>Evidence #{index + 1}</Text>
        <Text style={styles.clueText}>{clue.text}</Text>
      </View>
    </View>
  );
}

interface ClueRevealBannerProps {
  clue: Clue;
}

export function ClueRevealBanner({ clue }: ClueRevealBannerProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
      Animated.delay(3000),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, [clue.id]);

  return (
    <Animated.View style={[styles.banner, { opacity, transform: [{ translateY }] }]}>
      <Ionicons name="search" size={16} color={COLORS.accentGold} />
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>New Clue Discovered</Text>
        <Text style={styles.bannerText} numberOfLines={2}>
          {clue.text}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  clueItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  clueIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  clueContent: {
    flex: 1,
  },
  clueNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accentGold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  clueText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  banner: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accentGold,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accentGold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  bannerText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
});
