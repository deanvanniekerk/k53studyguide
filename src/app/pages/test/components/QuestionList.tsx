import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { RootState } from "@/state";
import { questionAnswersSelector } from "@/state/dojo/test/selectors";

import { Question } from "./";

type Props = {
    showResult?: boolean;
} & PropsFromState;

const QuestionListComponent: React.FC<Props> = props => {
    return (
        <List>
            {props.questionAnswers.map((qa, index) => {
                return (
                    <Item key={qa.question.id}>
                        <Question
                            questionAnswer={qa}
                            questionNumber={index + 1}
                            showResult={props.showResult}
                        />
                    </Item>
                );
            })}
        </List>
    );
};

const List = styled.div`
    padding-top: 30px;
    margin: 0 16px;
`;

const Item = styled.div`
    overflow: hidden;
    padding-bottom: 30px;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        questionAnswers: questionAnswersSelector(state),
    };
};

const QuestionList = connect(mapStateToProps)(QuestionListComponent);

export { QuestionList };
