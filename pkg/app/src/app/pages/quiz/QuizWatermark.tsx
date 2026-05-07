import styled from "styled-components";
import { QuizOutlineIcon } from "@/app/components/icons";
import { watermarkStyle } from "@/app/styles";

export const QuizWatermark = styled(QuizOutlineIcon)`
  ${watermarkStyle}
  opacity: 0.04;
`;
