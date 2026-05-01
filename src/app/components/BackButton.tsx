import { IonFab, IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import type React from "react";
import "./BackButton.css";

type Props = {
  onClick: () => void;
  icon?: string;
};

const BackButton: React.FC<Props> = (props) => {
  return (
    <IonFab className="app-back-button" vertical="top" horizontal="start" slot="fixed" onClick={props.onClick}>
      <IonIcon className="back-button" icon={props.icon || arrowBackOutline} />
    </IonFab>
  );
};

export { BackButton };
