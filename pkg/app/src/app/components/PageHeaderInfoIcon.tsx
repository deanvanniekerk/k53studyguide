import { IonIcon } from "@ionic/react";
import { helpOutline } from "ionicons/icons";
import type React from "react";
import styled from "styled-components";

type Props = {
  onClick: () => void;
};

const PageHeaderInfoIcon: React.FC<Props> = (props) => {
  return (
    <InfoButton type="button" aria-label="Show information" onClick={props.onClick}>
      <HelpBadge>
        <IonIcon icon={helpOutline} aria-hidden="true" />
      </HelpBadge>
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
  color: #fff;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
    border-radius: 12px;
  }

  &:active span {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const HelpBadge = styled.span`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.16);

  ion-icon {
    font-size: 25px;
  }
`;

export { PageHeaderInfoIcon };
