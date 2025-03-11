export function injectCss(
  css: string | undefined,
  styleName: string = "init-code-highlight-style",
  parent: HTMLElement = document.head
): boolean {
  const CSS_ID = styleName;
  const PARENT = parent;

  if (!css) {
    return false;
  }

  if (document.getElementById(CSS_ID)) {
    return true;
  }

  const style = document.createElement("style");
  style.innerHTML = css;
  style.id = CSS_ID;
  PARENT.appendChild(style);

  return true;
}
