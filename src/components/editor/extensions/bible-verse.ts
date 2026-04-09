import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { BibleVerseComponent } from "./bible-verse-component";

export interface BibleVerseOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    bibleVerse: {
      /**
       * Insert a Bible verse card node.
       */
      insertBibleVerse: (attrs: {
        reference: string;
        text: string;
        translation: string;
      }) => ReturnType;
    };
  }
}

export const BibleVerseNode = Node.create<BibleVerseOptions>({
  name: "bibleVerse",

  group: "block",

  atom: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      reference: {
        default: "",
      },
      text: {
        default: "",
      },
      translation: {
        default: "KJV",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="bibleVerse"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "bibleVerse",
      }),
      `"${HTMLAttributes.text}" - ${HTMLAttributes.reference} (${HTMLAttributes.translation})`,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BibleVerseComponent);
  },

  addCommands() {
    return {
      insertBibleVerse:
        (attrs) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs,
            })
            .run();
        },
    };
  },
});
