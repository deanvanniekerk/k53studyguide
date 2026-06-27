declare module "react-translated" {
  import React from "react";

  type TranslatedType = {
    getIsDebugging: () => boolean;
    getLanguage: () => string;
    getTranslation: () => Record<string, unknown>;
  };

  type TranslateData = {
    text: string;
    data?: Record<string, unknown>;
  };

  type TranslateFn = (data: TranslateData) => string;

  type TranslateObj = {
    translate: TranslateFn;
  };

  interface TranslatorProps {
    children: (t: TranslateObj) => React.ReactNode;
    translated?: TranslatedType;
  }

  class Translator extends React.Component<TranslatorProps> {}

  interface TranslateProps {
    text: string;
    data?: Record<string, unknown>;
  }

  class Translate extends React.Component<TranslateProps> {}

  interface ProviderProps {
    children?: React.ReactNode;
    language: string;
    translation: Record<string, unknown>;
  }

  class Provider extends React.Component<ProviderProps> {}
}
