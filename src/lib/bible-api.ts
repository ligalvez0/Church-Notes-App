import type { BibleVerse, ParsedReference, BibleTranslation } from "@/types/bible";

// Mapping of Bible book names/abbreviations to canonical names
const BOOK_MAP: Record<string, string> = {
  gen: "Genesis", genesis: "Genesis",
  ex: "Exodus", exod: "Exodus", exodus: "Exodus",
  lev: "Leviticus", leviticus: "Leviticus",
  num: "Numbers", numbers: "Numbers",
  deut: "Deuteronomy", deuteronomy: "Deuteronomy",
  josh: "Joshua", joshua: "Joshua",
  judg: "Judges", judges: "Judges",
  ruth: "Ruth",
  "1 sam": "1 Samuel", "1 samuel": "1 Samuel", "1sam": "1 Samuel",
  "2 sam": "2 Samuel", "2 samuel": "2 Samuel", "2sam": "2 Samuel",
  "1 kgs": "1 Kings", "1 kings": "1 Kings", "1kgs": "1 Kings",
  "2 kgs": "2 Kings", "2 kings": "2 Kings", "2kgs": "2 Kings",
  "1 chr": "1 Chronicles", "1 chronicles": "1 Chronicles", "1chr": "1 Chronicles",
  "2 chr": "2 Chronicles", "2 chronicles": "2 Chronicles", "2chr": "2 Chronicles",
  ezra: "Ezra",
  neh: "Nehemiah", nehemiah: "Nehemiah",
  est: "Esther", esther: "Esther",
  job: "Job",
  ps: "Psalms", psalm: "Psalms", psalms: "Psalms", psa: "Psalms",
  prov: "Proverbs", proverbs: "Proverbs",
  eccl: "Ecclesiastes", ecclesiastes: "Ecclesiastes",
  song: "Song of Solomon", "song of solomon": "Song of Solomon", sos: "Song of Solomon",
  isa: "Isaiah", isaiah: "Isaiah",
  jer: "Jeremiah", jeremiah: "Jeremiah",
  lam: "Lamentations", lamentations: "Lamentations",
  ezek: "Ezekiel", ezekiel: "Ezekiel",
  dan: "Daniel", daniel: "Daniel",
  hos: "Hosea", hosea: "Hosea",
  joel: "Joel",
  amos: "Amos",
  obad: "Obadiah", obadiah: "Obadiah",
  jonah: "Jonah",
  mic: "Micah", micah: "Micah",
  nah: "Nahum", nahum: "Nahum",
  hab: "Habakkuk", habakkuk: "Habakkuk",
  zeph: "Zephaniah", zephaniah: "Zephaniah",
  hag: "Haggai", haggai: "Haggai",
  zech: "Zechariah", zechariah: "Zechariah",
  mal: "Malachi", malachi: "Malachi",
  matt: "Matthew", matthew: "Matthew", mt: "Matthew",
  mark: "Mark", mk: "Mark",
  luke: "Luke", lk: "Luke",
  john: "John", jn: "John",
  acts: "Acts",
  rom: "Romans", romans: "Romans",
  "1 cor": "1 Corinthians", "1 corinthians": "1 Corinthians", "1cor": "1 Corinthians",
  "2 cor": "2 Corinthians", "2 corinthians": "2 Corinthians", "2cor": "2 Corinthians",
  gal: "Galatians", galatians: "Galatians",
  eph: "Ephesians", ephesians: "Ephesians",
  phil: "Philippians", philippians: "Philippians",
  col: "Colossians", colossians: "Colossians",
  "1 thess": "1 Thessalonians", "1 thessalonians": "1 Thessalonians", "1thess": "1 Thessalonians",
  "2 thess": "2 Thessalonians", "2 thessalonians": "2 Thessalonians", "2thess": "2 Thessalonians",
  "1 tim": "1 Timothy", "1 timothy": "1 Timothy", "1tim": "1 Timothy",
  "2 tim": "2 Timothy", "2 timothy": "2 Timothy", "2tim": "2 Timothy",
  titus: "Titus",
  phlm: "Philemon", philemon: "Philemon",
  heb: "Hebrews", hebrews: "Hebrews",
  jas: "James", james: "James",
  "1 pet": "1 Peter", "1 peter": "1 Peter", "1pet": "1 Peter",
  "2 pet": "2 Peter", "2 peter": "2 Peter", "2pet": "2 Peter",
  "1 john": "1 John", "1 jn": "1 John", "1jn": "1 John",
  "2 john": "2 John", "2 jn": "2 John", "2jn": "2 John",
  "3 john": "3 John", "3 jn": "3 John", "3jn": "3 John",
  jude: "Jude",
  rev: "Revelation", revelation: "Revelation",
};

// Regex pattern to match Bible references
const SCRIPTURE_REGEX =
  /\b((?:[123]\s?)?(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song(?:\s+of\s+Solomon)?|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation|Gen|Exod?|Lev|Num|Deut|Josh|Judg|Sam|Kgs|Chr|Neh|Est|Psa?|Prov|Eccl|Isa|Jer|Lam|Ezek|Dan|Hos|Mic|Nah|Hab|Zeph|Hag|Zech|Mal|Matt?|Mk|Lk|Jn|Rom|Cor|Gal|Eph|Phil|Col|Thess|Tim|Phlm|Heb|Jas|Pet|Rev))\s+(\d{1,3})(?::(\d{1,3})(?:\s*-\s*(\d{1,3}))?)?\b/gi;

export function parseScriptureReference(text: string): ParsedReference | null {
  const regex = new RegExp(SCRIPTURE_REGEX.source, "i");
  const match = text.match(regex);
  if (!match) return null;

  const bookRaw = match[1].trim().toLowerCase();
  const chapter = parseInt(match[2], 10);
  const verseStart = match[3] ? parseInt(match[3], 10) : 1;
  const verseEnd = match[4] ? parseInt(match[4], 10) : null;

  const book = BOOK_MAP[bookRaw] || match[1].trim();

  return {
    book,
    chapter,
    verseStart,
    verseEnd,
    raw: match[0],
  };
}

export function findAllScriptureReferences(text: string): ParsedReference[] {
  const refs: ParsedReference[] = [];
  const regex = new RegExp(SCRIPTURE_REGEX.source, "gi");
  let match;

  while ((match = regex.exec(text)) !== null) {
    const bookRaw = match[1].trim().toLowerCase();
    const chapter = parseInt(match[2], 10);
    const verseStart = match[3] ? parseInt(match[3], 10) : 1;
    const verseEnd = match[4] ? parseInt(match[4], 10) : null;
    const book = BOOK_MAP[bookRaw] || match[1].trim();

    refs.push({ book, chapter, verseStart, verseEnd, raw: match[0] });
  }

  return refs;
}

export function formatReference(ref: ParsedReference): string {
  let str = `${ref.book} ${ref.chapter}:${ref.verseStart}`;
  if (ref.verseEnd) str += `-${ref.verseEnd}`;
  return str;
}

export async function fetchVerse(
  reference: string,
  translation: BibleTranslation = "kjv"
): Promise<BibleVerse | null> {
  try {
    // Use our API route to proxy the request
    const params = new URLSearchParams({ reference, translation });
    const response = await fetch(`/api/bible/verse?${params}`);

    if (!response.ok) return null;

    return await response.json();
  } catch {
    return null;
  }
}
