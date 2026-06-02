import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { getCaseById } from '../data/cases';
import { useGameState } from '../game/useGameState';
import { SudokuGrid } from '../components/SudokuGrid';
import { NumberPad } from '../components/NumberPad';
import { ClueListItem, ClueRevealBanner } from '../components/ClueCard';
import { COLORS } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>;
};

const MIN_CLUES_TO_ACCUSE = 5;

export function GameScreen({ navigation, route }: Props) {
  const { caseId } = route.params;
  const murderCase = getCaseById(caseId);
  const [showClues, setShowClues] = useState(false);

  const {
    board,
    selectedCell,
    errors,
    completedRows,
    revealedClues,
    newlyRevealedClue,
    notesMode,
    notes,
    isGivenCell,
    selectCell,
    enterNumber,
    toggleNotesMode,
    resetPuzzle,
  } = useGameState(murderCase!);

  if (!murderCase) return null;

  const canAccuse = revealedClues.length >= MIN_CLUES_TO_ACCUSE;
  const progressPct = (completedRows.size / 9) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {newlyRevealedClue && (
        <View style={styles.bannerWrapper} pointerEvents="none">
          <ClueRevealBanner clue={newlyRevealedClue} />
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.caseLabel}>{murderCase.title}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>
        </View>
        <TouchableOpacity
          style={styles.cluesBadge}
          onPress={() => setShowClues(true)}
        >
          <Ionicons name="document-text" size={16} color={COLORS.accentGold} />
          <Text style={styles.cluesBadgeText}>{revealedClues.length}/9</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.gridWrapper}>
          <SudokuGrid
            board={board}
            puzzle={murderCase.puzzle}
            errors={errors}
            notes={notes}
            selectedCell={selectedCell}
            onSelectCell={selectCell}
          />
        </View>

        <View style={styles.padWrapper}>
          <NumberPad
            onNumber={enterNumber}
            onErase={() => enterNumber(0)}
            onToggleNotes={toggleNotesMode}
            notesMode={notesMode}
          />
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowClues(true)}>
            <Ionicons name="search" size={16} color={COLORS.textSecondary} />
            <Text style={styles.secondaryButtonText}>
              View Evidence ({revealedClues.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.accuseButton, !canAccuse && styles.accuseButtonDisabled]}
            onPress={canAccuse ? () => navigation.navigate('Deduction', { caseId }) : undefined}
            activeOpacity={canAccuse ? 0.8 : 1}
          >
            <Ionicons
              name="finger-print"
              size={16}
              color={canAccuse ? '#FFF' : COLORS.textMuted}
            />
            <Text style={[styles.accuseButtonText, !canAccuse && styles.accuseButtonTextDisabled]}>
              {canAccuse ? 'ACCUSE' : `Need ${MIN_CLUES_TO_ACCUSE - revealedClues.length} more clues`}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.resetRow} onPress={resetPuzzle}>
          <Ionicons name="refresh" size={13} color={COLORS.textMuted} />
          <Text style={styles.resetText}>Reset Puzzle</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showClues} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalEyebrow}>CASE FILE</Text>
              <Text style={styles.modalTitle}>{murderCase.title}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowClues(false)} style={styles.modalClose}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.caseIntroBlock}>
            <Text style={styles.caseIntroText}>{murderCase.intro}</Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SUSPECTS</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suspectsList}
          >
            {murderCase.suspects.map((s) => (
              <View key={s.id} style={styles.suspectCard}>
                <Text style={styles.suspectName}>{s.name}</Text>
                <Text style={styles.suspectTitle}>{s.title}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>EVIDENCE GATHERED</Text>
            <Text style={styles.sectionCount}>{revealedClues.length} / 9</Text>
          </View>

          <ScrollView style={styles.cluesList}>
            {revealedClues.length === 0 ? (
              <View style={styles.noClues}>
                <Ionicons name="eye-off" size={32} color={COLORS.textMuted} />
                <Text style={styles.noCluesText}>No evidence yet. Solve rows in the puzzle to reveal clues.</Text>
              </View>
            ) : (
              revealedClues.map((clue, i) => (
                <ClueListItem key={clue.id} clue={clue} index={i} />
              ))
            )}
          </ScrollView>

          {canAccuse && (
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalAccuseButton}
                onPress={() => {
                  setShowClues(false);
                  navigation.navigate('Deduction', { caseId });
                }}
              >
                <Text style={styles.modalAccuseText}>MAKE YOUR ACCUSATION</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bannerWrapper: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    gap: 6,
  },
  caseLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  progressBar: {
    height: 3,
    backgroundColor: COLORS.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accentGold,
    borderRadius: 2,
  },
  cluesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.accentGold,
  },
  cluesBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accentGold,
  },
  content: {
    paddingBottom: 32,
    gap: 16,
    paddingTop: 16,
    alignItems: 'center',
  },
  gridWrapper: {
    paddingHorizontal: 16,
  },
  padWrapper: {
    width: '100%',
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    width: '100%',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  accuseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
  },
  accuseButtonDisabled: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  accuseButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  accuseButtonTextDisabled: {
    color: COLORS.textMuted,
    fontWeight: '600',
    letterSpacing: 0,
    fontSize: 12,
  },
  resetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.accentGold,
    marginBottom: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caseIntroBlock: {
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  caseIntroText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.accentGold,
  },
  sectionCount: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  suspectsList: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  suspectCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 120,
  },
  suspectName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  suspectTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  cluesList: {
    flex: 1,
  },
  noClues: {
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  noCluesText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 240,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalAccuseButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  modalAccuseText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#FFF',
  },
});
