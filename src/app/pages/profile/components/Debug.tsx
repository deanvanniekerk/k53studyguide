import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import { AppVersion } from "@ionic-native/app-version";
import { Device } from "@ionic-native/device";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";

import { Row } from "./";

const Debug: React.FC = () => {
    const [appVersionNumber, setAppVersionNumber] = useState("");
    const [appVersionCode, setAppVersionCode] = useState("");

    useEffect(() => {
        const load = async () => {
            const avn = await AppVersion.getVersionNumber();
            setAppVersionNumber(avn);

            const avc = await AppVersion.getVersionCode();
            setAppVersionCode(avc.toString());
        };
        load();
    }, []);

    return (
        <Grid>
            <FullRow>
                <TitleCol>
                    <Title>Device</Title>
                </TitleCol>
            </FullRow>
            <Row name="App Version Number" value={appVersionNumber} />
            <Row name="App Version Code" value={appVersionCode} />
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
