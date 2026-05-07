import { IonList } from "@ionic/react";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import type { RootState } from "@/state";
import { currentNavigationChildrenSelector, recieveCurrentNavigationKey } from "@/state/study/navigation";
import { NavigationItem } from "../components";

type Props = PropsFromState & PropsFromDispatch;

const NavigatorComponent: React.FC<Props> = (props) => {
  const { logEvent } = useAnalytics();

  const onNavigationItemClicked = (key: string) => {
    logEvent("NAVIGATE", { key: key, component: "ContentPage:NavigatorComponent" });
    props.recieveCurrentNavigationKey(key);
  };

  if (!props.navigationChildren || props.navigationChildren.length === 0) return <React.Fragment />;

  return (
    <NavigatorList>
      {props.navigationChildren.map((key, index) => {
        return <NavigationItem key={key} navigationItemKey={key} onClick={onNavigationItemClicked} index={index} />;
      })}
    </NavigatorList>
  );
};

const NavigatorList = styled(IonList)`
  background: transparent;
  display: grid;
  gap: 18px;
  padding: 4px var(--app-padding) 26px;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    navigationChildren: currentNavigationChildrenSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveCurrentNavigationKey }, dispatch),
  };
};

const Navigator = connect(mapStateToProps, mapDispatchToProps)(NavigatorComponent);

export { Navigator };
