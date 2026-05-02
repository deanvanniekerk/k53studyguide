import { IonIcon } from "@ionic/react";
import { informationCircleOutline } from "ionicons/icons";
import type React from "react";
import styled from "styled-components";

type Props = {
  onClick: () => void;
};

const PageHeaderInfoIcon: React.FC<Props> = (props) => {
  return (
    <InfoButton type="button" aria-label="Show information" onClick={props.onClick}>
      <IonIcon icon={informationCircleOutline} />
    </InfoButton>
  );
};

const InfoButton = styled.button`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ion-color-light);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  ion-icon {
    font-size: 28px;
  }

  opacity: 0.8;
`;

export { PageHeaderInfoIcon };
