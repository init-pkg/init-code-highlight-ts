import './style.css'
import CodeHighlight from "@init-kz/code-highlight-ts";


// new placeholder
let ch: CodeHighlight | undefined = undefined;
let currentLanguage: string = "javascript";

// Функция смены языка
const changeLanguage = () => {
  const language = prompt("Enter a language to change to", currentLanguage);
  if (language) {
    currentLanguage = language;
    ch?.updateLanguage(language);
  }
};

// Функция переключения режима "только для чтения"
const toggleReadonly = () => {
  ch?.toggleReadonlyMode();
};

// Функция переключения номеров строк
const toggleLineNumbers = () => {
  ch?.toggleLineNumbers();
};

// Функция инициализации редактора с дефолтным кодом
const demoInit = () => {
  ch?.updateCode("Hello World");
};

// Функция создания редактора
const demoCreate = () => {
  demoDispose();
  ch = new CodeHighlight("#cf_holder", {
    language: currentLanguage,
    lineNumbers: true,
    copyButton: true,
    maxLines: 15,
    minLines: 5,
    languagesUrl: "/prismjs/components/",
  });
};

// Функция удаления редактора
const demoDispose = () => {
  if (ch) {
    ch.dispose();
    ch = undefined;
  }
};

// Привязываем обработчики событий после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn_create")?.addEventListener("click", demoCreate);
  document.getElementById("btn_init")?.addEventListener("click", demoInit);
  document
    .getElementById("btn_toggle_readonly")
    ?.addEventListener("click", toggleReadonly);
  document
    .getElementById("btn_toggle_linenumbers")
    ?.addEventListener("click", toggleLineNumbers);
  document
    .getElementById("btn_dispose")
    ?.addEventListener("click", demoDispose);
  document
    .getElementById("btn_change_language")
    ?.addEventListener("click", changeLanguage);

  // Создаём редактор по умолчанию
  demoCreate();
  demoInit();

  console.log(ch?.getPrism());
});
