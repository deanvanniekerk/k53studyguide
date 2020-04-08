import "./NavigationItem.css";

import { eye } from "ionicons/icons";
import React, { useRef } from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";

import { ProgressBar } from "@/app/components";
import {
    CarIcon,
    RoadIcon,
    SpeedometerIcon,
    StopIcon,
    TestIcon,
    TrafficLightIcon,
} from "@/app/components/icons";
import { RootState } from "@/state";
import { seenTotalsSelector } from "@/state/study/log";
import { CreateAnimation, IonIcon, IonLabel, IonText, useIonViewWillEnter } from "@ionic/react";

type Props = {
    navigationItemKey: string;
    onClick: (navigationItemKey: string) => void;
    index: number;
} & PropsFromState;

const NavigationItemComponent: React.FC<Props> = (props) => {
    const animation1 = useRef<CreateAnimation>(null);
    const animation2 = useRef<CreateAnimation>(null);

    const delay = props.index * 75;
    const seenTotal = props.seenTotals[props.navigationItemKey];
    const seenProgress = seenTotal ? Math.floor((seenTotal.seen / seenTotal.total) * 100) : 0;
    const containerAnimationDuration = 300;

    useIonViewWillEnter(() => {
        if (animation1.current) animation1.current.animation.play();

        if (animation2.current) animation2.current.animation.play();
    });

    return (
        <CreateAnimation
            play={false}
            ref={animation1}
            delay={delay}
            duration={containerAnimationDuration}
            easing="ease"
            fromTo={{
                property: "transform",
                fromValue: "translateY(85px)",
                toValue: "translateY(0px)",
            }}
        >
            <div
                className="root-navigation-item"
                onClick={() => props.onClick(props.navigationItemKey)}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <CreateAnimation
                        play={false}
                        ref={animation2}
                        duration={600}
                        delay={delay + containerAnimationDuration - 100}
                        easing="ease"
                        keyframes={[
                            { offset: 0, transform: "scale(0)" },
                            { offset: 0.8, transform: "scale(1.2)" },
                            { offset: 1, transform: "scale(1)" },
                        ]}
                    >
                        <Icon>{navigationIcons[props.navigationItemKey]}</Icon>
                    </CreateAnimation>
                    <IonLabel>
                        <div>
                            <IonText className="text-md" style={{ fontWeight: "bold" }}>
                                <Translate text={props.navigationItemKey} />
                            </IonText>
                        </div>
                    </IonLabel>
                    <div className="progress-bar">
                        <div style={{ width: 100 }}>
                            <ProgressBar
                                progress={seenProgress}
                                height={7}
                                backgroundOpacity={0.2}
                            ></ProgressBar>
                        </div>
                        <div>
                            <IonIcon
                                icon={eye}
                                className="text-sm"
                                style={{
                                    marginLeft: 6,
                                    opacity: seenProgress === 100 ? 0.7 : 0.4,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </CreateAnimation>
    );
};

const Icon = styled.div`
    position: absolute;
    color: #ffffff;
    right: 5px;
    bottom: -2px;
    font-size: 2.5rem;
    opacity: 0.7;
`;

const navigationIcons: { [key: string]: React.ReactNode } = {
    "nav.vehicleControls": <SpeedometerIcon />,
    "nav.rulesOfTheRoad": <TestIcon />,
    "nav.defensiveDriving": <CarIcon />,
    "nav.roadMarkings": <RoadIcon />,
    "nav.roadSignals": <TrafficLightIcon />,
    "nav.signs": <StopIcon />,
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        seenTotals: seenTotalsSelector(state),
    };
};

const NavigationItem = connect(mapStateToProps)(NavigationItemComponent);

export { NavigationItem };
