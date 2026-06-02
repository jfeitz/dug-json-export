import { MurderCase } from '../types';

export const CASES: MurderCase[] = [
  {
    id: 'case-1',
    title: 'Death at Blackwood Manor',
    subtitle: 'A shot rings out in the library...',
    victim: 'Lord Edmund Blackwood',
    setting: 'Blackwood Manor, Yorkshire — 1923',
    difficulty: 'easy',
    intro:
      'Lord Edmund Blackwood was found dead in his manor on the night of the autumn ball. ' +
      'The guests are all suspects. Solve the puzzle — each completed row reveals a new clue. ' +
      'When you have enough evidence, make your accusation.',
    suspects: [
      {
        id: 'victor-crane',
        name: 'Victor Crane',
        title: 'Business Partner',
        bio: 'Lord Blackwood\'s scheming partner, owed a fortune in bad debts.',
      },
      {
        id: 'rose-ashford',
        name: 'Rose Ashford',
        title: 'Socialite',
        bio: 'A glamorous guest with secrets she\'d rather keep buried.',
      },
      {
        id: 'dr-graves',
        name: 'Dr. Miles Graves',
        title: 'Family Physician',
        bio: 'Trusted confidant to Lord Blackwood — perhaps too trusted.',
      },
      {
        id: 'lady-evelyn',
        name: 'Lady Evelyn Moor',
        title: 'Estranged Widow',
        bio: 'Claims she came only for the music. No one believes her.',
      },
    ],
    weapons: [
      { id: 'pistol', name: 'Antique Pistol', description: 'A .455 Webley revolver from the study cabinet' },
      { id: 'letter-opener', name: 'Silver Letter Opener', description: 'Monogrammed, found on the writing desk' },
      { id: 'hemlock', name: 'Hemlock Tea', description: 'A poisoned blend discovered in the kitchen' },
      { id: 'garrote', name: 'Silk Garrote', description: 'A length of silk cord, knotted deliberately' },
    ],
    rooms: [
      { id: 'library', name: 'Library', description: 'Floor-to-ceiling first editions, a cold fireplace' },
      { id: 'conservatory', name: 'Conservatory', description: 'Glass and orchids — Rose\'s favourite room' },
      { id: 'study', name: 'East Wing Study', description: 'The doctor kept his papers here' },
      { id: 'cellar', name: 'Wine Cellar', description: 'Locked from 11 PM by the butler\'s own account' },
    ],
    puzzle: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ],
    solutionSuspectId: 'victor-crane',
    solutionWeaponId: 'pistol',
    solutionRoomId: 'library',
    clues: [
      {
        id: 'c1-1',
        triggeredByRow: 0,
        text: 'The victim\'s pocket watch was stopped at 11:47 PM — well past the last waltz. The guests had not yet retired.',
      },
      {
        id: 'c1-2',
        triggeredByRow: 1,
        text: 'Rose Ashford was observed in the Conservatory at 11 PM by two witnesses, tending to her orchids. She did not leave until midnight.',
      },
      {
        id: 'c1-3',
        triggeredByRow: 2,
        text: 'The wine cellar was padlocked from 10:30 PM by Mr. Hobbs, the butler. The key never left his coat pocket.',
      },
      {
        id: 'c1-4',
        triggeredByRow: 3,
        text: 'Dr. Miles Graves spent the evening reading in the East Wing Study. Three guests confirm seeing him there between 10 PM and midnight.',
      },
      {
        id: 'c1-5',
        triggeredByRow: 4,
        text: 'The Hemlock Tea was found sealed and untouched in the kitchen pantry. Cook confirms it was never served that evening.',
      },
      {
        id: 'c1-6',
        triggeredByRow: 5,
        text: 'A silk thread matching Lady Evelyn Moor\'s shawl was recovered — from the garden path outside, not the manor interior.',
      },
      {
        id: 'c1-7',
        triggeredByRow: 6,
        text: 'Victor Crane was known to handle the manor\'s antique firearms under the pretense of "cleaning." Lord Blackwood had recently confronted him over missing funds.',
      },
      {
        id: 'c1-8',
        triggeredByRow: 7,
        text: 'The silver letter opener was found on the writing desk in the study — clean, undisturbed, accounted for.',
      },
      {
        id: 'c1-9',
        triggeredByRow: 8,
        text: 'A single spent cartridge from a .455 Webley was discovered behind the first-edition shelf in the Library. The air still smelled of powder.',
      },
    ],
  },
  {
    id: 'case-2',
    title: 'The Poisoned Waltz',
    subtitle: 'The Countess drank her last glass...',
    victim: 'Countess Isabella Vane',
    setting: 'Vane Estate, Vienna — 1931',
    difficulty: 'medium',
    intro:
      'Countess Isabella Vane collapsed mid-waltz at her own grand ball. Her champagne glass lay shattered beside her. ' +
      'The attending physician suspects poison. Solve the puzzle to uncover who killed her.',
    suspects: [
      {
        id: 'baron-schmidt',
        name: 'Baron Klaus Schmidt',
        title: 'Rival Noble',
        bio: 'Long-standing feud with the Vane family over inherited land.',
      },
      {
        id: 'hettie-finch',
        name: 'Henrietta Finch',
        title: 'Lady\'s Maid',
        bio: 'Loyal for fifteen years — or so the Countess believed.',
      },
      {
        id: 'maestro',
        name: 'Maestro Alfonse Delacroix',
        title: 'Orchestra Conductor',
        bio: 'Rumoured to have been the Countess\'s secret paramour.',
      },
      {
        id: 'ambassador',
        name: 'Ambassador René Duval',
        title: 'Diplomat',
        bio: 'Present on "official business." His attaché case was never searched.',
      },
    ],
    weapons: [
      { id: 'arsenic', name: 'Arsenic Powder', description: 'Dissolved in champagne — tasteless, lethal' },
      { id: 'crystal', name: 'Crystal Decanter', description: 'Heavy lead crystal, capable of a lethal blow' },
      { id: 'pistol2', name: 'Pocket Pistol', description: 'A small .22 calibre found in an attaché case' },
      { id: 'stiletto', name: 'Jewelled Stiletto', description: 'An ornate blade hidden in a walking cane' },
    ],
    rooms: [
      { id: 'ballroom', name: 'Grand Ballroom', description: 'Where the Countess fell — in full view of two hundred guests' },
      { id: 'antechamber', name: 'Antechamber', description: 'A private room off the ballroom, used for refreshments' },
      { id: 'kitchen2', name: 'Estate Kitchen', description: 'Below stairs, accessible only through the servants\' passage' },
      { id: 'terrace', name: 'East Terrace', description: 'Open to the cold night air — champagne was poured here' },
    ],
    puzzle: [
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0],
    ],
    solution: [
      [4, 3, 5, 2, 6, 9, 7, 8, 1],
      [6, 8, 2, 5, 7, 1, 4, 9, 3],
      [1, 9, 7, 8, 3, 4, 5, 6, 2],
      [8, 2, 6, 1, 9, 5, 3, 4, 7],
      [3, 7, 4, 6, 8, 2, 9, 1, 5],
      [9, 5, 1, 7, 4, 3, 6, 2, 8],
      [5, 1, 9, 3, 2, 6, 8, 7, 4],
      [2, 4, 8, 9, 5, 7, 1, 3, 6],
      [7, 6, 3, 4, 1, 8, 2, 5, 9],
    ],
    solutionSuspectId: 'hettie-finch',
    solutionWeaponId: 'arsenic',
    solutionRoomId: 'antechamber',
    clues: [
      {
        id: 'c2-1',
        triggeredByRow: 0,
        text: 'The attending physician confirms the Countess showed symptoms consistent with arsenic poisoning — not a blow or a blade.',
      },
      {
        id: 'c2-2',
        triggeredByRow: 1,
        text: 'Baron Schmidt was on the dance floor for the entire final waltz, observed by a dozen witnesses including the Ambassador himself.',
      },
      {
        id: 'c2-3',
        triggeredByRow: 2,
        text: 'Maestro Delacroix never left the conductor\'s podium between 10 PM and the Countess\'s collapse at 11:22 PM.',
      },
      {
        id: 'c2-4',
        triggeredByRow: 3,
        text: 'Ambassador Duval\'s attaché case contained only diplomatic papers. The pocket pistol found inside had not been fired in years.',
      },
      {
        id: 'c2-5',
        triggeredByRow: 4,
        text: 'The champagne was poured in the Antechamber before being carried to guests on trays — not on the East Terrace as first reported.',
      },
      {
        id: 'c2-6',
        triggeredByRow: 5,
        text: 'Only one person had unrestricted access to the Antechamber that evening: the lady\'s maid, who prepared the Countess\'s personal glass.',
      },
      {
        id: 'c2-7',
        triggeredByRow: 6,
        text: 'A folded note was found in the Antechamber fireplace — partially burned, but legible: "...she will not remember what she promised you."',
      },
      {
        id: 'c2-8',
        triggeredByRow: 7,
        text: 'Henrietta Finch\'s personal effects included a recent letter of dismissal, signed by the Countess — dated three days before the ball.',
      },
      {
        id: 'c2-9',
        triggeredByRow: 8,
        text: 'Trace amounts of arsenic were found on the rim of the Antechamber\'s silver tray — the one Henrietta Finch alone had handled that night.',
      },
    ],
  },
  {
    id: 'case-3',
    title: 'Midnight in the Garden',
    subtitle: 'The Ambassador never saw morning...',
    victim: 'Ambassador René Duval',
    setting: 'Châteauneuf-sur-Loire, France — 1938',
    difficulty: 'hard',
    intro:
      'Ambassador René Duval was found strangled in the moonlit garden of his Loire Valley château. ' +
      'War whispers through Europe and so do secrets. ' +
      'This case is harder — the puzzle is more complex, and the truth more carefully buried.',
    suspects: [
      {
        id: 'lady-evelyn2',
        name: 'Lady Evelyn Moor',
        title: 'British Attaché',
        bio: 'Claims she was there for a "cultural exchange." Intelligence suggests otherwise.',
      },
      {
        id: 'colonel',
        name: 'Colonel Franz Bauer',
        title: 'Military Attaché',
        bio: 'A Prussian officer with a violent past and a vested interest in Duval\'s silence.',
      },
      {
        id: 'celeste',
        name: 'Céleste Marchand',
        title: 'Housekeeper',
        bio: 'Twenty years in service. Knows every room — and every secret.',
      },
      {
        id: 'pierre',
        name: 'Pierre Vautrin',
        title: 'Estate Gardener',
        bio: 'Last to see the Ambassador alive. His alibi has one critical gap.',
      },
    ],
    weapons: [
      { id: 'garrote2', name: 'Silk Garrote', description: 'A length of silk cord, knotted with military precision' },
      { id: 'knife', name: 'Pruning Knife', description: 'Pierre\'s own tool — recovered near the rose garden' },
      { id: 'poison2', name: 'Strychnine Capsule', description: 'Found dissolved in a brandy glass on the terrace' },
      { id: 'pistol3', name: 'Luger Pistol', description: 'A German service weapon, unregistered' },
    ],
    rooms: [
      { id: 'garden', name: 'Rose Garden', description: 'Where the body was discovered, dew on the petals' },
      { id: 'terrace2', name: 'South Terrace', description: 'A brandy glass left on the balustrade' },
      { id: 'study2', name: 'Ambassador\'s Study', description: 'Papers disturbed, safe left open' },
      { id: 'chapel', name: 'Estate Chapel', description: 'Used for covert meetings, according to the housekeeper' },
    ],
    puzzle: [
      [0, 2, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 6, 0, 0, 0, 0, 3],
      [0, 7, 4, 0, 8, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 2],
      [0, 8, 0, 0, 4, 0, 0, 1, 0],
      [6, 0, 0, 5, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 7, 8, 0],
      [5, 0, 0, 0, 0, 9, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 4, 0],
    ],
    solution: [
      [1, 2, 6, 4, 3, 7, 9, 5, 8],
      [8, 9, 5, 6, 2, 1, 4, 7, 3],
      [3, 7, 4, 9, 8, 5, 1, 2, 6],
      [4, 5, 7, 1, 9, 3, 8, 6, 2],
      [9, 8, 3, 2, 4, 6, 5, 1, 7],
      [6, 1, 2, 5, 7, 8, 3, 9, 4],
      [2, 6, 9, 3, 1, 4, 7, 8, 5],
      [5, 4, 8, 7, 6, 9, 2, 3, 1],
      [7, 3, 1, 8, 5, 2, 6, 4, 9],
    ],
    solutionSuspectId: 'lady-evelyn2',
    solutionWeaponId: 'garrote2',
    solutionRoomId: 'garden',
    clues: [
      {
        id: 'c3-1',
        triggeredByRow: 0,
        text: 'The coroner identifies strangulation as cause of death. The weapon was a thin, strong cord — consistent with silk. No sign of struggle from a blade or bullet.',
      },
      {
        id: 'c3-2',
        triggeredByRow: 1,
        text: 'Colonel Bauer was seen departing the estate by motorcar at 10:15 PM — confirmed by the gatekeeper\'s log. He could not have returned in time.',
      },
      {
        id: 'c3-3',
        triggeredByRow: 2,
        text: 'Pierre Vautrin\'s pruning knife was tested — the blade carries soil and rust, no blood or fibres. He had not sharpened it recently.',
      },
      {
        id: 'c3-4',
        triggeredByRow: 3,
        text: 'The strychnine capsule on the South Terrace was still sealed inside a diplomatic pouch — it was never opened or administered.',
      },
      {
        id: 'c3-5',
        triggeredByRow: 4,
        text: 'Céleste Marchand has a confirmed alibi: the parlour maid was with her in the kitchen until past midnight, preparing the Ambassador\'s breakfast tray.',
      },
      {
        id: 'c3-6',
        triggeredByRow: 5,
        text: 'Dew patterns in the Rose Garden indicate the body fell between 11 PM and 11:30 PM. Pierre Vautrin was locked inside his cottage from 10 PM.',
      },
      {
        id: 'c3-7',
        triggeredByRow: 6,
        text: 'Lady Evelyn Moor cannot account for her whereabouts between 11 PM and midnight. She claims she "took a walk" — alone, in the dark, in November.',
      },
      {
        id: 'c3-8',
        triggeredByRow: 7,
        text: 'A fragment of lilac silk — not matching any garment owned by the household — was caught on the rose thorns nearest the body.',
      },
      {
        id: 'c3-9',
        triggeredByRow: 8,
        text: 'Intelligence files retrieved from the Ambassador\'s safe confirm that Lady Evelyn Moor was operating as a double agent. Duval had just discovered the truth.',
      },
    ],
  },
];

export function getCaseById(id: string): MurderCase | undefined {
  return CASES.find((c) => c.id === id);
}
