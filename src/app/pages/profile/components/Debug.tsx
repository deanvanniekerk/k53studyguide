import React from "react";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import { Device } from "@ionic-native/device";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";

import { Row } from "./";

const Debug: React.FC = () => {
    return (
        <Grid>
            <FullRow>
                <TitleCol>
                    <Title>Debug</Title>
                </TitleCol>
            </FullRow>
            <Row name="Device Model" value={Device.model} />
            <Row name="Device Id" value={Device.uuid} />
            <Row name="Device Version" value={Device.version} />
            <FullRow>
                <IonCol>{LineBreak}</IonCol>
            </FullRow>
        </Grid>
    );
};

const Grid = styled(IonGrid)`
    padding: 0 16px;
    margin-top: 15px;
`;

const FullRow = styled(IonRow)`
    padding: 7px 0;
    align-items: center;
`;

const Title = styled(IonText)`
    opacity: 0.5;
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
    text-transform: uppercase;
`;

const TitleCol = styled(IonCol)`
    padding-bottom: 5px;
`;

const LineBreak = (
    <HorizontalRule leftMargin={0} rightMargin={0} paddingBottom={0} paddingTop={0} />
);

export { Debug };
