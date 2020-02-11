import * as React from "react";
import { View } from "react-native";
import HTML from "react-native-render-html";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { RootState } from "@/state";
import { currentContentItemsSelector } from "@/state/study/content";
import { Icon, Text } from "@/ui/components";

type Props = PropsFromState & PropsFromDispatch;

const ContentComponent: React.FC<Props> = props => {
    if (props.contentItems.length === 0) return <React.Fragment />;

    return (
        <View style={{ marginTop: 5 }}>
            {props.contentItems.map(c => (
                <View style={{ marginTop: 5 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>{c.heading}</Text>
                    <HTML
                        key={c.heading}
                        html={c.description}
                        baseFontStyle={{
                            fontFamily: "Roboto Condensed",
                            color: "#FFFFFF",
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
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        //...bindActionCreators({ recieveCurrentNavigationKey }, dispatch),
    };
};

const Content = connect(mapStateToProps, mapDispatchToProps)(ContentComponent);

export { Content };
