import { ellipseOutline } from "ionicons/icons";
import React from "react";
import { Translate } from "react-translated";
import styled from "styled-components";

import { QuestionItem } from "@/data";
import { IonIcon } from "@ionic/react";

type Props = {
    question: QuestionItem;
};

const OptionList: React.FC<Props> = ({ question }) => {
    return (
        <Container>
            {question.option.map(option => {
                return (
                    <Row key={option.id}>
                        <IconColum>
                            <Icon icon={ellipseOutline} />
                        </IconColum>
                        <TextColumn>
                            <Translate text={option.value} />
                        </TextColumn>
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

const TextColumn = styled.div``;

export { OptionList };
