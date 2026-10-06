import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

interface Props {
  onNumber: (num: number) => void;
  onErase: () => void;
  onToggleNotes: () => void;
  notesMode: boolean;
}

export function NumberPad({ onNumber, onErase, onToggleNotes, notesMode }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} style={styles.numButton} onPress={() => onNumber(n)} activeOpacity={0.7}>
            <Text style={styles.numText}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {[6, 7, 8, 9].map((n) => (
          <TouchableOpacity key={n} style={styles.numButton} onPress={() => onNumber(n)} activeOpacity={0.7}>
            <Text style={styles.numText}>{n}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.numButton, notesMode && styles.noteButtonActive]}
          onPress={onToggleNotes}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil" size={18} color={notesMode ? COLORS.background : COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.numButton} onPress={onErase} activeOpacity={0.7}>
          <Ionicons name="backspace-outline" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  numButton: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  numText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  noteButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
});
