import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";

import { HorizontalRule } from "@/app/components";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { RootState } from "@/state";
import { targetNavigationKeySelector } from "@/state/dojo/navigation";
import { ROOT_NAVIGATION_KEY } from "@/state/navigation";
import { IonButton, IonCol, IonGrid, IonListHeader, IonRow, IonText } from "@ionic/react";

type Props = {
    selectTargetNavigationItem: () => void;
} & PropsFromState;

const HeaderComponent: React.FC<Props> = props => {
    return (
        <>
            <IonListHeader>
                <IonGrid>
                    <IonRow style={{ paddingTop: 55 }}>
                        <IonCol>
                            <IonText>
                                <h2>
                                    <Translate
                                        text={
                                            props.targetNavigationKey === ROOT_NAVIGATION_KEY
                                                ? "allContent"
                                                : props.targetNavigationKey
                                        }
                                    />
                                </h2>
                            </IonText>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <Breadcrumb
                                navigationKey={props.targetNavigationKey || ""}
                                rootText="allContent"
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow style={{ paddingTop: 18 }}>
                        <IonCol>
                            <IonButton
                                color="secondary"
                                shape="round"
                                fill="solid"
                                onClick={props.selectTargetNavigationItem}
                            >
                                <Translate text="select" />
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <HorizontalRule
                                leftMargin={20}
                                rightMargin={36}
                                paddingBottom={0}
                                paddingTop={20}
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonListHeader>
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        targetNavigationKey: targetNavigationKeySelector(state),
    };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
