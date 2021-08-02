import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import { recieveLastSeenParentContentKey } from "@/state/study/log";
import {
    currentContentItemsSelector,
    currentNavigationKeySelector,
} from "@/state/study/navigation";
import { IonItem, IonList } from "@ionic/react";

import { Content } from "./Content";

type Props = PropsFromState & PropsFromDispatch;

const ContentListComponent: React.FC<Props> = ({
    contentItems,
    currentNavigationKey,
    recieveLastSeenParentContentKey,
}) => {
    useEffect(() => {
        if (contentItems.length > 0) recieveLastSeenParentContentKey(currentNavigationKey);
    }, [contentItems, currentNavigationKey]);

    if (contentItems.length === 0) return <React.Fragment />;

    const buildItemKey = (index: number): string => {
        return `${currentNavigationKey}.${index + 1}`;
    };

    return (
        <IonList style={{ paddingTop: 25, paddingBottom: 25 }}>
            {contentItems.map((item, index) => {
                const key = buildItemKey(index);
                return (
                    <IonItem key={key}>
                        <Content item={item} navigationKey={key} />
                    </IonItem>
                );
            })}
        </IonList>
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
        ...bindActionCreators({ recieveLastSeenParentContentKey }, dispatch),
    };
};

const ContentList = connect(mapStateToProps, mapDispatchToProps)(ContentListComponent);

export { ContentList };
