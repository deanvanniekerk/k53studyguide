import React, { useState } from "react";

import { IonButton, IonContent, IonModal } from "@ionic/react";

type Props = {
    isOpen: boolean;
    onDidDismiss: () => void;
};

export const PurchaseModal: React.FC<Props> = props => {
    return (
        <IonContent>
            <IonModal isOpen={props.isOpen} onDidDismiss={props.onDidDismiss}>
                <p>This is modal content</p>
            </IonModal>
        </IonContent>
    );
};
