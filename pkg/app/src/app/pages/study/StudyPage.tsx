import { IonPage } from "@ionic/react";
import { Translate } from "@k53studyguide/shared/translation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { PageContent, PageHeader, PageHeaderInfoIcon } from "@/app/components";
import { BookOutlineIcon } from "@/app/components/icons";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import { useStudyDisplayMode } from "@/app/hooks/useStudyDisplayMode";
import { watermarkStyle } from "@/app/styles";
import type { RootState } from "@/state";
import { rootNavigationChildrenSelector } from "@/state/navigation";
import { notificationsSelector, recieveRecieveNotificationState } from "@/state/notifications";
import { recieveCurrentNavigationKey } from "@/state/study/navigation";
import { Header, NavigationItem } from "./components";
import { StudyInfoModal } from "./StudyInfoModal";

type Props = PropsFromState & PropsFromDispatch;

const StudyPage: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [content, setContent] = useState<HTMLIonContentElement | null>(null);
  const layout = useRef<HTMLDivElement>(null);
  useStudyDisplayMode(content, layout);

  const { analytics, logEvent } = useAnalytics("StudyPage");

  useEffect(() => {
    if (!props.infoSeen) {
      showInfoModal();
    }
  }, [props.infoSeen]);

  const showInfoModal = () => {
    analytics.trackOnboardingInfoView({ screen_name: "StudyPage" });
    setInfoModalVisible(true);
    props.recieveRecieveNotificationState("studyInfo", { seen: true });
  };

  const onNavigationItemClicked = (key: string) => {
    logEvent("NAVIGATE", { key: key, component: "StudyPage" });
    props.recieveCurrentNavigationKey(key);
    navigate(`/content`);
  };

  return (
    <Page>
      <StudyInfoModal
        isOpen={infoModalVisible}
        onDidDismiss={() => {
          setInfoModalVisible(false);
        }}
      />
      <PageHeader title="study" page="study" rightSection={<PageHeaderInfoIcon onClick={() => showInfoModal()} />} />
      <Watermark />
      <Content ref={setContent}>
        <div ref={layout}>
          <Header onNavigationItemClicked={onNavigationItemClicked} />
          <TopicList>
            <TopicHeading>
              <Translate text="allTopics" />
            </TopicHeading>
            {props.navigationChildren.map((key, index) => {
              return (
                <NavigationItem key={key} navigationItemKey={key} onClick={onNavigationItemClicked} index={index} />
              );
            })}
          </TopicList>
        </div>
      </Content>
    </Page>
  );
};

const Watermark = styled(BookOutlineIcon)`
  ${watermarkStyle}
`;

const Content = styled(PageContent)`
  --background: transparent;
`;

const TopicList = styled.div`
  padding: 0 var(--app-padding) var(--app-section-gap);
`;

const TopicHeading = styled.h2`
  color: var(--app-text-muted);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-section-title);
  letter-spacing: 0;
  margin: 0 0 var(--app-stack-gap);
  text-transform: uppercase;
`;

const Page = styled(IonPage)`
  background: var(--app-study-background);
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    navigationChildren: rootNavigationChildrenSelector(state),
    infoSeen: notificationsSelector(state).studyInfo.seen,
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveCurrentNavigationKey, recieveRecieveNotificationState }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudyPage);
