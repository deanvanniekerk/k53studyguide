import { IonText } from "@ionic/react";
import type React from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import VisibilitySensor from "react-visibility-sensor";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import type { ContentItem } from "@/data";
import { recieveSeenContentKey } from "@/state/study/log";
import "./Content.css";
import { ContentSeenIndicator } from "./ContentSeenIndicator";

type Props = {
  item: ContentItem;
  navigationKey: string;
} & PropsFromDispatch;

const ContentComponent: React.FC<Props> = ({ item, navigationKey, recieveSeenContentKey }) => {
  const visibilityChange = (visible: boolean) => {
    if (visible) recieveSeenContentKey(navigationKey);
  };

  return (
    <VisibilitySensor partialVisibility={true} onChange={visibilityChange} delayedCall={true}>
      <Card className="study-content">
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
    </VisibilitySensor>
  );
};

const Card = styled.article`
  background: var(--app-card-background);
  border: 2px solid var(--app-card-border-color);
  border-radius: 28px;
  box-shadow: 0 6px 0 var(--app-card-border-color);
  box-sizing: border-box;
  padding: 24px 20px 26px;
`;

const CardHeader = styled.div`
  align-items: center;
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(0, 1fr) auto;
  margin-bottom: 20px;
`;

const Heading = styled(IonText)`
  color: var(--app-text-primary);
  display: block;
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-xl);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.12;
`;

const ImageFrame = styled.div`
  align-items: center;
  border: 2px dashed rgba(var(--app-progress-track-rgb), 0.25);
  border-radius: 24px;
  display: flex;
  justify-content: center;
  margin: 0 0 24px;
  min-height: 190px;
  padding: 10px;

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
