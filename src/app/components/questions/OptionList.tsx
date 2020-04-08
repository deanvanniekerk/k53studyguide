import {
    checkmarkCircle,
    checkmarkCircleOutline,
    closeCircle,
    radioButtonOff,
    radioButtonOn,
} from "ionicons/icons";
import React from "react";
import { Translate } from "react-translated";
import styled from "styled-components";

import { QuestionItem, QuestionOption } from "@/data";
import { IonIcon } from "@ionic/react";

type Props = {
    question: QuestionItem;
    answer: string | null;
    showResult?: boolean;
    onOptionClicked?: (questionId: string, option: QuestionOption) => void;
};

const OptionList: React.FC<Props> = ({ question, answer, onOptionClicked, showResult }) => {
    const getIcon = (option: QuestionOption): React.ReactNode => {
        if (!showResult)
            return <Icon icon={option.id === answer ? radioButtonOn : radioButtonOff} />;

        //The correct answer (chosen)
        if (option.id === answer && answer === question.answer)
            return <Icon icon={checkmarkCircle} />;

        //The in-correct answer (chosen)
        if (option.id === answer && answer !== question.answer) return <Icon icon={closeCircle} />;

        //The correct answer (not chosen)
        if (option.id === question.answer) return <Icon icon={checkmarkCircleOutline} />;

        return <Icon icon={radioButtonOff} />;
    };

    return (
        <Container>
            {question.option.map((option) => {
                return (
                    <Row
                        key={option.id}
                        onClick={() => {
                            if (onOptionClicked) onOptionClicked(question.id, option);
                        }}
                    >
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

export { OptionList };
