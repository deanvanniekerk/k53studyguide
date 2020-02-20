import React from "react";
import { connect } from "react-redux";
import { PageHeader, ProgressBar } from "src/app/components";
import { RootState } from "src/state";
import { seenTotalsSelector } from "src/state/study/log";
import { ROOT_NAVIGATION_KEY } from "src/state/study/navigation";

type Props = PropsFromState;

const StudyPageHeaderComponent: React.FC<Props> = props => {
    const total = props.seenTotals[ROOT_NAVIGATION_KEY];

    if (!total) return <React.Fragment />;

    const seenProgress = Math.floor((total.seen / total.total) * 100);

    return (
        <PageHeader
            text="study"
            rightComponent={
                <div style={{ width: "50%", float: "right" }}>
                    <ProgressBar
                        height={8}
                        progress={seenProgress}
                        backgroundOpacity={0.2}
                        foregroundOpacity={0.6}
                    />
                </div>
            }
        />
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        seenTotals: seenTotalsSelector(state),
    };
};

const StudyPageHeader = connect(mapStateToProps)(StudyPageHeaderComponent);

export { StudyPageHeader };
