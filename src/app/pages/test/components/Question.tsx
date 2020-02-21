import React from "react";
import { Translate } from "react-translated";
import styled from "styled-components";

import { QuestionItem, QuestionText } from "@/data";

type Props = {
    question: QuestionItem;
};

const Question: React.FC<Props> = ({ question }) => {
    const getQuestionTextComponent = (text: string | QuestionText): React.ReactNode => {
        if (typeof text === "string") return <Text text={text} />;

        if ((text as QuestionText).list) {
            const list = text.list;

            return (
                <List>
                    {list.map(item => (
                        <li key={item}>{<Text text={item} />}</li>
                    ))}
                </List>
            );
        }

        return <React.Fragment />;
    };

    return <div className="text-md">{getQuestionTextComponent(question.text)}</div>;
};

const List = styled.ul`
    margin-block-start: 0;
    margin-block-end: 0;
    line-height: var(--line-height);
`;

const Text = styled(Translate)`
    line-height: var(--line-height);
`;

export { Question };
