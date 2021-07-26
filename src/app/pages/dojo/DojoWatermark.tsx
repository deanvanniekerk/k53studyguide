import styled from "styled-components";

import { QuizOutlineIcon } from "@/app/components/icons";
import { watermarkStyle } from "@/app/styles";

export const DojoWatermark = styled(QuizOutlineIcon)`
    ${watermarkStyle}
    opacity: 0.04;
`;
