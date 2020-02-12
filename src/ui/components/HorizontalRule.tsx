import React from "react";
import { View } from "react-native";

import { PAGE_MARGIN } from "@/data/theme";

type Props = {
    sideMargin?: number;
    paddingTop?: number;
    paddingBottom?: number;
};

const HorizontalRule: React.FC<Props> = props => {
    return (
        <View
            style={{
                flex: 1,
                marginLeft: props.sideMargin,
                marginRight: props.sideMargin,
                paddingTop: props.paddingTop,
                paddingBottom: props.paddingBottom,
            }}
        >
            <View
                style={{
                    backgroundColor: `rgba(255,255,255, 0.1)`,
                    height: 1,
                    width: "100%",
                }}
            ></View>
        </View>
    );
};
HorizontalRule.defaultProps = {
    sideMargin: PAGE_MARGIN + 5,
    paddingTop: 15,
    paddingBottom: 15,
};

export { HorizontalRule };
