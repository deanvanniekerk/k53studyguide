import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { targetNavigationChildrenSelector } from "@/state/dojo/navigation";
import { IonList } from "@ionic/react";

import { NavigationItem } from "../components";

type Props = {
    onNavigationItemClicked: (key: string) => void;
} & PropsFromState;

const NavigatorComponent: React.FC<Props> = (props) => {
    if (!props.navigationChildren) return <React.Fragment />;

    return (
        <IonList>
            {props.navigationChildren.map((key, index) => {
                return (
                    <NavigationItem
                        key={key}
                        navigationItemKey={key}
                        onClick={props.onNavigationItemClicked}
                        index={index}
                    />
                );
            })}
        </IonList>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        navigationChildren: targetNavigationChildrenSelector(state),
    };
};

const Navigator = connect(mapStateToProps)(NavigatorComponent);

export { Navigator };
