import { IonIcon } from "@ionic/react";
import { chevronDownOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import styled from "styled-components";

type ScrollElements = { scrollElement: HTMLElement; action: HTMLElement } | null;
type Props = {
  slot?: string;
  getScrollElements?: () => ScrollElements | Promise<ScrollElements>;
  onRevealAction?: () => void;
  observationKey?: string;
};

// Works with Ionic's fixed slot and the landing-page preview's ordinary scroll div.
export const ScrollFade = ({ slot, getScrollElements, onRevealAction, observationKey }: Props) => {
  const [actionBelow, setActionBelow] = useState(false);

  useEffect(() => {
    setActionBelow(false);
    if (!getScrollElements) return;
    let cancelled = false;
    let observer: IntersectionObserver | undefined;

    const observeAction = async () => {
      const elements = await getScrollElements();
      if (cancelled || !elements) return;
      const { scrollElement, action } = elements;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (cancelled) return;
          const viewportBottom = entry.rootBounds?.bottom ?? scrollElement.getBoundingClientRect().bottom;
          setActionBelow(entry.boundingClientRect.bottom > viewportBottom + 1);
        },
        { root: scrollElement, threshold: [0, 1] },
      );
      observer.observe(action);
    };

    void observeAction();
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [getScrollElements, observationKey]);

  return (
    <Fade slot={slot}>
      {actionBelow && (
        <Hint type="button" aria-label="Scroll down to the action button" onClick={onRevealAction}>
          <IonIcon icon={chevronDownOutline} aria-hidden="true" />
        </Hint>
      )}
    </Fade>
  );
};

const Fade = styled.div`
  position: absolute;
  inset: auto 0 0;
  height: var(--app-scroll-fade-height);
  z-index: 5;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, var(--app-card-background));
`;

const Hint = styled.button`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 6px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: var(--app-card-border);
  border-radius: 50%;
  background: var(--app-card-background);
  color: var(--app-progress-foreground);
  box-shadow: 0 3px 12px rgba(var(--app-text-primary-rgb), 0.12);
  cursor: pointer;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;

  ion-icon {
    font-size: 24px;
    animation: scroll-hint-nudge 2.4s ease-in-out infinite;
  }

  &:focus-visible {
    outline: 2px solid var(--app-progress-foreground);
    outline-offset: 2px;
  }

  @keyframes scroll-hint-nudge {
    0%, 60%, 100% { transform: translateY(-2px); }
    30% { transform: translateY(3px); }
  }

  @media (prefers-reduced-motion: reduce) {
    ion-icon { animation: none; }
  }
`;
