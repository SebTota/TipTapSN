import { getSchema } from "@tiptap/core";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Dropcursor from "@tiptap/extension-dropcursor";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Bold from "@tiptap/extension-bold";
import Italics from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import History from "@tiptap/extension-history";

export default class Extensions {
  static _extensions = [
    Table.configure({
      resizable: true,
    }),
    Document,
    Paragraph.extend({
      addAttributes() {
        return {
          testAttr: {
            ...this.parent?.(),
            default: null,
            keepOnSplit: false,
          },
        };
      },
      addKeyboardShortcuts() {
        return {
          Tab: () => {
            return this.editor.commands.insertContent("&emsp;");
          },
        };
      },
    }),
    Text,
    Image,
    Dropcursor,
    TableRow,
    TableHeader,
    TableCell,
    Highlight,
    TaskList,
    TaskItem,
    Blockquote,
    BulletList,
    OrderedList,
    ListItem,
    Code,
    CodeBlock,
    HardBreak,
    Heading,
    HorizontalRule,
    Bold,
    Italics,
    Strike,
  ];

  static getExtensions() {
    return this._extensions;
  }

  static getHistoryExtension() {
    return History;
  }

  static getExtensionSchema() {
    return getSchema(this._extensions);
  }
}
