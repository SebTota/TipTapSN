import { prosemirrorToYDoc } from 'y-prosemirror'
import {DOMParser} from "prosemirror-model"

import { elementFromString } from "./elementFromString";
import Extensions from "./Extensions";

export function htmlToYdoc (html) {
    return prosemirrorToYDoc(DOMParser.fromSchema(Extensions.getExtensionSchema()).parse(elementFromString(html), {preserveWhitespace: true}));
}
  
  