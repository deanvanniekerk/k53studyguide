import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { RootState } from "@/state";
import { questionAnswersSelector } from "@/state/dojo/test/selectors";
import { IonItem, IonList } from "@ionic/react";

import { Question } from "./";

type Props = PropsFromState;

const QuestionListComponent: React.FC<Props> = props => {
    return (
        <List>
            {props.questionAnswers.map((qa, index) => {
                return (
                    <Item key={qa.question.id}>
                        <Question questionAnswer={qa} questionNumber={index + 1} />
                    </Item>
                );
            })}
        </List>
    );
};

const List = styled(IonList)`
    padding-top: 25px;
    padding-bottom: 25px;
`;

const Item = styled(IonItem)`
    overflow: hidden;
    padding-bottom: 25px;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        questionAnswers: questionAnswersSelector(state),
    };
};

const QuestionList = connect(mapStateToProps)(QuestionListComponent);

export { QuestionList };
