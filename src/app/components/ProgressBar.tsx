import "./ProgressBar.css";

import React from "react";
import { TEXT_COLOR } from "src/data";
import { hexToRgb } from "src/utils/color";

type Props = {
    progress: number;
    backgroundColor?: string;
    backgroundOpacity?: number;
    foregroundColor?: string;
    foregroundOpacity?: number;
    height?: number;
};

const ProgressBar: React.FC<Props> = props => {
    // const animation = useRef(new Animated.Value(0));

    // useEffect(() => {
    //     Animated.timing(animation.current, {
    //         toValue: props.progress,
    //         duration: props.progress === 0 ? 0 : 600,
    //         easing: Easing.inOut(Easing.ease),
    //     }).start();
    // }, [props.progress]);

    // const width = animation.current.interpolate({
    //     inputRange: [0, 100],
    //     outputRange: ["0%", "100%"],
    //     extrapolate: "clamp",
    // });

    const width = `${props.progress}%`;

    return (
        <div className="container">
            <div
                className="progressBar"
                style={{
                    backgroundColor: `rgba(${hexToRgb(props.backgroundColor || TEXT_COLOR).join(
                        ","
                    )}, ${props.backgroundOpacity})`,
                    height: props.height,
                    borderRadius: props.height,
                }}
            >
                <div
                    className="completeBar"
                    style={{
                        backgroundColor: `rgba(${hexToRgb(props.foregroundColor || TEXT_COLOR).join(
                            ","
                        )}, ${props.foregroundOpacity})`,
                        width,
                        height: props.height,
                        borderRadius: props.height,
                    }}
                ></div>
            </div>
        </div>
    );
};
ProgressBar.defaultProps = {
    backgroundOpacity: 0.2,
    backgroundColor: TEXT_COLOR,
    foregroundOpacity: 0.6,
    foregroundColor: TEXT_COLOR,
    height: 4,
};

export { ProgressBar };
