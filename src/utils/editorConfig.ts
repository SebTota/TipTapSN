import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Dropcursor from "@tiptap/extension-dropcursor";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import HardBreak from "@tiptap/extension-hard-break";
import History from "@tiptap/extension-history";

export const getEditorExtensions = (): any[] => [
  StarterKit.configure({
    history: false,
    dropcursor: false,
  }),
  Document,
  Paragraph,
  Text,
  Highlight,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Dropcursor,
  BulletList,
  OrderedList,
  ListItem,
  Heading,
  HorizontalRule,
  Bold,
  Italic,
  Strike,
  Code,
  CodeBlock,
  Blockquote,
  HardBreak,
  History,
];
