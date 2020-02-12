import React, { useEffect, useState } from "react";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { seenTotalsSelector } from "@/state/study/log";
import { Icon } from "@/ui/components";

type Props = {
    navigationKey: string;
} & PropsFromState;

type AnimateData = {
    animation: string | undefined;
    duration: number | undefined;
};

const ContentSeenIndicatorComponent: React.FC<Props> = ({ navigationKey, seenTotals }) => {
    const total = seenTotals[navigationKey];
    const currentSeen = total ? total.seen === total.total : false;

    const [lastSeen, setLastSeen] = useState<boolean>(currentSeen);
    const [animateData, setAnimateData] = useState<AnimateData>({
        animation: undefined,
        duration: undefined,
    });

    useEffect(() => {
        setLastSeen(currentSeen);
        // Only animate if going to unseen -> seen
        if (!lastSeen && currentSeen) {
            setAnimateData({
                animation: "flash",
                duration: 1000,
            });
        }
    }, [currentSeen]);

    return (
        <Animatable.View animation={animateData.animation} duration={animateData.duration}>
            <Icon
                type="material"
                name={currentSeen ? "visibility" : "visibility-off"}
                size={20}
                opacity={currentSeen ? 0.5 : 0.2}
            />
        </Animatable.View>
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
