import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import { UniqueDeviceID } from "@ionic-native/unique-device-id";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";

const Debug: React.FC = () => {
    const [deviceId, setDeviceId] = useState("");

    useEffect(() => {
        const loadDeviceId = async () => {
            const id = await UniqueDeviceID.get();
            setDeviceId(id);
        };
        loadDeviceId();
    }, []);

    return (
        <Grid>
            <Row>
                <TitleCol>
                    <Title>Debug</Title>
                </TitleCol>
            </Row>
            <Row>
                <NameCol>Device Id</NameCol>
                <ValueCol>{deviceId}</ValueCol>
            </Row>
            <Row>
                <IonCol>{LineBreak}</IonCol>
            </Row>
        </Grid>
    );
};

const Grid = styled(IonGrid)`
    padding: 0 16px;
    margin-top: 15px;
`;

const Row = styled(IonRow)`
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

const NameCol = styled(IonCol)`
    flex: 0;
    white-space: nowrap;
    padding-right: 15px;
`;

const ValueCol = styled(IonCol)`
    text-align: right;
`;

const LineBreak = (
    <HorizontalRule leftMargin={0} rightMargin={0} paddingBottom={0} paddingTop={0} />
);

export { Debug };
