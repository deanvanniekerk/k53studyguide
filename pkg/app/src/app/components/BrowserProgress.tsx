import { Translate } from "@k53studyguide/shared/translation";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { accessModelSelector } from "@/state/access";

export function BrowserProgress() {
  const isWeb = useSelector(accessModelSelector) === "free_web";
  if (!isWeb) return null;
  return (
    <Notice>
      <h2>
        <Translate text="webProgressTitle" />
      </h2>
      <p>
        <Translate text="webProgressBody" />
      </p>
    </Notice>
  );
}
const Notice = styled.section`
  margin: var(--app-page-content-top) var(--app-padding) var(--app-stack-gap);
  padding: var(--app-card-padding);
  border: var(--app-card-border);
  border-radius: 20px;
  background: var(--app-card-background);
  color: var(--app-text-primary);
  line-height: 1.5;
  h2 { font-size: var(--app-font-size-card-title); margin: 0 0 8px; }
  p { margin: 0; }
`;
