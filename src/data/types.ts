export type ContentData = {
    [key: string]: ContentItem[];
};

export type ContentItem = {
    imageName: string;
    heading: string;
    description: string;
};

export type NavigationData = {
    [key: string]: string[];
};

export type Translations = {
    [key: string]: string;
};

export type QuestionData = {
    [key: string]: QuestionItem[];
};

export type QuestionItem = {
    id: string;
    text: string | QuestionText;
    image?: string;
    image2?: string;
    answer: string;
    option: QuestionOptions[];
};

export type QuestionText = {
    list: string[];
};

export type QuestionOptions = {
    id: string;
    value: string;
};
