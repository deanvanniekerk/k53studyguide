import React from "react";
import { Translate } from "react-translated";
import styled from "styled-components";

import { QuestionItem, QuestionText as QuestionList } from "@/data";

type Props = {
    question: QuestionItem;
};

const QuestionText: React.FC<Props> = ({ question }) => {
    const getQuestionTextComponent = (text: string | QuestionList): React.ReactNode => {
        if (typeof text === "string") return <Translate text={text} />;

        if ((text as QuestionList).list) {
            const list = text.list;

            return (
                <List>
                    {list.map(item => (
                        <ListItem key={item}>{<Translate text={item} />}</ListItem>
                    ))}
                </List>
            );
        }

        return <React.Fragment />;
    };

    return <>{getQuestionTextComponent(question.text)}</>;
};

const List = styled.ul`
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 20px;
`;

const ListItem = styled.li`
    padding: 5px 0;
`;

export { QuestionText };
