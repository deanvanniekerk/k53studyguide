import {
    checkmarkCircle,
    checkmarkCircleOutline,
    closeCircle,
    radioButtonOff,
    radioButtonOn,
} from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { QuestionOption } from "@/data";
import { QuestionAnswer, recieveAnswer } from "@/state/dojo/test";
import { IonIcon } from "@ionic/react";

type Props = {
    questionAnswer: QuestionAnswer;
    showResult?: boolean;
} & PropsFromDispatch;

const OptionListComponent: React.FC<Props> = ({ questionAnswer, recieveAnswer, showResult }) => {
    const { question, answer } = questionAnswer;

    const getIcon = (option: QuestionOption): React.ReactNode => {
        if (!showResult)
            return <Icon icon={option.id === answer ? radioButtonOn : radioButtonOff} />;

        //The correct answer (chosen)
        if (
            option.id === questionAnswer.answer &&
            questionAnswer.answer === questionAnswer.question.answer
        )
            return <Icon icon={checkmarkCircle} />;

        //The in-correct answer (chosen)
        if (
            option.id === questionAnswer.answer &&
            questionAnswer.answer !== questionAnswer.question.answer
        )
            return <Icon icon={closeCircle} />;

        //The correct answer (not chosen)
        if (option.id === questionAnswer.question.answer)
            return <Icon icon={checkmarkCircleOutline} />;

        return <Icon icon={radioButtonOff} />;
    };

    const onAnswerClicked = (option: QuestionOption) => {
        if (showResult) return;
        recieveAnswer(question.id, option.id);
    };

    return (
        <Container>
            {question.option.map(option => {
                return (
                    <Row key={option.id} onClick={() => onAnswerClicked(option)}>
                        <IconColum>{getIcon(option)}</IconColum>
                        <div>
                            <Translate text={option.value} />
                        </div>
                    </Row>
                );
            })}
        </Container>
    );
};

const Container = styled.div`
    padding-top: 10px;
    padding-bottom: 8px;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 6px;
`;

const IconColum = styled.div`
    padding-right: 15px;
    padding-top: 3px;
    vertical-align: middle;
`;

const Icon = styled(IonIcon)`
    font-size: var(--ion-font-size-xl);
`;

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveAnswer }, dispatch),
    };
};

const OptionList = connect(null, mapDispatchToProps)(OptionListComponent);

export { OptionList };
