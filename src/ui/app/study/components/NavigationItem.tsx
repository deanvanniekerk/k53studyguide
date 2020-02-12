import React from "react";
import { TouchableHighlight, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";

import { PAGE_MARGIN } from "@/data/theme";
import { RootState } from "@/state";
import { navigationIconsSelector } from "@/state/study/navigation";
import { translationsSelector } from "@/state/translations/selectors";
import { Icon, ProgressBar, Text } from "@/ui/components";

type Props = {
    navigationItemKey: string;
    onPress: (navigationItemKey: string) => void;
} & PropsFromState;

const NavigationItemComponent: React.FC<Props> = props => {
    let navigationIcon = props.navigationIcons[props.navigationItemKey];

    if (!navigationIcon)
        navigationIcon = {
            type: "ant-design",
            name: "right",
        };

    return (
        <TouchableHighlight onPress={() => props.onPress(props.navigationItemKey)}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "stretch",
                    height: 60,
                }}
            >
                <View style={{ justifyContent: "center" }}>
                    <Animatable.View animation="fadeIn" duration={800}>
                        <Icon
                            type={navigationIcon.type}
                            name={navigationIcon.name}
                            style={{ marginRight: PAGE_MARGIN }}
                            size={22}
                        />
                    </Animatable.View>
                </View>
                <View style={{ flex: 1, justifyContent: "center", overflow: "hidden" }}>
                    <Animatable.View animation="slideInUp" duration={500}>
                        <Text style={{ fontWeight: "bold" }}>
                            {props.translations[props.navigationItemKey]}
                        </Text>
                    </Animatable.View>
                    <Animatable.View
                        animation="fadeInLeft"
                        duration={400}
                        delay={300}
                        style={{
                            width: 70,
                            paddingTop: 6,
                            flexDirection: "row",
                            alignItems: "stretch",
                        }}
                    >
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <ProgressBar progress={50} />
                        </View>
                        <View>
                            <Icon type="ant-design" name="eye" size={8} opacity={0.5} />
                        </View>
                    </Animatable.View>
                </View>
                {/* <View style={{ justifyContent: "center" }}>
                    <Animatable.View animation="fadeIn" duration={800}>
                        <Icon
                            type="ant-design"
                            style={{ marginLeft: 10, marginRight: 15 }}
                            name="rightcircleo"
                            size={22}
                            opacity={0.8}
                        />
                    </Animatable.View>
                </View> */}
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
