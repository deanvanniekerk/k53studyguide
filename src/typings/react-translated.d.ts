// prettier-ignore

declare module "react-translated" {
    
import React from "react";

    type TranslatedType = {
        getIsDebugging: () => boolean;
        getLanguage: () => string;
        getTranslation: () => Record<string, any>;
    };

    type TranslateData = {
        text: string;
        data?: Record<string, any>;
    };

    type TranslateFn = (data: TranslateData) => string;

    type TranslateObj = {
        translate: TranslateFn;
    };

    interface TranslatorProps {
        children: (t: TranslateObj) => React.Node;
        translated?: TranslatedType;
    }

    class Translator extends React.Component<TranslatorProps> {}

    interface TranslateProps {
        text: string;
        data?: Record<string, any>;
    }

    class Translate extends React.Component<TranslateProps> {}

    interface ProviderProps {
        language: string;
        translation: Record<string, any>;
    }

    class Provider extends React.Component<ProviderProps> {}
}
