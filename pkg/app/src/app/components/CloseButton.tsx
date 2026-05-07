import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import type React from "react";
import styled from "styled-components";

type Props = {
  onClick: () => void;
};

const CloseButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Button type="button" aria-label="Close" onClick={onClick}>
      <IonIcon icon={closeOutline} />
    </Button>
  );
};

const Button = styled.button`
  position: absolute;
  z-index: 102;
  top: calc(var(--app-safe-area-top) + 8px);
  left: 8px;
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
    font-size: var(--app-font-size-xxxl);
  }
`;

export { CloseButton };
