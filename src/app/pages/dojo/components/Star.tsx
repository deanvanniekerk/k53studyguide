import { star, starOutline } from "ionicons/icons";
import React, { useRef } from "react";
import styled from "styled-components";

import { CreateAnimation, IonIcon, useIonViewWillEnter } from "@ionic/react";

type Props = {
    active: boolean;
    index: number;
};

const Star: React.FC<Props> = (props) => {
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
            <Wrapper>
                <IonIcon icon={props.active ? star : starOutline} />
            </Wrapper>
        </CreateAnimation>
    );
};

const Wrapper = styled.div`
    font-size: 2rem;
    padding: 0 5px;
`;

export { Star };
