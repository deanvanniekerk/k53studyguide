import { IonGrid, IonListHeader, IonRow } from "@ionic/react";
import type React from "react";

const Header: React.FC = () => {
  return (
    <IonListHeader>
      <IonGrid>
        <IonRow className="app-page-content-offset"></IonRow>
      </IonGrid>
    </IonListHeader>
  );
};

export { Header };
