import styled from "styled-components";

import { BrainOutlineIcon } from "@/app/components/icons";
import { watermarkStyle } from "@/app/styles";

export const DojoWatermark = styled(BrainOutlineIcon)`
    ${watermarkStyle}
    opacity: 0.04;
`;
