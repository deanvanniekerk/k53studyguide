import React from "react";

//import { connect } from "react-redux";
import { NavigationItem as NavItem } from "@/app/components";

//import { RootState } from "@/state";
//import { seenTotalsSelector } from "@/state/study/log";

type Props = {
    navigationItemKey: string;
    onClick: (navigationItemKey: string) => void;
    index: number;
}; // & PropsFromState;

const NavigationItem: React.FC<Props> = props => {
    const indicator = <div>TODO</div>;

    return (
        <NavItem
            index={props.index}
            navigationItemKey={props.navigationItemKey}
            onClick={() => props.onClick(props.navigationItemKey)}
            indicator={indicator}
        />
    );
};

// type PropsFromState = ReturnType<typeof mapStateToProps>;
// const mapStateToProps = (state: RootState) => {
//     return {
//         seenTotals: seenTotalsSelector(state),
//     };
// };

// const NavigationItem = connect(mapStateToProps)(NavigationItemComponent);

export { NavigationItem };
