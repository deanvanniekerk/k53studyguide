import { IonIcon } from "@ionic/react";
import type React from "react";
import styled from "styled-components";

type Props = {
  name: string;
  value: React.ReactNode;
  icon?: string;
  status?: "complete" | "incomplete";
  onClick?: () => void;
  action?: boolean;
};

const Row: React.FC<Props> = (props) => {
  const containerProps = props.onClick ? { type: "button" as const, onClick: props.onClick } : {};

  return (
    <Container as={props.onClick ? "button" : "div"} {...containerProps} $clickable={Boolean(props.onClick)}>
      <NameCol>
        {props.icon && <StatusIcon icon={props.icon} $status={props.status} aria-hidden="true" />}
        <Name>{props.name}</Name>
      </NameCol>
      <ValueCol $action={props.action}>{props.value}</ValueCol>
    </Container>
  );
};

const Section = styled.section`
  padding: 0 var(--app-padding);
  margin-top: 32px;

  &:first-child {
    margin-top: var(--app-page-content-top);
  }
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  color: var(--app-profile-section-title);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.1;
  text-transform: uppercase;

  ion-icon {
    font-size: var(--app-font-size-l);
  }
`;

const GroupCard = styled.div`
  overflow: hidden;
  border: var(--app-profile-card-border);
  border-radius: 24px;
  background: var(--app-profile-card-background);
  box-shadow: var(--app-profile-card-shadow);
`;

const Container = styled.button<{ $clickable: boolean }>`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 76px;
  padding: 16px 22px;
  border: 0;
  border-bottom: 1px solid var(--app-profile-card-divider);
  background: transparent;
  color: var(--app-text-primary);
  text-align: left;
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};
  -webkit-tap-highlight-color: transparent;

  &:last-child {
    border-bottom: 0;
  }
`;

const NameCol = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 14px;
`;

const Name = styled.div`
  min-width: 0;
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-md);
  font-weight: 700;
  line-height: 1.2;
`;

const StatusIcon = styled(IonIcon)<{ $status?: Props["status"] }>`
  flex: 0 0 auto;
  color: ${(props) =>
    props.$status === "complete" ? "var(--app-profile-status-complete)" : "var(--app-profile-status-incomplete)"};
  font-size: var(--app-font-size-xxl);
`;

const ValueCol = styled.div<{ $action?: boolean }>`
  min-width: 0;
  color: ${(props) => (props.$action ? "var(--app-profile-action-icon)" : "var(--app-text-muted)")};
  font-family: var(--ion-font-family-bold);
  font-size: ${(props) => (props.$action ? "var(--app-font-size-xl)" : "var(--app-font-size-md)")};
  font-weight: 700;
  line-height: 1;
  text-align: right;
  overflow-wrap: anywhere;

  ion-icon {
    display: block;
  }
`;

export { GroupCard, Row, Section, SectionTitle };
