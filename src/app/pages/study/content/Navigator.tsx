import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { RootState } from "src/state";
import {
    currentNavigationItemsSelector,
    recieveCurrentNavigationKey,
} from "src/state/study/navigation";

import { IonList } from "@ionic/react";

import { NavigationItem } from "../components";

type Props = PropsFromState & PropsFromDispatch;

const NavigatorComponent: React.FC<Props> = props => {
    const onNavigationItemClicked = (key: string) => {
        props.recieveCurrentNavigationKey(key);
    };

    if (!props.navigationItems) return <React.Fragment />;

    return (
        <IonList>
            {props.navigationItems.map((key, index) => {
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
        navigationItems: currentNavigationItemsSelector(state),
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
