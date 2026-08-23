export type Lang = 'en' | 'bn'

/**
 * Single source of truth for every UI string in the app. Figure point
 * labels (A, B, O, ∠ACB, …) are NOT in here — they stay Latin in both
 * languages because the printed Udvash slides use Latin letters, and the
 * app must match them on screen.
 *
 * Add new keys here as each module is built; nothing elsewhere should ever
 * contain a hardcoded chrome string.
 */
export const dict = {
  appTitle: { en: 'CIRCLE LAB', bn: 'বৃত্ত ল্যাব' },
  hintReset: { en: 'R reset', bn: 'R রিসেট' },
  hintHide: { en: 'H hide', bn: 'H লুকান' },
  hintFreeze: { en: 'F freeze', bn: 'F স্থির' },
  hintLang: { en: 'L বাংলা', bn: 'L English' },
  hintStep: { en: 'Space step', bn: 'Space ধাপ' },
  frozenBadge: { en: 'FROZEN — F to unfreeze', bn: 'স্থির — আনফ্রিজ করতে F' },
  hiddenHint: { en: 'readouts hidden — H to reveal', bn: 'মান লুকানো — দেখাতে H' },

  // module switcher labels
  mod1: { en: 'Chord Lab', bn: 'জ্যা ল্যাব' },
  mod2: { en: 'Doubling Machine', bn: 'দ্বিগুণ যন্ত্র' },
  mod3: { en: 'Semicircle', bn: 'অর্ধবৃত্ত' },
  mod4: { en: 'Cyclic Quad', bn: 'চক্রীয় চতুর্ভুজ' },
  mod5: { en: 'Contradiction', bn: 'প্রতিবাদ প্রমাণ' },
  mod6: { en: 'Perp. Diagonals', bn: 'লম্ব কর্ণ' },
  mod7: { en: 'Bisector', bn: 'সমদ্বিখণ্ডক' },
  mod8: { en: 'Tangent', bn: 'স্পর্শক' },
  mod9: { en: 'Recap', bn: 'পুনরালোচনা' },
  mod0: { en: 'Quiz', bn: 'কুইজ' },

  comingSoon: { en: 'coming next phase', bn: 'পরবর্তী পর্যায়ে' },

  // Module 1: Chord Lab
  c1Radius: { en: 'r', bn: 'r' },
  c1Distance: { en: 'd (O to chord)', bn: 'd (কেন্দ্র থেকে জ্যা)' },
  c1HalfChord: { en: 'c / 2', bn: 'c / 2' },
  c1Identity: { en: 'identity', bn: 'অভেদ' },
  c1SecondChordToggle: { en: 'second chord (C, D)', bn: 'দ্বিতীয় জ্যা (C, D)' },
  c1PresetBtn: { en: '24 & 5 preset', bn: '২৪ ও ৫ প্রিসেট' },
  c1DiameterHint: {
    en: 'drag AB through O → d → 0, chord at maximum',
    bn: 'AB কে O দিয়ে টানুন → d → 0, জ্যা সর্বোচ্চ',
  },
  c1RelEqual: { en: 'equal chords, equal distance', bn: 'সমান জ্যা, সমান দূরত্ব' },
  c1RelNearer: { en: 'the longer chord sits nearer the centre', bn: 'বড় জ্যা কেন্দ্রের কাছাকাছি' },

  // Module 2: Doubling Machine
  d2Inscribed: { en: '∠MLN (inscribed)', bn: '∠MLN (বৃত্তস্থ কোণ)' },
  d2Central: { en: '∠MON (central)', bn: '∠MON (কেন্দ্রস্থ কোণ)' },
  d2ShowConstruction: { en: 'show construction', bn: 'নির্মাণ দেখান' },
  d2CaseInside: { en: 'centre inside ∠MLN', bn: 'কেন্দ্র কোণের ভিতরে' },
  d2CaseOn: { en: 'centre on arm', bn: 'কেন্দ্র বাহুর উপর' },
  d2CaseOutside: { en: 'centre outside ∠MLN', bn: 'কেন্দ্র কোণের বাইরে' },
  d2SubtractionCaption: {
    en: 'centre outside the angle: this step is a subtraction, not an addition',
    bn: 'কেন্দ্র কোণের বাইরে: এই ধাপ বিয়োগ, যোগ নয়',
  },
  d2ReflexToggle: { en: 'reflex at O', bn: 'O-তে প্রবৃদ্ধ কোণ' },
  d2ReflexIdentity: { en: 'reflex + central = 360°', bn: 'প্রবৃদ্ধ + কেন্দ্রস্থ = ৩৬০°' },
  d2SolvePreset: { en: 'x-preset: inscribed = x, reflex = 4x', bn: 'x-প্রিসেট: বৃত্তস্থ = x, প্রবৃদ্ধ = ৪x' },
  d2GhostHint: {
    en: 'ghost trail: the inscribed angle never changes',
    bn: 'ভূত-রেখা: বৃত্তস্থ কোণ কখনো বদলায় না',
  },
  d2StepExterior: { en: 'exterior angle at O', bn: 'O-তে বহিঃস্থ কোণ' },

  // Module 3: Semicircle
  s3AngleAtC: { en: '∠ACB', bn: '∠ACB' },
  s3ReverseToggle: { en: 'reverse mode: is AB a diameter?', bn: 'বিপরীত মোড: AB কি ব্যাস?' },
  s3DiameterFound: { en: 'this chord is a diameter — it passes through O', bn: 'এই জ্যা-ই ব্যাস — এটি O দিয়ে যায়' },
} satisfies Record<string, Record<Lang, string>>

export type DictKey = keyof typeof dict
