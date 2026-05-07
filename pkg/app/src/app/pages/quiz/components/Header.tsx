import { IonCol, IonGrid, IonRow } from "@ionic/react";
import type React from "react";
import { Level } from "./";

const Header: React.FC = () => {
  return (
    <IonGrid>
      <IonRow className="app-page-content-offset">
        <IonCol>
          <Level />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export { Header };
