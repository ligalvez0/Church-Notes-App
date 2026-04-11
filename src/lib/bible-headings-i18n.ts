/**
 * Internationalized Bible section headings.
 *
 * Maps a translation language to a lookup table that converts English
 * heading text to the localized equivalent. English headings are the
 * canonical keys used in bible-headings.ts.
 */

import HEADINGS_ES from "./headings-es";
import HEADINGS_FR from "./headings-fr";
import HEADINGS_DE from "./headings-de";
import HEADINGS_RU from "./headings-ru";
import HEADINGS_UK from "./headings-uk";
import HEADINGS_AR from "./headings-ar";
import HEADINGS_ZH from "./headings-zh";

const LANGUAGE_MAP: Record<string, Record<string, string>> = {
  Spanish: HEADINGS_ES,
  French: HEADINGS_FR,
  German: HEADINGS_DE,
  Russian: HEADINGS_RU,
  Ukrainian: HEADINGS_UK,
  Arabic: HEADINGS_AR,
  Chinese: HEADINGS_ZH,
};

/**
 * Translate a heading string to the given language.
 * Falls back to the original English heading if no translation exists.
 */
export function translateHeading(heading: string, language: string): string {
  const table = LANGUAGE_MAP[language];
  if (!table) return heading;
  return table[heading] ?? heading;
}

/**
 * Translate an array of section headings to the given language.
 */
export function translateHeadings(
  headings: { verse: number; heading: string }[],
  language: string
): { verse: number; heading: string }[] {
  const isEnglish = language === "English" || language === "Latin/English";
  if (isEnglish) return headings;

  return headings.map((h) => ({
    verse: h.verse,
    heading: translateHeading(h.heading, language),
  }));
}
