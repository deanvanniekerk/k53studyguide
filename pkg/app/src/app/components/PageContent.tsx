import { IonContent } from "@ionic/react";
import { ScrollFade } from "@k53studyguide/shared/react";
import { type ComponentPropsWithoutRef, forwardRef, useCallback, useRef } from "react";

type Props = ComponentPropsWithoutRef<typeof IonContent> & { scrollHint?: boolean };

// The fixed slot keeps the fade at the viewport edge while the page scrolls.
export const PageContent = forwardRef<HTMLIonContentElement, Props>(function PageContent(
  { children, scrollHint = false, ...props },
  forwardedRef,
) {
  const content = useRef<HTMLIonContentElement | null>(null);
  const getScrollElements = useCallback(async () => {
    const scrollElement = await content.current?.getScrollElement();
    const action = content.current?.querySelector<HTMLElement>("[data-scroll-action]");
    return scrollElement && action ? { scrollElement, action } : null;
  }, []);

  const revealAction = async () => {
    const scrollElement = await content.current?.getScrollElement();
    const action = content.current?.querySelector<HTMLElement>("[data-scroll-action]");
    if (!scrollElement || !action) return;
    const actionBottom = action.getBoundingClientRect().bottom;
    const viewportBottom = scrollElement.getBoundingClientRect().bottom;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    await content.current?.scrollToPoint(
      undefined,
      scrollElement.scrollTop + actionBottom - viewportBottom + 48,
      reduceMotion ? 0 : 300,
    );
  };

  return (
    <IonContent
      {...props}
      ref={(element) => {
        const nativeElement = element as HTMLIonContentElement | null;
        content.current = nativeElement;
        if (typeof forwardedRef === "function") forwardedRef(nativeElement);
        else if (forwardedRef) forwardedRef.current = nativeElement;
      }}
    >
      {children}
      <ScrollFade
        slot="fixed"
        getScrollElements={scrollHint ? getScrollElements : undefined}
        onRevealAction={() => void revealAction()}
      />
    </IonContent>
  );
});
