import DOMPurify  from 'dompurify';

export default class UnsafeContentCheck {
    constructor() {}

    /*
    * Check if there is any unsafe content in the HTML
    * @return   Boolean     Results of HTML unsafe content check
    * https://github.com/standardnotes/bold-editor/blob/95ad735dbd8dfca512263ad1bce8744966d111e4/app/components/Editor.js#L272
    */
    static checkForUnsafeContent(html) {
        const sanitizedHtml = DOMPurify.sanitize(html, {
            FORBID_TAGS: ['script', 'style'],
            FORBID_ATTR: [
              'onerror',
              'onload',
              'onunload',
              'onclick',
              'ondblclick',
              'onmousedown',
              'onmouseup',
              'onmouseover',
              'onmousemove',
              'onmouseout',
              'onfocus',
              'onblur',
              'onkeypress',
              'onkeydown',
              'onkeyup',
              'onsubmit',
              'onreset',
              'onselect',
              'onchange'
            ]
          });
      
          /**
           * Create documents from both the sanitized string and the rendered string.
           * This will allow us to compare them, and if they are not equal
           * (i.e: do not contain the same properties, attributes, inner text, etc)
           * it means something was stripped.
           */
          const renderedDom = new DOMParser().parseFromString(html, 'text/html');
          const sanitizedDom = new DOMParser().parseFromString(sanitizedHtml, 'text/html');
          return !renderedDom.isEqualNode(sanitizedDom);
    }

    /*
    * Get the sanitized HTML
    * @return   String      The sanitized HTML
    */
    static getSanitizedHtml(html) {
        return new DOMParser().parseFromString(html, 'text/html');
    }
}