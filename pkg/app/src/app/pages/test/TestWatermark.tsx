import styled from "styled-components";
import { TestPenOutlineIcon } from "@/app/components/icons";
import { watermarkStyle } from "@/app/styles";

export const TestWatermark = styled(TestPenOutlineIcon)`
  ${watermarkStyle}
  fill: var(--app-watermark-fill);
  opacity: 0.06;
`;
