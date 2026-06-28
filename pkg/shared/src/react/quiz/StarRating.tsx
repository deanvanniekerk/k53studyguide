import type React from "react";
import styled, { keyframes } from "styled-components";
import { StarIcon, StarOutlineIcon } from "../icons";

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
        <IconWrapper key={index} size={size} padding={padding} $delay={index * 75}>
          {current > index ? (
            <StarIcon style={{ opacity: activeOpacity }} />
          ) : (
            <StarOutlineIcon style={{ fill: inActiveFill, opacity: inActiveOpacity }} />
          )}
        </IconWrapper>
      ))}
    </StarWrapper>
  );
};

const StarWrapper = styled.div`
  display: flex;
`;

const popIn = keyframes`
  0% { transform: scale(0); }
  80% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

type IconWrapperProps = {
  size?: string;
  padding?: string;
  $delay: number;
};

const IconWrapper = styled.div<IconWrapperProps>`
  font-size: ${(props) => props.size};
  padding: 0 ${(props) => props.padding};
  animation: ${popIn} 600ms ease ${(props) => props.$delay}ms both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export { StarRating };
