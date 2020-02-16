import "./StudyPage.css";

import React from "react";
import { connect } from "react-redux";
import { RootState } from "src/state";
import { navigationIconsSelector, rootNavigationItemsSelector } from "src/state/study/navigation";

import { IonContent, IonList, IonPage } from "@ionic/react";

import { NavigationItem } from "./components";

type Props = PropsFromState;

const StudyPage: React.FC<Props> = props => {
    return (
        <IonPage>
            <IonContent>
                <IonList>
                    {props.navigationItems.map((key, index) => {
                        return (
                            <NavigationItem
                                navigationItemKey={key}
                                onClick={() => {}}
                                index={index}
                            />
                        );
                    })}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        navigationItems: rootNavigationItemsSelector(state),
        navigationIcons: navigationIconsSelector(state),
    };
};

export default connect(mapStateToProps)(StudyPage);
