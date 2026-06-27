import { IonButton, IonIcon } from "@ionic/react";
import type React from "react";
import { Translate } from "react-translated";
import styled from "styled-components";
import type { PageSection } from "./PageHeader";

type Props = Omit<React.ComponentPropsWithoutRef<typeof IonButton>, "children" | "fill" | "shape"> & {
  section: PageSection;
  text: string;
  rightIcon?: string;
};

const PrimaryButton: React.FC<Props> = ({ section, text, rightIcon, disabled, ...buttonProps }) => {
  return (
    <Button {...buttonProps} {...(disabled ? { disabled: true } : {})} $section={section} shape="round" fill="solid">
      <Translate text={text} />
      {rightIcon && <IonIcon slot="end" icon={rightIcon} />}
    </Button>
  );
};

const Button = styled(IonButton)<{ $section: PageSection }>`
  width: 100%;
  height: 56px;
  margin: 0;
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 900;
  letter-spacing: 0;
  --background: ${(props) => `var(--app-${props.$section}-action-background)`};
  --background-hover: ${(props) => `var(--app-${props.$section}-action-background)`};
  --background-activated: ${(props) => `var(--app-${props.$section}-action-background)`};
  --border-radius: 20px;
  --box-shadow: ${(props) => `var(--app-${props.$section}-action-shadow)`};

  ion-icon {
    font-size: var(--app-font-size-xl);
  }
`;

export { PrimaryButton };
