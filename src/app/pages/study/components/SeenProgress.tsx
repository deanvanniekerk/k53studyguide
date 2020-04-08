import { eye } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { ProgressBar } from "@/app/components";
import { RootState } from "@/state";
import { seenTotalsSelector } from "@/state/study/log";

import { IonIcon, IonText } from "@ionic/react";

type Props = {
    navigationKey: string;
} & PropsFromState;

const SeenProgressComponent: React.FC<Props> = (props) => {
    const total = props.seenTotals[props.navigationKey];

    if (!total) return <React.Fragment />;

    const seenProgress = Math.floor((total.seen / total.total) * 100);

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ paddingTop: 2, width: 50 }}>
                <ProgressBar
                    height={8}
                    progress={seenProgress}
                    backgroundColor="#FFFFFF"
                    backgroundOpacity={0.2}
                    foregroundOpacity={0.6}
                />
            </div>
            <div style={{ paddingTop: 4, paddingLeft: 8 }}>
                <IonIcon
                    className="text-sm"
                    icon={eye}
                    style={{
                        opacity: 0.6,
                    }}
                />
            </div>
            <div style={{ paddingLeft: 8 }}>
                <IonText className="text-xs" style={{ opacity: 0.6 }}>
                    {total.seen}
                    {" / "}
                    {total.total}
                </IonText>
            </div>
        </div>
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
