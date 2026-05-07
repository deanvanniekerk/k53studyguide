import { CreateAnimation, useIonViewWillEnter } from "@ionic/react";
import type React from "react";
import { useRef } from "react";
import styled from "styled-components";
import { StarIcon, StarOutlineIcon } from "./icons";

type Props = {
  total: number;
  current: number;
  size?: string;
  padding?: string;
  activeOpacity?: number;
  inActiveOpacity?: number;
  inActiveFill?: string;
};

const StarRating: React.FC<Props> = ({
  total,
  current,
  activeOpacity = 1,
  inActiveOpacity = 0.2,
  inActiveFill = "var(--app-card-background)",
  size = "1rem",
  padding = "2px",
}) => {
  return (
    <StarWrapper>
      {Array.from(Array(total)).map((_, index) => (
        <Star
          key={index}
          index={index}
          active={current > index}
          size={size}
          padding={padding}
          activeOpacity={activeOpacity}
          inActiveOpacity={inActiveOpacity}
          inActiveFill={inActiveFill}
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
  inActiveFill?: string;
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
        {props.active && <StarIcon style={{ opacity: props.activeOpacity }} />}
        {!props.active && <StarOutlineIcon style={{ fill: props.inActiveFill, opacity: props.inActiveOpacity }} />}
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
