export type Difficulty = 'easy' | 'medium' | 'hard';

export type CaseStatus = 'available' | 'in_progress' | 'solved';

export interface Suspect {
  id: string;
  name: string;
  title: string;
  bio: string;
}

export interface Weapon {
  id: string;
  name: string;
  description: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
}

export interface Clue {
  id: string;
  text: string;
  triggeredByRow: number; // which row completion (0-8) reveals this clue
}

export interface MurderCase {
  id: string;
  title: string;
  subtitle: string;
  victim: string;
  setting: string;
  intro: string;
  difficulty: Difficulty;
  suspects: Suspect[];
  weapons: Weapon[];
  rooms: Room[];
  puzzle: number[][];
  solution: number[][];
  clues: Clue[];
  solutionSuspectId: string;
  solutionWeaponId: string;
  solutionRoomId: string;
}

export type RootStackParamList = {
  Welcome: undefined;
  CaseSelect: undefined;
  Game: { caseId: string };
  Deduction: { caseId: string };
  Result: {
    caseId: string;
    correct: boolean;
    accusedSuspectId: string;
    accusedWeaponId: string;
    accusedRoomId: string;
  };
};
