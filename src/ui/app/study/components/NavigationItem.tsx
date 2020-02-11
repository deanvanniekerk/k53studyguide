import React, { useEffect } from "react";
import { TouchableHighlight, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { navigationIconsSelector } from "@/state/study/navigation";
import { translationsSelector } from "@/state/translations/selectors";
import { Icon, ProgressBar, Text } from "@/ui/components";

type Props = {
    navigationItemKey: string;
    onPress: (navigationItemKey: string) => void;
} & PropsFromState;

const hidden: Animatable.CustomAnimation = {
    from: {
        opacity: 0,
    },
    to: {
        opacity: 0,
    },
};

const animate = (
    ref: React.RefObject<Animatable.View>,
    animation: Animatable.Animation,
    duration: number,
    delay: number = 0
) => {
    if (!ref || !ref.current) return;

    setTimeout(() => {
        ref.current![animation]!(duration);
    }, delay);
};

const NavigationItemComponent: React.FC<Props> = props => {
    let navigationIcon = props.navigationIcons[props.navigationItemKey];

    if (!navigationIcon)
        navigationIcon = {
            type: "ant-design",
            name: "right",
        };

    let iconLeftRef = React.createRef<Animatable.View>();
    let textRef = React.createRef<Animatable.View>();
    let progressRef = React.createRef<Animatable.View>();
    let iconRightRef = React.createRef<Animatable.View>();

    useEffect(() => {
        animate(iconLeftRef, "fadeIn", 800);
        animate(textRef, "slideInLeft", 500);
        animate(progressRef, "fadeInLeft", 400, 300);
        animate(iconRightRef, "fadeIn", 800);
    }, []);

    return (
        <TouchableHighlight onPress={() => props.onPress(props.navigationItemKey)}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "stretch",
                    height: 60,
                }}
            >
                <View style={{ width: 50, justifyContent: "center" }}>
                    <Animatable.View ref={iconLeftRef} animation={hidden}>
                        <Icon
                            type={navigationIcon.type}
                            name={navigationIcon.name}
                            style={{ marginLeft: 15, marginRight: 10 }}
                            size={22}
                            color={"#FFFFFF"}
                        />
                    </Animatable.View>
                </View>
                <View style={{ flex: 1, justifyContent: "center", overflow: "hidden" }}>
                    <Animatable.View ref={textRef} animation={hidden}>
                        <Text style={{ fontWeight: "bold" }}>
                            {props.translations[props.navigationItemKey]}
                        </Text>
                    </Animatable.View>
                    <Animatable.View
                        ref={progressRef}
                        animation={hidden}
                        style={{
                            width: 150,
                            paddingTop: 6,
                            flexDirection: "row",
                            alignItems: "stretch",
                        }}
                    >
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <ProgressBar progress={50} />
                        </View>
                        <View>
                            <Icon
                                type="ant-design"
                                name="eye"
                                size={8}
                                color="rgba(255, 255, 255, 0.5)"
                            />
                        </View>
                    </Animatable.View>
                </View>
                <View style={{ justifyContent: "center" }}>
                    <Animatable.View ref={iconRightRef} animation={hidden}>
                        <Icon
                            type="ant-design"
                            style={{ marginLeft: 10, marginRight: 15 }}
                            name="rightcircleo"
                            size={22}
                            color="rgba(255, 255, 255, 0.8)"
                        />
                    </Animatable.View>
                </View>
            </View>
        </TouchableHighlight>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        translations: translationsSelector(state),
        navigationIcons: navigationIconsSelector(state),
    };
};

const NavigationItem = connect(mapStateToProps)(NavigationItemComponent);

export { NavigationItem };
