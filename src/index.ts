import { InitCodeHighlightOptions, InitHighlightEventMap } from "@/types";
import { editorCss } from "./styles/editor";
import { injectCss } from "./styles/injector";
import { defaultCssTheme } from "./styles/theme-default";
import { escapeHtml } from "./utils/html-escape";
import Prism from "prismjs";
import "prismjs/plugins/autoloader/prism-autoloader";

export type { InitCodeHighlightOptions };

export default class InitCodeHighlight {
  editorRoot!: HTMLElement;
  opts: InitCodeHighlightOptions;
  events: InitHighlightEventMap;
  code: string = "";
  elWrapper!: HTMLElement;
  elTextarea!: HTMLTextAreaElement;
  elPre!: HTMLElement;
  elCode!: HTMLElement;
  elLineNumbers!: HTMLElement;
  elCopyButton!: HTMLElement;
  elCopyButtonMessage!: HTMLElement;
  lineNumber: number = 0;

  constructor(
    selectorOrElement: string | HTMLElement,
    opts: InitCodeHighlightOptions
  ) {
    if (!selectorOrElement) {
      throw new Error(
        "InitCodeHighlight expects a parameter which is Element or a String selector"
      );
    }

    if (!opts) {
      throw new Error(
        "InitCodeHighlight expects an object containing options as second parameter"
      );
    }

    Prism.plugins.autoloader.languages_path =
      opts.languagesUrl ||
      "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/";

    if (selectorOrElement instanceof HTMLElement) {
      this.editorRoot = selectorOrElement;
    } else {
      const editorRoot = document.querySelector<HTMLElement>(selectorOrElement);
      if (editorRoot) {
        this.editorRoot = editorRoot;
      }
    }

    this.opts = opts;

    this.events = {
      _input() {},
      _keydown() {},
      _scroll() {},
    };

    this.startEditor();
  }

  protected startEditor() {
    const isCSSInjected = injectCss(
      editorCss,
      undefined,
      this.opts.styleParent
    );
    if (!isCSSInjected) {
      throw new Error("Failed to inject init-code-highlight CSS.");
    }

    this.createWrapper();
    this.createTextarea();
    this.createPre();
    this.createCode();

    this.runOptions();
    this.listenTextarea();
    this.populateDefault();
    this.updateCode(this.code);

    // this.elTextarea.addEventListener('keyup', (e) => {
    //   this.highlight()
    // });
  }

  protected createWrapper() {
    this.code = this.editorRoot.innerHTML;
    this.editorRoot.innerHTML = "";
    this.elWrapper = this.createElement("div", this.editorRoot);
    this.elWrapper.classList.add("init-code-highlight");
  }

  protected createTextarea() {
    this.elTextarea = this.createElement(
      "textarea",
      this.elWrapper
    ) as HTMLTextAreaElement;
    this.elTextarea.classList.add(
      "init-code-highlight__textarea",
      "init-code-highlight__flatten"
    );
  }

  protected createPre() {
    this.elPre = this.createElement("pre", this.elWrapper);
    this.elPre.classList.add(
      "init-code-highlight__pre",
      "init-code-highlight__flatten",
      `language-${this.opts.language || "plain"}`
    );
  }

  protected createCode() {
    this.elCode = this.createElement("code", this.elPre);
    this.elCode.classList.add(
      "init-code-highlight__code",
      `language-${this.opts.language || "html"}`
    );
  }

  protected createLineNumbers() {
    this.elLineNumbers = this.createElement("div", this.elWrapper);
    this.elLineNumbers.classList.add("init-code-highlight__lines");
    this.elWrapper.classList.add("init-code-highlight--has-line-numbers");
    this.setLineNumber();
  }

