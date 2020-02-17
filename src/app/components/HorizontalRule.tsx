import React from "react";

type Props = {
    leftMargin?: number;
    rightMargin?: number;
    paddingTop?: number;
    paddingBottom?: number;
};

const HorizontalRule: React.FC<Props> = props => {
    return (
        <div
            style={{
                flex: 1,
                marginLeft: props.leftMargin,
                marginRight: props.rightMargin,
                paddingTop: props.paddingTop,
                paddingBottom: props.paddingBottom,
            }}
        >
            <div
                style={{
                    backgroundColor: `rgba(255,255,255, 0.1)`,
                    height: 1,
                    width: "100%",
                }}
            ></div>
        </div>
    );
};
HorizontalRule.defaultProps = {
    rightMargin: 0,
    leftMargin: 0,
    paddingTop: 15,
    paddingBottom: 15,
};

export { HorizontalRule };
