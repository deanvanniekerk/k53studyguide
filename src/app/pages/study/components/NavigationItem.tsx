import "./NavigationItem.css";

import { chevronForwardOutline } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import { ProgressBar } from "src/app/components";
import { RootState } from "src/state";
import { seenTotalsSelector } from "src/state/study/log";
import { navigationIconsSelector } from "src/state/study/navigation";

import { CreateAnimation, IonIcon, IonItem, IonLabel, IonText } from "@ionic/react";

type Props = {
    navigationItemKey: string;
    onClick: (navigationItemKey: string) => void;
    index: number;
} & PropsFromState;

const NavigationItemComponent: React.FC<Props> = props => {
    const delay = props.index * 40;
    const seenTotal = props.seenTotals[props.navigationItemKey];
    const seenProgress = seenTotal ? Math.floor((seenTotal.seen / seenTotal.total) * 100) : 0;
    return (
        <IonItem className="navigation-item" onClick={() => props.onClick(props.navigationItemKey)}>
            <IonIcon
                icon={props.navigationIcons[props.navigationItemKey] || chevronForwardOutline}
                className="list-icon"
            />
            <IonLabel>
                <CreateAnimation
                    play={true}
                    delay={delay}
                    duration={500}
                    easing="ease"
                    fromTo={{
                        property: "transform",
                        fromValue: "translateY(30px)",
                        toValue: "translateY(0px)",
                    }}
                >
                    <div>
                        <IonText className="list-label">
                            <Translate text={props.navigationItemKey} />
                        </IonText>
                    </div>
                </CreateAnimation>
                <CreateAnimation
                    play={true}
                    duration={400}
                    easing="ease"
                    delay={300 + delay}
                    fromTo={{
                        property: "transform",
                        fromValue: "translateX(-80px)",
                        toValue: "translateX(0px)",
                    }}
                >
                    <div className="progress-bar">
                        <ProgressBar progress={seenProgress}></ProgressBar>
                    </div>
                </CreateAnimation>
            </IonLabel>
        </IonItem>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        navigationIcons: navigationIconsSelector(state),
        seenTotals: seenTotalsSelector(state),
    };
};

const NavigationItem = connect(mapStateToProps)(NavigationItemComponent);

export { NavigationItem };
