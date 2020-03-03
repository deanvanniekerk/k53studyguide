import React from "react";

import { IonGrid, IonListHeader, IonRow } from "@ionic/react";

const Header: React.FC = () => {
    return (
        <React.Fragment>
            <IonListHeader>
                <IonGrid>
                    <IonRow style={{ paddingTop: 55 }}></IonRow>
                </IonGrid>
            </IonListHeader>
        </React.Fragment>
    );
};

export { Header };
