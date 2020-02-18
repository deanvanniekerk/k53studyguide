import React from "react";
import { connect } from "react-redux";
import { RootState } from "src/state";
import { currentContentItemsSelector } from "src/state/study/content";
import { currentNavigationKeySelector } from "src/state/study/navigation";

import { IonItem, IonList } from "@ionic/react";

import { Content } from "./Content";

type Props = PropsFromState;

const ContentListComponent: React.FC<Props> = props => {
    if (props.contentItems.length === 0) return <React.Fragment />;

    const buildItemKey = (index: number): string => {
        return `${props.currentNavigationKey}.${index + 1}`;
    };

    return (
        <IonList style={{ paddingTop: 25, paddingBottom: 25 }}>
            {props.contentItems.map((item, index) => {
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

const ContentList = connect(mapStateToProps)(ContentListComponent);

export { ContentList };
