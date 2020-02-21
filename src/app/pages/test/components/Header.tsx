import React from "react";

import { IonListHeader } from "@ionic/react";

const Header: React.FC = () => {
    return (
        <IonListHeader style={{ paddingTop: 55 }}>
            <h2>Test</h2>
        </IonListHeader>
    );
};

export { Header };
