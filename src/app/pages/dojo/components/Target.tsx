import { caretForward } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";

import { Breadcrumb } from "@/app/components";
import { RootState } from "@/state";
import { targetNavigationKeySelector } from "@/state/dojo/navigation";
import { ROOT_NAVIGATION_KEY } from "@/state/navigation";
import { IonButton, IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";

type Props = {
    onStartTestClicked: () => void;
} & PropsFromState;

const TargetComponent: React.FC<Props> = (props) => {
    return (
        <Grid>
            <IonRow style={{ paddingTop: 15 }}>
                <IonCol>
                    <IonText>
                        <h2 style={{ fontWeight: "bold", marginBottom: 0 }}>
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
            <IonRow style={{ paddingBottom: 5, paddingTop: 8 }}>
                <IonCol>
                    <Breadcrumb navigationKey={props.targetNavigationKey} rootText="allContent" />
                </IonCol>
            </IonRow>
            <IonRow style={{ paddingTop: 40, paddingBottom: 20 }}>
                <IonCol style={{ textAlign: "center" }}>
                    <IonButton
                        color="secondary"
                        shape="round"
                        fill="solid"
                        className="button-med-large"
                        onClick={() => props.onStartTestClicked()}
                    >
                        <Translate text="continue" />
                        <IonIcon slot="end" icon={caretForward} />
                    </IonButton>
                </IonCol>
            </IonRow>
        </Grid>
    );
};

const Grid = styled(IonGrid)`
    padding: 0 16px;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        targetNavigationKey: targetNavigationKeySelector(state),
    };
};

const Target = connect(mapStateToProps)(TargetComponent);

export { Target };
