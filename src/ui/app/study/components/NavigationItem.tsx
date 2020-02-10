import * as React from "react";
import { TouchableHighlight, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { translationsSelector } from "@/state/translations/selectors";
import { Icon, ProgressBar, Text } from "@/ui/components";

type Props = {
    navigationItemKey: string;
    onPress: (navigationItemKey: string) => void;
} & PropsFromState;

const NavigationItemComponent: React.FC<Props> = props => {
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
                    <Icon
                        type="font-awesome"
                        name="user-circle"
                        style={{ marginLeft: 15, marginRight: 10 }}
                        size={22}
                        color={"#FFFFFF"}
                    />
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Animatable.View animation="fadeInUp" duration={300}>
                        <Text>{props.translations[props.navigationItemKey]}</Text>
                    </Animatable.View>
                    <Animatable.View
                        animation="fadeInUp"
                        duration={300}
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
                    <Icon
                        type="ant-design"
                        style={{ marginLeft: 10, marginRight: 15 }}
                        name="rightcircleo"
                        size={22}
                        color="rgba(255, 255, 255, 0.8)"
                    />
                </View>
            </View>
        </TouchableHighlight>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        translations: translationsSelector(state),
    };
};

const NavigationItem = connect(mapStateToProps)(NavigationItemComponent);

export { NavigationItem };
