import { AllHtmlEntities } from "html-entities";
import React from "react";
import { View } from "react-native";
import HTML from "react-native-render-html";
import { connect } from "react-redux";
import VisibilitySensor from "react-visibility-sensor";
import { bindActionCreators, Dispatch } from "redux";

import { ContentItem } from "@/data";
import { FONT_FAMILY, FONT_SIZE, TEXT_COLOR } from "@/data/theme";
import { recieveSeenContentKey } from "@/state/study/log";
import { HorizontalRule, Icon, Text } from "@/ui/components";

import { ContentImage } from "./ContentImage";
import { ContentSeenIndicator } from "./ContentSeenIndicator";

type Props = {
    item: ContentItem;
    navigationKey: string;
} & PropsFromDispatch;

const ContentComponent: React.FC<Props> = ({ item, navigationKey, recieveSeenContentKey }) => {
    const onChange = (isVisible: boolean) => {
        if (isVisible) recieveSeenContentKey(navigationKey);
    };

    const entities = new AllHtmlEntities();

    return (
        <View key={item.heading} style={{ marginTop: 20 }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "stretch",
                    paddingTop: 12,
                    paddingBottom: 12,
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                        {entities.decode(item.heading)}
                    </Text>
                </View>
                <View>
                    <ContentSeenIndicator navigationKey={navigationKey} />
                </View>
            </View>
            <ContentImage imageName={item.imageName} />
            {!!item.description && (
                <HTML
                    html={item.description}
                    baseFontStyle={{
                        fontFamily: FONT_FAMILY,
                        color: TEXT_COLOR,
                        fontSize: FONT_SIZE,
                        lineHeight: 20,
                        marginBottom: 30,
                    }}
                    tagsStyles={{
                        ul: {
                            left: -10,
                        },
                    }}
                    listsPrefixesRenderers={{
                        ul: () => {
                            return (
                                <Icon
                                    type="ant-design"
                                    name="right"
                                    style={{
                                        fontSize: 10,
                                        fontWeight: "bold",
                                        marginTop: 5,
                                        marginRight: 6,
                                    }}
                                />
                            );
                        },
                    }}
                />
            )}
            <HorizontalRule paddingBottom={10} paddingTop={25} />
            <VisibilitySensor onChange={onChange}>
                <Text>HI</Text>
            </VisibilitySensor>
        </View>
    );
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveSeenContentKey }, dispatch),
    };
};

const Content = connect(null, mapDispatchToProps)(ContentComponent);

export { Content };
