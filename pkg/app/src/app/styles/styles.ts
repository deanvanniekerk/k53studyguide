import { css } from "styled-components";

export const watermarkStyle = css`
  position: absolute;
  font-size: 25rem;
  opacity: 0.035;
  right: -80px;
  top: -80px;
  fill: var(--app-text-primary);
  transform: rotate(-20deg);
`;
