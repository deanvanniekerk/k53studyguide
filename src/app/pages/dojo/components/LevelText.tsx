import React, { useRef } from "react";
import { Translate } from "react-translated";
import styled from "styled-components";

import { CreateAnimation, useIonViewWillEnter } from "@ionic/react";

type Props = {
    level: number;
};

const LevelText: React.FC<Props> = (props) => {
    const animation = useRef<CreateAnimation>(null);
    useIonViewWillEnter(() => {
        if (animation.current) animation.current.animation.play();
    });

    return (
        <Wrapper>
            <CreateAnimation
                play={false}
                ref={animation}
                delay={100}
                duration={500}
                easing="ease"
                fromTo={{
                    property: "transform",
                    fromValue: "translateY(-85px)",
                    toValue: "translateY(0px)",
                }}
            >
                <div>
                    <Translate text="level" /> {props.level}
                </div>
            </CreateAnimation>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    text-align: center;
    padding: 10px 0;
    font-weight: bold;
    overflow: hidden;
`;

export { LevelText };
