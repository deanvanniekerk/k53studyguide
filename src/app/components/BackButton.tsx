import "./BackButton.css";

import { arrowBackOutline } from "ionicons/icons";
import React from "react";

import { IonFab, IonIcon } from "@ionic/react";

type Props = {
    onClick: () => void;
    icon?: string;
};

const BackButton: React.FC<Props> = (props) => {
    return (
        <IonFab vertical="top" horizontal="start" slot="fixed" onClick={props.onClick}>
            <IonIcon className="back-button" icon={props.icon || arrowBackOutline} />
        </IonFab>
    );
};

export { BackButton };
