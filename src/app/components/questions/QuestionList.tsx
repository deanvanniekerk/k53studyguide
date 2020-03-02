import React from "react";
import styled from "styled-components";

import { QuestionItem, QuestionOption } from "@/data";

import { Question } from "./";

export type QuestionInfo = {
    question: QuestionItem;
    answer: string | null;
};

type Props = {
    showResult?: boolean;
    questions: QuestionInfo[];
    onOptionClicked?: (questionId: string, option: QuestionOption) => void;
};

const QuestionList: React.FC<Props> = props => {
    return (
        <List>
            {props.questions.map((q, index) => {
                return (
                    <Item key={q.question.id}>
                        <Question
                            answer={q.answer}
                            question={q.question}
                            questionNumber={index + 1}
                            showResult={props.showResult}
                            onOptionClicked={props.onOptionClicked}
                        />
                    </Item>
                );
            })}
        </List>
    );
};

const List = styled.div`
    margin: 0 16px;
`;

const Item = styled.div`
    overflow: hidden;
    padding-bottom: 30px;
`;

export { QuestionList };
