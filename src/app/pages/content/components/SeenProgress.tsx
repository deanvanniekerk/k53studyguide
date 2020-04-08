import { eye } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { ProgressBar } from "@/app/components";
import { RootState } from "@/state";
import { seenTotalsSelector } from "@/state/study/log";

import { IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";

type Props = {
    navigationKey: string;
} & PropsFromState;

const SeenProgressComponent: React.FC<Props> = (props) => {
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
                        className="text-sm"
                        icon={eye}
                        style={{
                            marginLeft: 5,
                            opacity: seenProgress === 100 ? 1 : 0.6,
                        }}
                    />
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonText className="text-xs" style={{ opacity: 0.9, marginTop: 5 }}>
                        {total.seen}
                        {" / "}
                        {total.total} Seen
                    </IonText>
                </IonCol>
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
