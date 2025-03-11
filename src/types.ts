export interface InitCodeHighlightOptions {
  languagesUrl?: string;
  rtl?: boolean;
  tabSize?: number;
  enableAutocorrect?: boolean;
  lineNumbers?: boolean;
  defaultTheme?: boolean;
  areaId?: string | null;
  ariaLabelledby?: string | null;
  readonly?: boolean;
  copyButton?: boolean;
  maxLines?: number;
  minLines?: number;
  language?: string;
  styleParent?: HTMLElement;
  handleTabs?: boolean;
  handleSelfClosingCharacters?: boolean;
  handleNewLineIndentation?: boolean;
}

export type InitHighlightEventMap = {
  _input: (ev: Event) => void;
  _keydown: (ev: KeyboardEvent) => void;
  _scroll: (ev: Event) => void;
};
