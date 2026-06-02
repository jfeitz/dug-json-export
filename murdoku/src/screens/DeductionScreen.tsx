import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Suspect, Weapon, Room } from '../types';
import { getCaseById } from '../data/cases';
import { COLORS } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Deduction'>;
  route: RouteProp<RootStackParamList, 'Deduction'>;
};

export function DeductionScreen({ navigation, route }: Props) {
  const { caseId } = route.params;
  const murderCase = getCaseById(caseId);

  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  if (!murderCase) return null;

  const canSubmit = selectedSuspect && selectedWeapon && selectedRoom;

  function submit() {
    if (!canSubmit) return;
    const correct =
      selectedSuspect === murderCase!.solutionSuspectId &&
      selectedWeapon === murderCase!.solutionWeaponId &&
      selectedRoom === murderCase!.solutionRoomId;
    navigation.navigate('Result', {
      caseId,
      correct,
      accusedSuspectId: selectedSuspect!,
      accusedWeaponId: selectedWeapon!,
      accusedRoomId: selectedRoom!,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerEyebrow}>MAKE YOUR ACCUSATION</Text>
          <Text style={styles.headerTitle}>Who did it?</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={16} color={COLORS.accentGold} />
          <Text style={styles.warningText}>
            Choose carefully. You only get one chance to accuse.
          </Text>
        </View>

        <SectionPicker
          title="THE MURDERER"
          subtitle="Who committed the crime?"
          icon="person"
          items={murderCase.suspects.map((s) => ({ id: s.id, label: s.name, sublabel: s.title }))}
          selected={selectedSuspect}
          onSelect={setSelectedSuspect}
        />

        <SectionPicker
          title="THE WEAPON"
          subtitle="What was used?"
          icon="skull"
          items={murderCase.weapons.map((w) => ({ id: w.id, label: w.name, sublabel: w.description }))}
          selected={selectedWeapon}
          onSelect={setSelectedWeapon}
        />

        <SectionPicker
          title="THE LOCATION"
          subtitle="Where did it happen?"
          icon="location"
          items={murderCase.rooms.map((r) => ({ id: r.id, label: r.name, sublabel: r.description }))}
          selected={selectedRoom}
          onSelect={setSelectedRoom}
        />

        <View style={styles.submitSection}>
          {canSubmit && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>YOUR ACCUSATION</Text>
              <Text style={styles.summaryText}>
                {murderCase.suspects.find((s) => s.id === selectedSuspect)?.name}
              </Text>
              <Text style={styles.summaryDivider}>with the</Text>
              <Text style={styles.summaryText}>
                {murderCase.weapons.find((w) => w.id === selectedWeapon)?.name}
              </Text>
              <Text style={styles.summaryDivider}>in the</Text>
              <Text style={styles.summaryText}>
                {murderCase.rooms.find((r) => r.id === selectedRoom)?.name}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
            onPress={submit}
            activeOpacity={canSubmit ? 0.8 : 1}
          >
            <Text style={[styles.submitButtonText, !canSubmit && styles.submitButtonTextDisabled]}>
              {canSubmit ? 'SUBMIT ACCUSATION' : 'Select all three above'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface PickerItem {
  id: string;
  label: string;
  sublabel: string;
}

interface SectionPickerProps {
  title: string;
  subtitle: string;
  icon: string;
  items: PickerItem[];
  selected: string | null;
  onSelect: (id: string) => void;
}

function SectionPicker({ title, subtitle, icon, items, selected, onSelect }: SectionPickerProps) {
  return (
    <View style={pickerStyles.section}>
      <View style={pickerStyles.sectionHeader}>
        <Ionicons name={icon as any} size={14} color={COLORS.accentGold} />
        <View>
          <Text style={pickerStyles.sectionTitle}>{title}</Text>
          <Text style={pickerStyles.sectionSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {items.map((item) => {
        const isSelected = selected === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[pickerStyles.item, isSelected && pickerStyles.itemSelected]}
            onPress={() => onSelect(item.id)}
            activeOpacity={0.7}
          >
            <View style={[pickerStyles.radio, isSelected && pickerStyles.radioSelected]}>
              {isSelected && <View style={pickerStyles.radioDot} />}
            </View>
            <View style={pickerStyles.itemContent}>
              <Text style={[pickerStyles.itemLabel, isSelected && pickerStyles.itemLabelSelected]}>
                {item.label}
              </Text>
              <Text style={pickerStyles.itemSublabel}>{item.sublabel}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
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
  headerEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.accent,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  content: {
    padding: 16,
    gap: 20,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.accentGold,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  submitSection: {
    gap: 16,
  },
  summaryBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent,
    gap: 4,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.accent,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  summaryDivider: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#FFF',
  },
  submitButtonTextDisabled: {
    color: COLORS.textMuted,
    fontWeight: '600',
    letterSpacing: 0,
    fontSize: 13,
  },
});

const pickerStyles = StyleSheet.create({
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.accentGold,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemSelected: {
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.accent,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioSelected: {
    borderColor: COLORS.accent,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  itemLabelSelected: {
    color: COLORS.textPrimary,
  },
  itemSublabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
