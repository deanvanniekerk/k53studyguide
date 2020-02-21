import { radioButtonOff, radioButtonOn } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { QuestionAnswer, recieveAnswer } from "@/state/dojo/test";
import { IonIcon } from "@ionic/react";

type Props = {
    questionAnswer: QuestionAnswer;
} & PropsFromDispatch;

const OptionListComponent: React.FC<Props> = ({ questionAnswer, recieveAnswer }) => {
    const { question, answer } = questionAnswer;

    return (
        <Container>
            {question.option.map(option => {
                return (
                    <Row key={option.id} onClick={() => recieveAnswer(question.id, option.id)}>
                        <IconColum>
                            <Icon icon={option.id === answer ? radioButtonOn : radioButtonOff} />
                        </IconColum>
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
    font-size: var(--ion-font-size-l);
`;

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveAnswer }, dispatch),
    };
};

const OptionList = connect(null, mapDispatchToProps)(OptionListComponent);

export { OptionList };
