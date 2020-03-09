import styled from "styled-components";

import { KatanaOutlineIcon } from "@/app/components/icons";
import { watermarkStyle } from "@/app/styles";

export const ArenaWatermark = styled(KatanaOutlineIcon)`
    ${watermarkStyle}
    fill: #000000;
    opacity: 0.06;
`;
