import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { RootState } from "src/state";
import { currentContentItemsSelector } from "src/state/study/content";
import { recieveLastSeenParentContentKey } from "src/state/study/log";
import { currentNavigationKeySelector } from "src/state/study/navigation";

import { IonItem, IonList } from "@ionic/react";

import { Content } from "./Content";

type Props = PropsFromState & PropsFromDispatch;

const ContentListComponent: React.FC<Props> = ({
    contentItems,
    currentNavigationKey,
    recieveLastSeenParentContentKey,
}) => {
    useEffect(() => {
        console.log(contentItems.length);
        if (contentItems.length > 0) {
            recieveLastSeenParentContentKey(currentNavigationKey);
        }
    }, [contentItems, currentNavigationKey, recieveLastSeenParentContentKey]);

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
