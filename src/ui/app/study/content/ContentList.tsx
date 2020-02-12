import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { currentContentItemsSelector } from "@/state/study/content";
import { currentNavigationKeySelector } from "@/state/study/navigation";

import { Content } from "./Content";

type Props = PropsFromState;

const ContentListComponent: React.FC<Props> = props => {
    if (props.contentItems.length === 0) return <React.Fragment />;
    return (
        <View style={{ paddingBottom: 50 }}>
            {props.contentItems.map((item, index) => {
                const key = `${props.currentNavigationKey}.${index + 1}`;
                return <Content key={key} navigationKey={key} item={item} />;
            })}
        </View>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        contentItems: currentContentItemsSelector(state),
        currentNavigationKey: currentNavigationKeySelector(state),
    };
};

const ContentList = connect(mapStateToProps)(ContentListComponent);

export { ContentList };
