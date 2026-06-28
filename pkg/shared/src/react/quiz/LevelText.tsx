import type React from "react";
import { Translate } from "react-translated";
import styled, { keyframes } from "styled-components";

type Props = {
  level: number;
};

const LevelText: React.FC<Props> = (props) => {
  return (
    <Wrapper>
      <Inner>
        <Translate text="level" /> {props.level}
      </Inner>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 0;
  font-weight: bold;
  overflow: hidden;
`;

const dropIn = keyframes`
  from { transform: translateY(-85px); }
  to { transform: translateY(0px); }
`;

const Inner = styled.div`
  animation: ${dropIn} 500ms ease 100ms both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export { LevelText };
