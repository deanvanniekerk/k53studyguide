import { eye, eyeOff } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "src/state";
import { seenTotalsSelector } from "src/state/study/log";

import { CreateAnimation, IonIcon } from "@ionic/react";

type Props = {
    navigationKey: string;
} & PropsFromState;

const ContentSeenIndicatorComponent: React.FC<Props> = ({ navigationKey, seenTotals }) => {
    const total = seenTotals[navigationKey];
    const currentSeen = total ? total.seen === total.total : false;

    const [lastSeen, setLastSeen] = useState<boolean>(currentSeen);
    const [play, setPlay] = useState<boolean>(false);

    useEffect(() => {
        setLastSeen(currentSeen);
        // Only animate if going to unseen -> seen
        if (!lastSeen && currentSeen) {
            setPlay(true);
        }
    }, [currentSeen, lastSeen]);

    return (
        <CreateAnimation
            play={play}
            duration={500}
            easing="ease"
            keyframes={[
                { offset: 0, transform: "scale(1)" },
                { offset: 0.5, transform: "scale(1.5)" },
                { offset: 1, transform: "scale(1)" },
            ]}
        >
            <div>
                <IonIcon
                    icon={currentSeen ? eye : eyeOff}
                    style={{
                        fontSize: 16,
                        opacity: currentSeen ? 0.6 : 0.4,
                        marginRight: 5,
                    }}
                />
            </div>
        </CreateAnimation>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        seenTotals: seenTotalsSelector(state),
    };
};

const ContentSeenIndicator = connect(mapStateToProps)(ContentSeenIndicatorComponent);

export { ContentSeenIndicator };
