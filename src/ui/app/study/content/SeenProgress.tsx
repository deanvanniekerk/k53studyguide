import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { seenTotalsSelector } from "@/state/study/log";
import { Icon, ProgressBar, Text } from "@/ui/components";

type Props = {
    navigationKey: string;
} & PropsFromState;

const SeenProgressComponent: React.FC<Props> = props => {
    const total = props.seenTotals[props.navigationKey];

    if (!total) return <React.Fragment />;

    const seenProgress = Math.floor((total.seen / total.total) * 100);

    return (
        <View
            style={{
                flexDirection: "column",
                paddingTop: 20,
                width: 70,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "stretch",
                }}
            >
                <View style={{ flex: 1, marginRight: 5 }}>
                    <ProgressBar
                        foregroundOpacity={0.9}
                        backgroundColor="#000000"
                        backgroundOpacity={0.2}
                        height={8}
                        progress={seenProgress}
                    />
                </View>
                <View>
                    <Icon
                        type="material"
                        name={seenProgress === 100 ? "visibility" : "visibility-off"}
                        size={12}
                        opacity={seenProgress === 100 ? 1 : 0.6}
                    />
                </View>
            </View>
            <View>
                <Text style={{ opacity: 0.9, fontSize: 13, marginTop: 5 }}>
                    {total.seen}
                    {" / "}
                    {total.total} Seen
                </Text>
            </View>
        </View>
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
