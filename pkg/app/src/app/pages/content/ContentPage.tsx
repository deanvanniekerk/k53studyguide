import type { ScrollDetail } from "@ionic/core/components";
import { IonContent, IonPage } from "@ionic/react";
import type React from "react";
import { useRef, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { PageHeader } from "@/app/components";
import { BookOutlineIcon } from "@/app/components/icons";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import { watermarkStyle } from "@/app/styles";
import type { RootState } from "@/state";
import {
  currentNavigationKeySelector,
  currentNavigationParentSelector,
  navigateUp,
  ROOT_NAVIGATION_KEY,
} from "@/state/study/navigation";
import { navigationKeyToBreadcrumb } from "@/utils";
import { ContentList, Header, Navigator } from "./components";

const ENABLE_CONTENT_HEADER_COLLAPSE = true;
const CONTENT_HEADER_COLLAPSE_SCROLL_TOP = 32;

const sectionAccentVars: Record<string, { color: string; rgb: string }> = {
  "nav.vehicleControls": { color: "var(--app-study-section-vehicle)", rgb: "var(--app-study-section-vehicle-rgb)" },
  "nav.rulesOfTheRoad": { color: "var(--app-study-section-rules)", rgb: "var(--app-study-section-rules-rgb)" },
  "nav.defensiveDriving": {
    color: "var(--app-study-section-defensive)",
    rgb: "var(--app-study-section-defensive-rgb)",
  },
  "nav.roadMarkings": { color: "var(--app-study-section-markings)", rgb: "var(--app-study-section-markings-rgb)" },
  "nav.roadSignals": { color: "var(--app-study-section-signals)", rgb: "var(--app-study-section-signals-rgb)" },
  "nav.signs": { color: "var(--app-study-section-signs)", rgb: "var(--app-study-section-signs-rgb)" },
};

type Props = PropsFromState & PropsFromDispatch;

const ContentPage: React.FC<Props> = (props) => {
  const history = useHistory();
  const content = useRef<HTMLIonContentElement>(null);
  const [headerCompact, setHeaderCompact] = useState(false);

  useAnalytics("ContentPage");

  const rootSectionKey = navigationKeyToBreadcrumb(props.currentNavigationKey)[1];
  const sectionTheme = sectionAccentVars[rootSectionKey];
  const sectionStyle = sectionTheme
    ? ({
        "--content-page-header-height":
          ENABLE_CONTENT_HEADER_COLLAPSE && headerCompact
            ? "var(--app-page-header-collapsed-height)"
            : "var(--app-page-header-height)",
        "--section-accent": sectionTheme.color,
        "--section-accent-rgb": sectionTheme.rgb,
      } as React.CSSProperties)
    : ({
        "--content-page-header-height":
          ENABLE_CONTENT_HEADER_COLLAPSE && headerCompact
            ? "var(--app-page-header-collapsed-height)"
            : "var(--app-page-header-height)",
      } as React.CSSProperties);

  const onContentScroll = (event: CustomEvent<ScrollDetail>) => {
    if (!ENABLE_CONTENT_HEADER_COLLAPSE) return;

    const nextHeaderCompact = event.detail.scrollTop > CONTENT_HEADER_COLLAPSE_SCROLL_TOP;
    setHeaderCompact((currentHeaderCompact) =>
      currentHeaderCompact === nextHeaderCompact ? currentHeaderCompact : nextHeaderCompact,
    );
  };

  const onBackClicked = () => {
    // if (content.current) {
    //     console.log("scrollHeight", content.current.scrollHeight);
    //     console.log("scrollTop", content.current.scrollTop);
    // }

    if (props.currentNavigationParent === ROOT_NAVIGATION_KEY) {
      history.replace("/study");
      return;
    }

    props.navigateUp();
  };

  return (
    <Page style={sectionStyle}>
      <PageHeader
        title="study"
        page="study"
        compact={ENABLE_CONTENT_HEADER_COLLAPSE && headerCompact}
        onBackClick={onBackClicked}
      />
      <Watermark />
      <Content ref={content} scrollEvents={ENABLE_CONTENT_HEADER_COLLAPSE} onIonScroll={onContentScroll}>
        <Header />
        <Navigator />
        <ContentList />
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
  background: var(--app-study-background);
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    currentNavigationParent: currentNavigationParentSelector(state),
    currentNavigationKey: currentNavigationKeySelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ navigateUp }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentPage);
