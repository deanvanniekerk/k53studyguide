import { createContext, type ReactNode, useContext } from "react";

type TranslationData = Record<string, unknown>;
type TranslationTemplate = string | ((data: TranslationData) => string);
type Translations = Record<string, Record<string, TranslationTemplate>>;
type TranslateInput = { text: string; data?: TranslationData };
const TranslationContext = createContext<{ language: string; translation: Translations } | undefined>(undefined);

export function Provider({ language, translation, children }: {
  language: string;
  translation: Translations;
  children?: ReactNode;
}) {
  return <TranslationContext.Provider value={{ language, translation }}>{children}</TranslationContext.Provider>;
}

function useTranslate() {
  const context = useContext(TranslationContext);
  if (!context) throw new Error("Translation Provider is required");
  return ({ text, data = {} }: TranslateInput) => {
    const template = context.translation[text]?.[context.language];
    const translated = typeof template === "function" ? template(data) : template;
    return (translated || text).replace(/\{([^{}]+)\}/g, (_, key: string) => String(data[key] ?? ""));
  };
}

export function Translate(input: TranslateInput) {
  return <>{useTranslate()(input)}</>;
}

export function Translator({ children }: {
  children: (tools: { translate: (input: TranslateInput) => string }) => ReactNode;
}) {
  return children({ translate: useTranslate() });
}
