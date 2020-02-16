import "./ProgressBar.css";

import React from "react";

type Props = {
    progress: number;
    // backgroundColor?: string;
    // backgroundOpacity?: number;
    // foregroundColor?: string;
    // foregroundOpacity?: number;
    // height?: number;
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

    return (
        <div className="container">
            <div className="progressBar">
                <div className="completeBar"></div>
            </div>
        </div>
        // <View style={styles.container}>
        //     <View
        //         style={[
        //             styles.progressBar,
        //             {
        //                 backgroundColor: `rgba(${hexToRgb(props.backgroundColor || TEXT_COLOR).join(
        //                     ","
        //                 )}, ${props.backgroundOpacity})`,
        //                 height: props.height,
        //                 borderRadius: props.height,
        //             },
        //         ]}
        //     >
        //         <Animated.View
        //             style={[
        //                 StyleSheet.absoluteFill,
        //                 {
        //                     backgroundColor: `rgba(${hexToRgb(
        //                         props.foregroundColor || TEXT_COLOR
        //                     ).join(",")}, ${props.foregroundOpacity})`,
        //                     width,
        //                     borderRadius: props.height,
        //                 },
        //             ]}
        //         />
        //     </View>
        // </View>
    );
};
// ProgressBar.defaultProps = {
//     backgroundOpacity: 0.2,
//     backgroundColor: TEXT_COLOR,
//     foregroundOpacity: 0.6,
//     foregroundColor: TEXT_COLOR,
//     height: 4,
// };

export { ProgressBar };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     progressBar: {
//         flexDirection: "row",
//         width: "100%",
//         borderRadius: 4,
//     },
// });
