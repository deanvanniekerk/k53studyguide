import { IonCol, IonContent, IonGrid, IonPage, IonRow } from "@ionic/react";
import type React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { BookOutlineIcon } from "@/app/components/icons";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import { watermarkStyle } from "@/app/styles";
import type { RootState } from "@/state";
import { rootNavigationChildrenSelector } from "@/state/navigation";
import { notificationsSelector, recieveRecieveNotificationState } from "@/state/notifications";
import { recieveCurrentNavigationKey } from "@/state/study/navigation";
import { Header, NavigationItem } from "./components";
import { StudyInfoModal } from "./StudyInfoModal";
import { StudyPageHeader } from "./StudyPageHeader";

type Props = PropsFromState & PropsFromDispatch;

const StudyPage: React.FC<Props> = (props) => {
  const history = useHistory();
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const { logEvent } = useAnalytics("StudyPage");

  useEffect(() => {
    if (!props.infoSeen) {
      showInfoModal();
    }
  }, [props.infoSeen]);

  const showInfoModal = () => {
    setInfoModalVisible(true);
    props.recieveRecieveNotificationState("studyInfo", { seen: true });
  };

  const onNavigationItemClicked = (key: string) => {
    logEvent("NAVIGATE", { key: key, component: "StudyPage" });
    props.recieveCurrentNavigationKey(key);
    history.push(`/content`);
  };

  return (
    <Page>
      <StudyInfoModal
        isOpen={infoModalVisible}
        onDidDismiss={() => {
          setInfoModalVisible(false);
        }}
      />
      <StudyPageHeader onInfoClicked={() => showInfoModal()} />
      <Watermark />
      <Content>
        <Header onNavigationItemClicked={onNavigationItemClicked} />
        <IonGrid style={{ padding: 10 }}>
          <IonRow>
            {props.navigationChildren.map((key, index) => {
              return (
                <IonCol key={key} sizeXs="12" sizeSm="4" sizeMd="4" sizeLg="3" style={{ overflow: "hidden" }}>
                  <NavigationItem navigationItemKey={key} onClick={onNavigationItemClicked} index={index} />
                </IonCol>
              );
            })}
          </IonRow>
        </IonGrid>
      </Content>
    </Page>
  );
};

const Watermark = styled(BookOutlineIcon)`
  ${watermarkStyle}
`;

const Content = styled(IonContent)`
  --background: transparent;
`;

const Page = styled(IonPage)`
  background: #FAFAF7;
  --page-header-bg: var(--study-header-gradient);
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
