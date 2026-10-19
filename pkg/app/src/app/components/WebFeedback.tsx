import { Translate } from "@k53studyguide/shared/translation";
import styled from "styled-components";
import { useWebRuntime } from "../WebRuntimeProvider";

export function WebFeedback() {
  const { connected, isWeb, storageUnavailable, chunkFailed } = useWebRuntime();
  if (!isWeb) return null;
  return (
    <>
      {chunkFailed && (
        <Notice role="alert">
          <Translate text="webChunkFailed" />{" "}
          <button type="button" onClick={() => window.location.reload()}>
            <Translate text="webReload" />
          </button>
        </Notice>
      )}
      {storageUnavailable && (
        <Notice role="alert">
          <Translate text="webStorageUnavailable" />
        </Notice>
      )}
      {!connected && (
        <Notice role="status">
          <Translate text="webOffline" />
        </Notice>
      )}
    </>
  );
}
const Notice = styled.div`
  margin: var(--app-stack-gap) var(--app-padding);
  padding: var(--app-card-padding);
  border: var(--app-card-border);
  border-radius: 16px;
  background: var(--app-card-background);
  color: var(--app-text-primary);
  line-height: 1.5;
`;