  protected createCopyButton() {
    this.elCopyButtonMessage = this.createElement("div", this.elWrapper);
    this.elCopyButtonMessage.classList.add("init-code-highlight__copyMessage");
    this.elCopyButtonMessage.innerHTML = "Copied!";
    this.elCopyButtonMessage.style.display = "none";

    this.elCopyButton = this.createElement("div", this.elWrapper);
    this.elCopyButton.classList.add("init-code-highlight__copyButton");
    this.elCopyButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polygon points="88 40 88 88 168 88 168 168 216 168 216 40 88 40" opacity="0.2"/><polyline points="168 168 216 168 216 40 88 40 88 88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><rect x="40" y="88" width="128" height="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>';
    this.elCopyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(this.code).then(() => {
        this.elCopyButtonMessage.style.display = "block";
        setTimeout(() => {
          this.elCopyButtonMessage.style.display = "none";
        }, 1000);
      });
    });
  }

  protected destroyLineNumbers() {
    this.elWrapper.classList.remove("init-code-highlight--has-line-numbers");
    if (this.elLineNumbers) {
      this.elLineNumbers.remove();
    }
  }

  protected createElement(
    elementTag: string,
    whereToAppend: HTMLElement
  ): HTMLElement {
    const element = document.createElement(elementTag);
    whereToAppend.appendChild(element);
    return element;
  }

  protected runOptions() {
    this.opts.rtl = this.opts.rtl || false;
    this.opts.tabSize = this.opts.tabSize || 2;
    this.opts.enableAutocorrect = this.opts.enableAutocorrect || false;
    this.opts.lineNumbers = this.opts.lineNumbers || false;
    this.opts.defaultTheme = this.opts.defaultTheme !== false;
    this.opts.areaId = this.opts.areaId || null;
    this.opts.ariaLabelledby = this.opts.ariaLabelledby || null;
    this.opts.readonly = this.opts.readonly || false;
    this.opts.copyButton = this.opts.copyButton || false;
    this.opts.maxLines = this.opts.maxLines || 100;
    this.opts.minLines = this.opts.minLines || 1;

    if (typeof this.opts.handleTabs !== "boolean") {
      this.opts.handleTabs = true;
    }
    if (typeof this.opts.handleSelfClosingCharacters !== "boolean") {
      this.opts.handleSelfClosingCharacters = true;
    }
    if (typeof this.opts.handleNewLineIndentation !== "boolean") {
      this.opts.handleNewLineIndentation = true;
    }

    if (this.opts.rtl === true) {
      this.elTextarea.setAttribute("dir", "rtl");
      this.elPre.setAttribute("dir", "rtl");
    }

    if (this.opts.enableAutocorrect === false) {
      this.elTextarea.setAttribute("spellcheck", "false");
      this.elTextarea.setAttribute("autocapitalize", "off");
      this.elTextarea.setAttribute("autocomplete", "off");
      this.elTextarea.setAttribute("autocorrect", "off");
    }

    if (this.opts.lineNumbers) {
      this.createLineNumbers();
    }

    if (this.opts.defaultTheme) {
      injectCss(defaultCssTheme, "theme-default", this.opts.styleParent);
    }

    if (this.opts.areaId) {
      this.elTextarea.setAttribute("id", this.opts.areaId);
    }

    if (this.opts.ariaLabelledby) {
      this.elTextarea.setAttribute("aria-labelledby", this.opts.ariaLabelledby);
    }

    if (this.opts.readonly) {
      this.enableReadonlyMode();
    }

    if (this.opts.copyButton) {
      this.createCopyButton();
    }

    if (this.opts.lineNumbers) {
      this.updateLineNumbersCount();
    }
  }

  protected updateLineNumbersCount() {
    let numberList = "";
    for (let i = 1; i <= this.lineNumber; i++) {
      numberList =
        numberList +
        `<span class="init-code-highlight__lines__line">${i}</span>`;
    }
    this.elLineNumbers!.innerHTML = numberList;
  }

  protected updateEditorHeight() {
    let maxLineNumber = this.opts.maxLines || 100;
    let minLineNumber = this.opts.minLines || 3;
    let limitedLineNumber = this.lineNumber;
    if (limitedLineNumber > maxLineNumber) {
      limitedLineNumber = maxLineNumber;
    } else if (limitedLineNumber < minLineNumber) {
      limitedLineNumber = minLineNumber;
    }

    this.elWrapper.style.height = `${limitedLineNumber * 20 + 24}px`;
  }

  protected listenTextarea() {
    this.events._input = (e) => {
      if (this.opts.readonly) {
        return;
      }
      const target = e.target as HTMLInputElement;
      this.code = target.value;
      this.elCode.innerHTML = escapeHtml(target.value);

      this.highlight();

      setTimeout(() => {
        this.runUpdate();
        this.setLineNumber();
      }, 1);
    };

    this.elTextarea.addEventListener("input", this.events._input);

    this.elTextarea.addEventListener(
      "keydown",
      (this.events._keydown = (e: KeyboardEvent) => {
        if (this.opts.readonly) {
          return;
        }
        this.handleTabs(e);
        this.handleSelfClosingCharacters(e);
        this.handleNewLineIndentation(e);
      })
    );

    this.elTextarea.addEventListener(
      "scroll",
      (this.events._scroll = (e) => {
        const target = e.target as HTMLElement;
        this.elPre.style.transform = `translate3d(-${target.scrollLeft}px, -${target.scrollTop}px, 0)`;
      })
    );
  }

  protected handleTabs(e: KeyboardEvent) {
    if (this.opts.handleTabs) {
      if (e.code !== "Tab") {
        return;
      }

      e.preventDefault();

      const input = this.elTextarea as HTMLTextAreaElement;
      const selectionDir = input.selectionDirection;
      const selStartPos = input.selectionStart;
      const selEndPos = input.selectionEnd;
      const inputVal = input.value;

      let beforeSelection = inputVal.substring(0, selStartPos);
      let selectionVal = inputVal.substring(selStartPos, selEndPos);
      const afterSelection = inputVal.substring(selEndPos);
      const indent = " ".repeat(this.opts.tabSize || 2);

      if (selStartPos !== selEndPos && selectionVal.length >= indent.length) {
        const currentLineStart =
          selStartPos - (beforeSelection.split("\n").pop()?.length || 0);
        let startIndentLen = indent.length;
        let endIndentLen = indent.length;

        // Unindent
        if (e.shiftKey) {
          const currentLineStartStr = inputVal.substring(
            currentLineStart,
            currentLineStart + indent.length
          );

          // Line start with indent
          if (currentLineStartStr === indent) {
            startIndentLen = -startIndentLen;

            if (currentLineStart > selStartPos) {
              // Indent is in selection
              selectionVal =
                selectionVal.substring(0, currentLineStart) +
                selectionVal.substring(currentLineStart + indent.length);
              endIndentLen = 0;
            } else if (currentLineStart === selStartPos) {
              // Indent is at the start of selection
              startIndentLen = 0;
              endIndentLen = 0;
              selectionVal = selectionVal.substring(indent.length);
            } else {
              // Indent is before selection
              endIndentLen = -endIndentLen;
              beforeSelection =
                beforeSelection.substring(0, currentLineStart) +
                beforeSelection.substring(currentLineStart + indent.length);
            }
          } else {
            startIndentLen = 0;
            endIndentLen = 0;
          }

          selectionVal = selectionVal.replace(
            new RegExp("\n" + indent.split("").join("\\"), "g"),
            "\n"
          );
        } else {
          // Indent
          beforeSelection =
            beforeSelection.substring(0, currentLineStart) +
            indent +
            beforeSelection.substring(currentLineStart, selStartPos);
          selectionVal = selectionVal.replace(/\n/g, "\n" + indent);
        }

        // Set new indented value
        input.value = beforeSelection + selectionVal + afterSelection;

        input.selectionStart = selStartPos + startIndentLen;
        input.selectionEnd = selStartPos + selectionVal.length + endIndentLen;
        input.selectionDirection = selectionDir;
      } else {
        input.value = beforeSelection + indent + afterSelection;
        input.selectionStart = selStartPos + indent.length;
        input.selectionEnd = selStartPos + indent.length;
      }

      const newCode = input.value;
      this.updateCode(newCode);
      input.selectionEnd = selEndPos + (this.opts?.tabSize || 2);
    }
  }

  protected handleSelfClosingCharacters(e: KeyboardEvent) {
    if (!this.opts.handleSelfClosingCharacters) return;

    const openChars: string[] = ["(", "[", "{", "<", "'", '"'];
    const closeChars: string[] = [")", "]", "}", ">", "'", '"'];
    const key: string = e.key;

    if (!openChars.includes(key) && !closeChars.includes(key)) {
      return;
    }

    this.closeCharacter(key);
  }

  protected setLineNumber() {
    this.lineNumber = this.code.split("\n").length;
    if (this.opts.lineNumbers) {
      this.updateLineNumbersCount();
    }
    this.updateEditorHeight();
  }

  protected handleNewLineIndentation(e: KeyboardEvent) {
    if (!this.opts.handleNewLineIndentation) return;
    if (e.code !== "Enter") {
      return;
    }

    e.preventDefault();
    const input = this.elTextarea as HTMLTextAreaElement;
    const selStartPos = input.selectionStart;
    const selEndPos = input.selectionEnd;
    const inputVal = input.value;

    const beforeSelection = inputVal.substring(0, selStartPos);
    const afterSelection = inputVal.substring(selEndPos);

    const lineStart = inputVal.lastIndexOf("\n", selStartPos - 1);
    const spaceLast =
      lineStart + inputVal.slice(lineStart + 1).search(/[^ ]|$/);
    const indent = spaceLast > lineStart ? spaceLast - lineStart : 0;
    const newCode =
      beforeSelection + "\n" + " ".repeat(indent) + afterSelection;

    input.value = newCode;
    input.selectionStart = selStartPos + indent + 1;
    input.selectionEnd = selStartPos + indent + 1;

    this.updateCode(input.value);
    this.updateEditorHeight();
  }

  protected closeCharacter(char: string) {
    const input = this.elTextarea as HTMLTextAreaElement;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;

    if (!this.skipCloseChar(char)) {
      let closeChar: string = char;
      switch (char) {
        case "(":
          closeChar = String.fromCharCode(char.charCodeAt(0) + 1);
          break;
        case "<":
        case "{":
        case "[":
          closeChar = String.fromCharCode(char.charCodeAt(0) + 2);
          break;
      }
      const selectionText = this.code.substring(selectionStart, selectionEnd);
      const newCode = `${this.code.substring(
        0,
        selectionStart
      )}${selectionText}${closeChar}${this.code.substring(selectionEnd)}`;
      this.updateCode(newCode);
    } else {
      const skipChar =
        this.code.substring(selectionEnd, selectionEnd + 1) === char;
      const newSelectionEnd = skipChar ? selectionEnd + 1 : selectionEnd;
      const closeChar = !skipChar && ["'", '"'].includes(char) ? char : "";
      const newCode = `${this.code.substring(
        0,
        selectionStart
      )}${closeChar}${this.code.substring(newSelectionEnd)}`;
      this.updateCode(newCode);
      input.selectionEnd = ++input.selectionStart;
    }

    input.selectionEnd = selectionStart;
  }

  protected skipCloseChar(char: string): boolean {
    const input = this.elTextarea as HTMLTextAreaElement;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    const hasSelection = Math.abs(selectionEnd - selectionStart) > 0;

    return (
      [")", "}", "]", ">"].includes(char) ||
      (["'", '"'].includes(char) && !hasSelection)
    );
  }

  public updateCode(newCode: string) {
    this.code = newCode;
    // this.elTextarea.value = escapeHtml(newCode)
    this.elTextarea.value = newCode;
    this.elCode.innerHTML = escapeHtml(newCode);
    this.highlight();
    this.setLineNumber();
    setTimeout(this.runUpdate.bind(this), 1);
  }

  public updateLanguage(newLanguage: string) {
    this.opts.language = newLanguage;
    this.elCode.classList.forEach((className) => {
      if (className.startsWith("language-")) {
        this.elCode.classList.remove(className);
      }
    });

    this.elCode.classList.add(`language-${newLanguage}`);
    this.highlight();
  }

  public getPrism() {
    return Prism;
  }

  protected populateDefault() {
    this.updateCode(this.code);
  }

  public highlight() {
    Prism.highlightElement(this.elCode, false);
  }

  protected updateCallBack: ((code: string) => void) | null = null;

  public onUpdate(callback: (code: string) => void) {
    // console.log("chanfge")
    if (callback && {}.toString.call(callback) !== "[object Function]") {
      throw Error("CodeHighlight expects callback of type Function");
    }

    this.updateCallBack = callback;
  }

  public getCode() {
    return this.code;
  }

  public runUpdate() {
    if (this.updateCallBack) {
      this.updateCallBack(this.code);
    }
  }

  public enableReadonlyMode() {
    this.elTextarea.setAttribute("readonly", "true");
    this.opts.readonly = true;
  }

  public disableReadonlyMode() {
    this.elTextarea.removeAttribute("readonly");
    this.opts.readonly = false;
  }

  public toggleReadonlyMode() {
    if (!this.opts.readonly) {
      this.enableReadonlyMode();
    } else {
      this.disableReadonlyMode();
    }
  }

  public enableLineNumbers() {
    this.opts.lineNumbers = true;
    this.destroyLineNumbers();
    this.createLineNumbers();
    this.updateLineNumbersCount();
  }

  public disableLineNumbers() {
    if (this.opts.lineNumbers) {
      this.destroyLineNumbers();
    }
    this.opts.lineNumbers = false;
  }

  public toggleLineNumbers() {
    if (!this.opts.lineNumbers) {
      this.enableLineNumbers();
    } else {
      this.disableLineNumbers();
    }
  }

  public dispose() {
    this.elTextarea.removeEventListener("input", this.events._input);
    this.elTextarea.removeEventListener("keydown", this.events._keydown);
    this.elTextarea.removeEventListener("scroll", this.events._scroll);
    this.elWrapper.remove();
  }
}
