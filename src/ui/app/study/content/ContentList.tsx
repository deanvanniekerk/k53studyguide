import React from "react";
import { FlatList, ScrollView, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { ContentItem } from "@/data";
import { RootState } from "@/state";
import { currentContentItemsSelector } from "@/state/study/content";
import { recieveSeenContentKey } from "@/state/study/log";
import { currentNavigationKeySelector } from "@/state/study/navigation";
import { HorizontalRule } from "@/ui/components";

import { Content } from "./Content";

type Props = PropsFromState & PropsFromDispatch;

const viewabilityConfig = {
    minimumViewTime: 200,
    viewAreaCoveragePercentThreshold: 30,
};

const ContentListComponent: React.FC<Props> = props => {
    if (props.contentItems.length === 0) return <React.Fragment />;

    const buildItemKey = (index: number): string => {
        return `${props.currentNavigationKey}.${index + 1}`;
    };

    return (
        <View>
            <FlatList<ContentItem>
                data={props.contentItems}
                keyExtractor={(_item, index) => buildItemKey(index)}
                renderItem={data => {
                    const key = buildItemKey(data.index);
                    return <Content key={key} navigationKey={key} item={data.item} />;
                }}
                onViewableItemsChanged={info => {
                    info.changed.forEach(item => {
                        if (item.isViewable) props.recieveSeenContentKey(item.key);
                    });
                }}
                ItemSeparatorComponent={() => <HorizontalRule paddingBottom={10} paddingTop={10} />}
                viewabilityConfig={viewabilityConfig}
            />
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

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveSeenContentKey }, dispatch),
    };
};

const ContentList = connect(mapStateToProps, mapDispatchToProps)(ContentListComponent);

export { ContentList };
