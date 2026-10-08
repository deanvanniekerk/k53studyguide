import { IonText } from "@ionic/react";
import { Translate, Translator } from "@k53studyguide/shared/translation";
import type React from "react";
import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import type { ContentItem } from "@/data";
import { recieveSeenContentKey } from "@/state/study/log";
import { navigationKeyToBreadcrumb } from "@/utils";
import "./Content.css";
import { ContentSeenIndicator } from "./ContentSeenIndicator";

type Props = {
  item: ContentItem;
  navigationKey: string;
} & PropsFromDispatch;

const ContentComponent: React.FC<Props> = ({ item, navigationKey, recieveSeenContentKey }) => {
  const { analytics } = useAnalytics();
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    let trackedVisible = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      recieveSeenContentKey(navigationKey);
      if (trackedVisible) return;
      trackedVisible = true;
      analytics.trackStudyContentView({
        content_key: navigationKey,
        content_category: navigationKeyToBreadcrumb(navigationKey)[1] ?? navigationKey,
      });
    });
    observer.observe(card);
    return () => observer.disconnect();
  }, [analytics, navigationKey, recieveSeenContentKey]);

  return (
    <Card ref={cardRef} className="study-content">
      <CardHeader>
        <Heading>
          <Translate text={item.heading} />
        </Heading>
        <ContentSeenIndicator navigationKey={navigationKey} />
      </CardHeader>
      {item.imageName && (
        <ImageFrame>
          <img src={`assets/images/${item.imageName}`} alt="" />
        </ImageFrame>
      )}
      <Description className="content-html">
        <Translator>
          {({ translate }) => (
            <div
              dangerouslySetInnerHTML={{
                __html: translate({ text: item.description }),
              }}
            ></div>
          )}
        </Translator>
      </Description>
    </Card>
  );
};

const Card = styled.article`
  background: var(--app-card-background);
  border: 2px solid var(--app-card-border-color);
  border-radius: 28px;
  box-shadow: 0 6px 0 var(--app-card-border-color);
  box-sizing: border-box;
  padding: var(--app-card-padding);
`;

const CardHeader = styled.div`
  align-items: center;
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(0, 1fr) auto;
  margin-bottom: var(--app-stack-gap);
`;

const Heading = styled(IonText)`
  color: var(--app-text-primary);
  display: block;
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-card-title);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.12;
`;

const ImageFrame = styled.div`
  align-items: center;
  background: var(--app-study-background);
  border: 2px dashed rgba(var(--app-progress-track-rgb), 0.25);
  border-radius: 24px;
  display: flex;
  justify-content: center;
  margin: 0 0 var(--app-stack-gap);
  min-height: 190px;
  padding: var(--app-element-gap);

  img {
    display: block;
    max-height: 210px;
    max-width: 100%;
    object-fit: contain;
  }
`;

const Description = styled(IonText)`
  color: var(--app-text-primary);
  display: block;
  font-size: var(--app-font-size-l);
  line-height: 1.65;

  p {
    margin: 0;
  }

  @media (max-width: 420px) {
    font-size: var(--app-font-size-md);
  }
`;

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveSeenContentKey }, dispatch),
  };
};

const Content = connect(null, mapDispatchToProps)(ContentComponent);

export { Content };
