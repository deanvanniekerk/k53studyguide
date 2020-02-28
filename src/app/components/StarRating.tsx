import { star, starOutline } from "ionicons/icons";
import React, { useRef } from "react";
import styled from "styled-components";

import { CreateAnimation, IonIcon, useIonViewWillEnter } from "@ionic/react";

type Props = {
    total: number;
    current: number;
    size?: string;
    padding?: string;
    activeOpacity?: number;
    inActiveOpacity?: number;
};

const StarRating: React.FC<Props> = props => {
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

const Star: React.FC<StarProps> = props => {
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
                <Icon
                    icon={props.active ? star : starOutline}
                    opacity={props.active ? props.activeOpacity : props.inActiveOpacity}
                />
            </IconWrapper>
        </CreateAnimation>
    );
};

type IconWrapperProps = {
    size?: string;
    padding?: string;
};

const IconWrapper = styled.div<IconWrapperProps>`
    font-size: ${props => (props.size ? props.size : "1rem")};
    padding: 0 ${props => (props.padding ? props.padding : "2px")};
`;

type IconProps = {
    opacity?: number;
};

const Icon = styled(IonIcon)<IconProps>`
    opacity: ${props => (props.opacity ? props.opacity : "1")};
`;

export { StarRating };
