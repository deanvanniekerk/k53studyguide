import React, { useRef } from "react";
import styled from "styled-components";

import { CreateAnimation, useIonViewWillEnter } from "@ionic/react";

import { Shuriken3Icon, Shuriken3OutlineIcon } from "./icons";

type Props = {
    total: number;
    current: number;
    size?: string;
    padding?: string;
    activeOpacity?: number;
    inActiveOpacity?: number;
};

const StarRating: React.FC<Props> = (props) => {
    return (
        <StarWrapper>
            {Array.from(Array(props.total)).map((_, index) => (
                <Star
                    key={index}
                    index={index}
                    active={props.current > index}
                    size={props.size}
                    padding={props.padding}
                    activeOpacity={props.activeOpacity}
                    inActiveOpacity={props.inActiveOpacity}
                />
            ))}
        </StarWrapper>
    );
};
StarRating.defaultProps = {
    activeOpacity: 1,
    inActiveOpacity: 0.2,
    size: "1rem",
    padding: "2px",
};

const StarWrapper = styled.div`
    display: flex;
`;

type StarProps = {
    active: boolean;
    index: number;
    size?: string;
    padding?: string;
    activeOpacity?: number;
    inActiveOpacity?: number;
};

const Star: React.FC<StarProps> = (props) => {
    const delay = props.index * 75;
    const animation = useRef<CreateAnimation>(null);
    useIonViewWillEnter(() => {
        if (animation.current) animation.current.animation.play();
    });

    return (
        <CreateAnimation
            play={false}
            ref={animation}
            duration={600}
            delay={delay}
            easing="ease"
            keyframes={[
                { offset: 0, transform: "scale(0)" },
                { offset: 0.8, transform: "scale(1.2)" },
                { offset: 1, transform: "scale(1)" },
            ]}
        >
            <IconWrapper size={props.size} padding={props.padding}>
                {props.active && <Shuriken3Icon style={{ opacity: props.activeOpacity }} />}
                {!props.active && (
                    <Shuriken3OutlineIcon
                        style={{ fill: "#FFFFFF", opacity: props.inActiveOpacity }}
                    />
                )}
            </IconWrapper>
        </CreateAnimation>
    );
};

type IconWrapperProps = {
    size?: string;
    padding?: string;
};

const IconWrapper = styled.div<IconWrapperProps>`
    font-size: ${(props) => props.size};
    padding: 0 ${(props) => props.padding};
`;

export { StarRating };
