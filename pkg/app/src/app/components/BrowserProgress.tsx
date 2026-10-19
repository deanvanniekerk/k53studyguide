import { Translate } from "@k53studyguide/shared/translation";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";
import styled from "styled-components";
import { accessModelSelector } from "@/state/access";
import type { NotifictionActions } from "@/state/notifications";
import { notificationsSelector, recieveRecieveNotificationState } from "@/state/notifications";

export function BrowserProgress({ firstVisit = false }: { firstVisit?: boolean }) {
  const isWeb = useSelector(accessModelSelector) === "free_web";
  const seen = useSelector(notificationsSelector).webProgress?.seen;
  const dispatch = useDispatch<Dispatch<NotifictionActions>>();
  if (!isWeb || (firstVisit && seen)) return null;
  return (
    <Notice>
      <h2>
        <Translate text="webProgressTitle" />
      </h2>
      <p>
        <Translate text="webProgressBody" />
      </p>
      {firstVisit && (
        <button type="button" onClick={() => dispatch(recieveRecieveNotificationState("webProgress", { seen: true }))}>
          <Translate text="webProgressDismiss" />
        </button>
      )}
    </Notice>
  );
}
const Notice = styled.section`
  margin: var(--app-stack-gap) var(--app-padding);
  padding: var(--app-card-padding);
  border: var(--app-card-border);
  border-radius: 20px;
  background: var(--app-card-background);
  color: var(--app-text-primary);
  line-height: 1.5;
  h2 { font-size: var(--app-font-size-card-title); margin: 0 0 8px; }
  p { margin: 0; }
  button { margin-top: 12px; min-height: 44px; padding: 8px 16px; border-radius: 12px; cursor: pointer; }
`;
