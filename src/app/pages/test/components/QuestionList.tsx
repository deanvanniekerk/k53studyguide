import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { RootState } from "@/state";
import { questionAnswersSelector } from "@/state/dojo/test/selectors";
import { IonItem, IonList } from "@ionic/react";

import { ImageList, OptionList, Question } from "./";

type Props = PropsFromState;

const QuestionListComponent: React.FC<Props> = props => {
    return (
        <List>
            {props.questionAnswers.map((qa, index) => {
                return (
                    <Item key={qa.question.id}>
                        <Container>
                            <Header>Question: {index + 1}</Header>
                            <Question question={qa.question} />
                            <ImageList question={qa.question} />
                            <OptionList question={qa.question} />
                        </Container>
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
    padding-bottom: 25px;
`;

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

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        questionAnswers: questionAnswersSelector(state),
    };
};

const QuestionList = connect(mapStateToProps)(QuestionListComponent);

export { QuestionList };
