import React from "react";
import styled from "styled-components";

import { IonCol, IonRow } from "@ionic/react";

type Props = {
    name: string;
    value: React.ReactNode;
};

const Row: React.FC<Props> = props => {
    return (
        <Container>
            <NameCol>{props.name}</NameCol>
            <ValueCol>{props.value}</ValueCol>
        </Container>
    );
};

const Container = styled(IonRow)`
    padding: 7px 0;
    align-items: center;
`;

const NameCol = styled(IonCol)`
    flex: 0;
    white-space: nowrap;
    padding-right: 15px;
`;

const ValueCol = styled(IonCol)`
    text-align: right;
`;

export { Row };
