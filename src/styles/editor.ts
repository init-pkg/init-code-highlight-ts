import { BACKGROUND_COLOR, LINE_HEIGHT, FONT_SIZE } from "./theme-default";
import { cssSupports } from "../utils/css-supports";

const FONT_FAMILY = `"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace`;
const COLOR = cssSupports("caret-color", "#000") ? BACKGROUND_COLOR : "#ccc";
const LINE_NUMBER_WIDTH = "40px";

export const editorCss = `
  .init-code-highlight {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border : 1px solid #EAEEFB;
    border-radius: 4px;
    position: relative;
  }

  .init-code-highlight, .init-code-highlight * {
    box-sizing: border-box;
  }

  .init-code-highlight__pre {
    pointer-events: none;
    z-index: 3;
    overflow: hidden;
  }

  .init-code-highlight__textarea {
    background: none;
    border: none;
    color: ${COLOR};
    z-index: 1;
    resize: none;
    font-family: ${FONT_FAMILY};
    -webkit-appearance: pre;
    caret-color: #111;
    z-index: 2;
    width: 100%;
    height: 100%;
  }

  .init-code-highlight--has-line-numbers .init-code-highlight__textarea {
    width: calc(100% - ${LINE_NUMBER_WIDTH});
  }

  .init-code-highlight__code {
    display: block;
    font-family: ${FONT_FAMILY};
    overflow: hidden;
  }

  .init-code-highlight__flatten {
    padding: 10px;
    font-size: ${FONT_SIZE};
    line-height: ${LINE_HEIGHT};
    white-space: pre;
    position: absolute;
    top: 0;
    left: 0;
    overflow: auto;
    margin: 0 !important;
    outline: none;
    text-align: left;
  }

  .init-code-highlight--has-line-numbers .init-code-highlight__flatten {
    width: calc(100% - ${LINE_NUMBER_WIDTH});
    left: ${LINE_NUMBER_WIDTH};
  }

  .init-code-highlight__line-highlight {
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    height: ${LINE_HEIGHT};
    background: rgba(0,0,0,0.1);
    z-index: 1;
  }

  .init-code-highlight__lines {
    padding: 10px 4px;
    font-size: 12px;
    line-height: ${LINE_HEIGHT};
    font-family: 'Cousine', monospace;
    position: absolute;
    left: 0;
    top: 0;
    width: ${LINE_NUMBER_WIDTH};
    height: 100%;
    text-align: right;
    color: #999;
    z-index: 2;
  }

  .init-code-highlight__lines__line {
    display: block;
  }

  .init-code-highlight.init-code-highlight--has-line-numbers {
    padding-left: ${LINE_NUMBER_WIDTH};
  }

  .init-code-highlight.init-code-highlight--has-line-numbers:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: ${LINE_NUMBER_WIDTH};
    height: 100%;
    // background: #eee;
    background: #dcdfe6;
    z-index: 1;
  }

  .init-code-highlight__copyButton{
    position: absolute;
    right: 5px;
    top: 5px;
    z-index: 3;
    background: #EAEEFB;
    border: none;
    color: #999;
    cursor: pointer;
    outline: none;
    width: 22px;
    height: 22px;
    border-radius: 4px;
  }

  .init-code-highlight__copyMessage{
    position: absolute;
    right: 32px;
    top: 5px;
    z-index: 3;
    background: #EAEEFB;
    border: none;
    color: #999;
    cursor: pointer;
    outline: none;
    width: 55px;
    height: 22px;
    line-height: 22px;
    border-radius: 4px;
    font-size: 12px;
    text-align: center;
    font-family: 'Cousine', monospace;
  }

`;
