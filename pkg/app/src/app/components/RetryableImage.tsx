import { Translate } from "@k53studyguide/shared/translation";
import { type ImgHTMLAttributes, useEffect, useRef, useState } from "react";
import { useWebRuntime } from "../WebRuntimeProvider";

/** Keep image failures local to the image; retry never reloads learner state. */
export function RetryableImage({ src, alt = "", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const { connected, isWeb } = useWebRuntime();
  const previousConnection = useRef(connected);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    setFailed(false);
    setAttempt(0);
  }, [src]);
  const retry = () => {
    setFailed(false);
    setAttempt((value) => value + 1);
  };
  useEffect(() => {
    if (!previousConnection.current && connected && failed) retry();
    previousConnection.current = connected;
  }, [connected, failed]);
  if (!isWeb) return <img {...props} alt={alt} src={src} />;
  const retrySrc = attempt && typeof src === "string" ? `${src}${src.includes("?") ? "&" : "?"}retry=${attempt}` : src;
  return (
    <>
      <img {...props} alt={alt} key={retrySrc} src={retrySrc} hidden={failed} onError={() => setFailed(true)} />
      {failed && (
        <div role="status">
          <Translate text="webImageFailed" />{" "}
          <button type="button" onClick={retry}>
            <Translate text="webImageRetry" />
          </button>
        </div>
      )}
    </>
  );
}
