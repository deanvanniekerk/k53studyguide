import { IonContent } from "@ionic/react";
import { getScrollActionTarget, ScrollFade } from "@k53studyguide/shared/react";
import { type ComponentPropsWithoutRef, forwardRef, useCallback, useState } from "react";

type Props = ComponentPropsWithoutRef<typeof IonContent> & { scrollHint?: boolean };

// The fixed slot keeps the fade at the viewport edge while the page scrolls.
export const PageContent = forwardRef<HTMLIonContentElement, Props>(function PageContent(
  { children, scrollHint = false, ...props },
  forwardedRef,
) {
  const [content, setContent] = useState<HTMLIonContentElement | null>(null);
  const attachContent = useCallback(
    (element: HTMLIonContentElement | null) => {
      setContent(element);
      if (typeof forwardedRef === "function") forwardedRef(element);
      else if (forwardedRef) forwardedRef.current = element;
    },
    [forwardedRef],
  );

  const getScrollElements = useCallback(async () => {
    const scrollElement = await content?.getScrollElement();
    const action = content?.querySelector<HTMLElement>("[data-scroll-action]");
    return scrollElement && action ? { scrollElement, action } : null;
  }, [content]);

  const revealAction = async () => {
    const elements = await getScrollElements();
    if (!elements) return;
    const { top, duration } = getScrollActionTarget(elements);
    await content?.scrollToPoint(undefined, top, duration);
  };

  return (
    <IonContent {...props} ref={attachContent}>
      {children}
      <ScrollFade
        slot="fixed"
        getScrollElements={scrollHint ? getScrollElements : undefined}
        onRevealAction={() => void revealAction()}
        observationKey={children}
      />
    </IonContent>
  );
});
