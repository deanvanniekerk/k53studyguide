import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import {
    recieveTargetNavigationKey,
    targetNavigationChildrenSelector,
} from "@/state/dojo/navigation";
import { IonList } from "@ionic/react";

import { NavigationItem } from "../components";

type Props = PropsFromState & PropsFromDispatch;

const NavigatorComponent: React.FC<Props> = props => {
    const onNavigationItemClicked = (key: string) => {
        props.recieveTargetNavigationKey(key);
    };

    if (!props.navigationChildren) return <React.Fragment />;

    return (
        <IonList>
            {props.navigationChildren.map((key, index) => {
                return (
                    <NavigationItem
                        key={key}
                        navigationItemKey={key}
                        onClick={onNavigationItemClicked}
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

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveTargetNavigationKey }, dispatch),
    };
};

const Navigator = connect(mapStateToProps, mapDispatchToProps)(NavigatorComponent);

export { Navigator };
