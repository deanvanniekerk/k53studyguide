import * as React from "react";
import { TextStyle, View } from "react-native";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { Icon, ProgressBar, Text } from "@/ui/components";

type Props = PropsFromState;

const SeenProgressComponent: React.FC<Props> = props => {
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
                        progress={Math.floor((props.seenCurrent / props.seenTotal) * 100)}
                    />
                </View>
                <View>
                    <Icon type="ant-design" name="eye" size={12} opacity={0.6} />
                </View>
            </View>
            <View>
                <Text style={{ opacity: 0.9, fontSize: 13, marginTop: 5 }}>
                    {props.seenCurrent}/{props.seenTotal} Seen
                </Text>
            </View>
        </View>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        seenCurrent: 3, //currentNavigationSeenProgressSelector(state),
        seenTotal: 13, //currentNavigationSeenProgressSelector(state),
    };
};

const SeenProgress = connect(mapStateToProps)(SeenProgressComponent);

export { SeenProgress };
