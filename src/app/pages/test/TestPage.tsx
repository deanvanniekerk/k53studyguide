import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { BackButton } from "@/app/components";
import { IonContent, IonPage } from "@ionic/react";

import { Header, QuestionList } from "./components";

const TestPage: React.FC = () => {
    const history = useHistory();

    const onBackClicked = () => {
        if (history.length === 0) history.replace("/dojo");
        else history.goBack();
    };

    return (
        <IonPage>
            <Content>
                <BackButton onClick={onBackClicked} />
                <Header />
                <QuestionList />
            </Content>
        </IonPage>
    );
};

const Content = styled(IonContent)`
    --background: linear-gradient(to right bottom, #501a8e, #9a0684, #cc1e73, #ed4c60, #ff7b51);
`;

export default TestPage;
