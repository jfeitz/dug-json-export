import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const { height } = Dimensions.get('window');

export function WelcomeScreen({ navigation }: Props) {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(buttonOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.background, '#1A0A05', COLORS.background]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={styles.decorLine} />
      <View style={[styles.decorLine, styles.decorLineBottom]} />

      <View style={styles.content}>
        <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleY }] }}>
          <Text style={styles.eyebrow}>A PUZZLE MURDER MYSTERY</Text>
          <Text style={styles.title}>MURDOKU</Text>
          <View style={styles.titleUnderline} />
        </Animated.View>

        <Animated.View style={[styles.descriptionBlock, { opacity: subtitleOpacity }]}>
          <Text style={styles.description}>
            A murder has been committed.{'\n'}
            The truth lies hidden in the numbers.{'\n'}
            Solve the puzzle — uncover the clues.{'\n'}
            Make your accusation.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.buttonGroup, { opacity: buttonOpacity }]}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('CaseSelect')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[COLORS.accent, COLORS.accentDim]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryButtonText}>BEGIN INVESTIGATION</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.rulesBlock}>
            <Text style={styles.rulesTitle}>HOW TO PLAY</Text>
            <Text style={styles.rulesText}>
              Solve the sudoku grid. Each completed row reveals a new piece of evidence.
              When you have gathered enough clues, identify the killer, the weapon, and the location.
            </Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Three cases. Three killers. One detective.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  decorLine: {
    position: 'absolute',
    top: height * 0.15,
    left: 32,
    right: 32,
    height: 1,
    backgroundColor: COLORS.accentGold,
    opacity: 0.2,
  },
  decorLineBottom: {
    top: undefined,
    bottom: height * 0.15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    gap: 32,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 4,
    color: COLORS.accentGold,
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 64,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: -2,
    lineHeight: 68,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.accent,
    alignSelf: 'center',
    marginTop: 12,
    borderRadius: 2,
  },
  descriptionBlock: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.accentGold,
    paddingLeft: 16,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  buttonGroup: {
    gap: 24,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
    color: '#FFF',
  },
  rulesBlock: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rulesTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.accentGold,
    marginBottom: 8,
  },
  rulesText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 1,
    fontStyle: 'italic',
  },
});
