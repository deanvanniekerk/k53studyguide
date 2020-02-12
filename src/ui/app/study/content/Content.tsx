import { AllHtmlEntities } from "html-entities";
import React from "react";
import { View } from "react-native";
import HTML from "react-native-render-html";

import { ContentItem } from "@/data";
import { FONT_FAMILY, FONT_SIZE, TEXT_COLOR } from "@/data/theme";
import { Icon, Text } from "@/ui/components";

import { ContentImage } from "./ContentImage";
import { ContentSeenIndicator } from "./ContentSeenIndicator";

const entities = new AllHtmlEntities();

type Props = {
    item: ContentItem;
    navigationKey: string;
};

const Content: React.FC<Props> = ({ item, navigationKey }) => {
    return (
        <View key={item.heading} style={{ marginTop: 15 }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "stretch",
                    //paddingTop: 5,
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
        </View>
    );
};

export { Content };
