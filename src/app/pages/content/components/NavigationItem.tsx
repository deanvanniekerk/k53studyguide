import React from "react";
import { connect } from "react-redux";

import { NavigationItem as NavItem, ProgressBar } from "@/app/components";
import { RootState } from "@/state";
import { seenTotalsSelector } from "@/state/study/log";

type Props = {
    navigationItemKey: string;
    onClick: (navigationItemKey: string) => void;
    index: number;
} & PropsFromState;

const NavigationItemComponent: React.FC<Props> = (props) => {
    const seenTotal = props.seenTotals[props.navigationItemKey];
    const seenProgress = seenTotal ? Math.floor((seenTotal.seen / seenTotal.total) * 100) : 0;

    const indicator = (
        <ProgressBar
            progress={seenProgress}
            backgroundOpacity={0.15}
            foregroundOpacity={0.7}
        ></ProgressBar>
    );

    return (
        <NavItem
            index={props.index}
            navigationItemKey={props.navigationItemKey}
            onClick={() => props.onClick(props.navigationItemKey)}
            indicator={indicator}
        />
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        seenTotals: seenTotalsSelector(state),
    };
};

const NavigationItem = connect(mapStateToProps)(NavigationItemComponent);

export { NavigationItem };
