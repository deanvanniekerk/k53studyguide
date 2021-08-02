import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Translate, Translator } from "react-translated";
import { help } from "ionicons/icons";

import { HorizontalRule } from "@/app/components";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { RootState } from "@/state";
import { currentNavigationKeySelector } from "@/state/study/navigation";
import {
    IonAlert,
    IonButton,
    IonCol,
    IonGrid,
    IonIcon,
    IonListHeader,
    IonRow,
    IonText,
} from "@ionic/react";

import { SeenProgress } from "./SeenProgress";
import { loadQuestionAnswers } from "@/state/dojo/test";
import { recieveTargetNavigationKey } from "@/state/dojo/navigation";
import { useHistory } from "react-router";
import { recieveLastSeenParentContentKey } from "@/state/study/log";

type Props = PropsFromState;

const HeaderComponent: React.FC<Props> = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [showStartQuizAlert, setShowStartQuizAlert] = useState(false);

    return (
        <>
            <IonListHeader>
                <IonGrid>
                    <IonRow style={{ paddingTop: 55 }}>
                        <IonCol>
                            <IonText>
                                <h2>
                                    <Translate text={props.currentNavigationKey} />
                                </h2>
                            </IonText>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <Breadcrumb navigationKey={props.currentNavigationKey} />
                        </IonCol>
                    </IonRow>
                    <IonRow style={{ paddingTop: 20 }}>
                        <IonCol size="10">
                            <SeenProgress navigationKey={props.currentNavigationKey} />
                        </IonCol>
                        <IonCol>
                            <IonButton
                                color="secondary"
                                shape="round"
                                fill="solid"
                                size="small"
                                onClick={() => setShowStartQuizAlert(true)}
                            >
                                <IonIcon icon={help} />
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

            <Translator>
                {({ translate }) => (
                    <IonAlert
                        isOpen={showStartQuizAlert}
                        onDidDismiss={() => setShowStartQuizAlert(false)}
                        message={`Start a new Quiz on '${translate({
                            text: props.currentNavigationKey,
                        })}' content?`}
                        buttons={[
                            {
                                text: "Cancel",
                                handler: () => {
                                    setShowStartQuizAlert(false);
                                },
                            },
                            {
                                text: "Yes",
                                handler: () => {
                                    // so that we can continue
                                    dispatch(
                                        recieveLastSeenParentContentKey(props.currentNavigationKey)
                                    );
                                    dispatch(
                                        recieveTargetNavigationKey(props.currentNavigationKey)
                                    );
                                    dispatch(loadQuestionAnswers());
                                    history.push(`/test-dojo`);
                                },
                            },
                        ]}
                    />
                )}
            </Translator>
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        currentNavigationKey: currentNavigationKeySelector(state),
    };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
