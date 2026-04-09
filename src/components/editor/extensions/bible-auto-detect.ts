import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import {
  findAllScriptureReferences,
  formatReference,
  fetchVerse,
} from "@/lib/bible-api";

export interface BibleAutoDetectOptions {
  /** Called after a verse is successfully embedded. */
  onVerseEmbedded?: (verse: {
    reference: string;
    text: string;
    translation: string;
    book: string;
    chapter: number;
    verseStart: number;
    verseEnd: number | null;
  }) => void;
}

const pluginKey = new PluginKey("bibleAutoDetect");

/**
 * Extension that detects Bible references typed into the editor.
 * When a user types a reference like "John 3:16" and presses Space or Enter,
 * the text is replaced by a BibleVerse node with the full verse text fetched
 * from the API.
 */
export const BibleAutoDetect = Extension.create<BibleAutoDetectOptions>({
  name: "bibleAutoDetect",

  addOptions() {
    return {
      onVerseEmbedded: undefined,
    };
  },

  addProseMirrorPlugins() {
    const extensionOptions = this.options;
    const editor = this.editor;

    return [
      new Plugin({
        key: pluginKey,
        props: {
          handleKeyDown(view, event) {
            // Only trigger on Space or Enter
            if (event.key !== " " && event.key !== "Enter") {
              return false;
            }

            const { state } = view;
            const { selection } = state;
            const { $from } = selection;

            // Only proceed when the cursor is in a text block (paragraph, heading)
            if (!$from.parent.isTextblock) return false;

            // Get the text content of the current block up to the cursor
            const blockStart = $from.start();
            const cursorOffset = $from.pos - blockStart;
            const blockText = $from.parent.textContent;
            const textBeforeCursor = blockText.slice(0, cursorOffset);

            // Look for scripture references in the text before the cursor
            const refs = findAllScriptureReferences(textBeforeCursor);
            if (refs.length === 0) return false;

            // Take the last reference found (closest to cursor)
            const lastRef = refs[refs.length - 1];
            const rawText = lastRef.raw;

            // Verify the reference is at the end of the text (user just finished typing it)
            const trimmedBefore = textBeforeCursor.trimEnd();
            if (!trimmedBefore.endsWith(rawText)) {
              return false;
            }

            // Calculate positions in the document
            const refStartInBlock = trimmedBefore.length - rawText.length;
            const refEndInBlock = trimmedBefore.length;
            const docRefStart = blockStart + refStartInBlock;
            const docRefEnd = blockStart + refEndInBlock;

            // Check if there's only the reference in this block (plus optional whitespace)
            const textBeforeRef = textBeforeCursor
              .slice(0, refStartInBlock)
              .trim();
            const textAfterRef = blockText.slice(cursorOffset).trim();
            const isStandaloneRef = textBeforeRef === "" && textAfterRef === "";

            const formattedRef = formatReference(lastRef);

            // Prevent the space/enter from being inserted
            event.preventDefault();

            // Fetch the verse asynchronously and insert the node
            (async () => {
              const verse = await fetchVerse(formattedRef);
              if (!verse || !verse.text) return;

              // Use the editor commands API (safe even after async)
              if (editor.isDestroyed) return;

              if (isStandaloneRef) {
                // Replace the entire block: delete the reference text, then
                // insert the BibleVerse node in its place
                editor
                  .chain()
                  .focus()
                  .command(({ tr }) => {
                    tr.delete(docRefStart, docRefEnd);
                    return true;
                  })
                  .insertContent({
                    type: "bibleVerse",
                    attrs: {
                      reference: verse.reference,
                      text: verse.text,
                      translation: verse.translation,
                    },
                  })
                  .run();
              } else {
                // Replace only the reference portion and insert the verse
                // node after the current block
                editor
                  .chain()
                  .focus()
                  .command(({ tr }) => {
                    tr.delete(docRefStart, docRefEnd);
                    return true;
                  })
                  .run();

                // Insert the verse node after the current paragraph
                editor
                  .chain()
                  .focus()
                  .command(({ tr, state: cmdState }) => {
                    const { $from: $pos } = cmdState.selection;
                    // Find end of current block
                    const endOfBlock = $pos.end();
                    const afterBlock = endOfBlock + 1;
                    const nodeType =
                      cmdState.schema.nodes.bibleVerse;
                    if (!nodeType) return false;
                    const node = nodeType.create({
                      reference: verse.reference,
                      text: verse.text,
                      translation: verse.translation,
                    });
                    tr.insert(afterBlock, node);
                    return true;
                  })
                  .run();
              }

              // Notify about the embedded verse
              extensionOptions.onVerseEmbedded?.({
                reference: verse.reference,
                text: verse.text,
                translation: verse.translation,
                book: verse.book,
                chapter: verse.chapter,
                verseStart: verse.verseStart,
                verseEnd: verse.verseEnd,
              });
            })();

            return true;
          },
        },
      }),
    ];
  },
});
