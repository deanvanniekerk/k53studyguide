import React from "react";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import { QuestionAnswer } from "@/state/dojo/test";

import { ImageList, OptionList, QuestionText } from "./";

type Props = {
    questionAnswer: QuestionAnswer;
    questionNumber: number;
};

const Question: React.FC<Props> = ({ questionAnswer, questionNumber }) => {
    return (
        <Container>
            <Header>Question: {questionNumber}</Header>
            <QuestionText question={questionAnswer.question} />
            <ImageList question={questionAnswer.question} />
            <HorizontalRule leftMargin={20} rightMargin={36} paddingBottom={0} paddingTop={20} />
            <OptionList questionAnswer={questionAnswer} />
        </Container>
    );
};

const Container = styled.div`
    border-radius: var(--ic-corner-radius);
    border: var(--ic-border);
    padding: var(--ic-padding);
    width: 100%;
    height: 100%;
    line-height: var(--line-height);
    font-size: var(--ion-font-size-md);
`;

const Header = styled.div`
    font-weight: bold;
    padding-top: 8px;
    padding-bottom: 10px;
`;

export { Question };
