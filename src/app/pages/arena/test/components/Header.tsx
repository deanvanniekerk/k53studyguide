import React from "react";
import { connect } from "react-redux";

import { HorizontalRule } from "@/app/components";
import { RootState } from "@/state";
import { targetNavigationKeySelector } from "@/state/dojo/navigation";
import { totalQuestionsSelector } from "@/state/dojo/test";
import { IonCol, IonGrid, IonListHeader, IonRow, IonText } from "@ionic/react";

type Props = PropsFromState;

const HeaderComponent: React.FC<Props> = props => {
    return (
        <React.Fragment>
            <IonListHeader>
                <IonGrid>
                    <IonRow style={{ paddingTop: 55 }}>
                        <IonCol>
                            <IonText>
                                <h2>Arena</h2>
                            </IonText>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonListHeader>
            <HorizontalRule leftMargin={20} rightMargin={20} paddingBottom={0} paddingTop={10} />
        </React.Fragment>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        targetNavigationKey: targetNavigationKeySelector(state),
        totalQuestions: totalQuestionsSelector(state),
    };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
