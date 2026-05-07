import { IonList } from "@ionic/react";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import type { RootState } from "@/state";
import { targetNavigationChildrenSelector } from "@/state/dojo/navigation";
import { NavigationItem } from "../components";

type Props = {
  onNavigationItemClicked: (key: string) => void;
} & PropsFromState;

const NavigatorComponent: React.FC<Props> = (props) => {
  if (!props.navigationChildren) return <React.Fragment />;

  return (
    <List>
      {props.navigationChildren.map((key, index) => {
        return (
          <NavigationItem key={key} navigationItemKey={key} onClick={props.onNavigationItemClicked} index={index} />
        );
      })}
    </List>
  );
};

const List = styled(IonList)`
  background: transparent;
  padding: 0 var(--app-padding) 28px;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    navigationChildren: targetNavigationChildrenSelector(state),
  };
};

const Navigator = connect(mapStateToProps)(NavigatorComponent);

export { Navigator };
