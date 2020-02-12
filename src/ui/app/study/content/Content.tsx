import * as React from "react";
import { View } from "react-native";
import HTML from "react-native-render-html";
import { connect } from "react-redux";

import { FONT_FAMILY, FONT_SIZE, TEXT_COLOR } from "@/data/theme";
import { RootState } from "@/state";
import { currentContentItemsSelector } from "@/state/study/content";
import { HorizontalRule, Icon, Text } from "@/ui/components";

import { ContentImage } from "./ContentImage";

type Props = PropsFromState & PropsFromDispatch;

const ContentComponent: React.FC<Props> = props => {
    if (props.contentItems.length === 0) return <React.Fragment />;

    return (
        <View style={{ paddingBottom: 50 }}>
            {props.contentItems.map(c => (
                <View key={c.heading} style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 8, fontSize: 16 }}>
                        {c.heading}
                    </Text>
                    <ContentImage imageName={c.imageName} />
                    {!!c.description && (
                        <HTML
                            html={c.description}
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
                    <HorizontalRule paddingTop={30} />
                </View>
            ))}
        </View>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        contentItems: currentContentItemsSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = () => {
    return {
        //...bindActionCreators({ recieveCurrentNavigationKey }, dispatch),
    };
};

const Content = connect(mapStateToProps, mapDispatchToProps)(ContentComponent);

export { Content };
