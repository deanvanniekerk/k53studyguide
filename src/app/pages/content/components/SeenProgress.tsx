import { eye } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { ProgressBar } from "src/app/components";
import { RootState } from "src/state";
import { seenTotalsSelector } from "src/state/study/log";

import { IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";

type Props = {
    navigationKey: string;
} & PropsFromState;

const SeenProgressComponent: React.FC<Props> = props => {
    const total = props.seenTotals[props.navigationKey];

    if (!total) return <React.Fragment />;

    const seenProgress = Math.floor((total.seen / total.total) * 100);

    return (
        <IonGrid>
            <IonRow class="ion-align-items-center">
                <IonCol size="2">
                    <ProgressBar height={8} progress={seenProgress} />
                </IonCol>
                <IonCol>
                    <IonIcon
                        icon={eye}
                        style={{
                            fontSize: 12,
                            marginLeft: 5,
                            opacity: seenProgress === 100 ? 1 : 0.6,
                        }}
                    />
                </IonCol>
            </IonRow>
            <IonRow>
                <IonText style={{ opacity: 0.9, fontSize: 12, marginTop: 5 }}>
                    {total.seen}
                    {" / "}
                    {total.total} Seen
                </IonText>
            </IonRow>
        </IonGrid>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        seenTotals: seenTotalsSelector(state),
    };
};

const SeenProgress = connect(mapStateToProps)(SeenProgressComponent);

export { SeenProgress };
