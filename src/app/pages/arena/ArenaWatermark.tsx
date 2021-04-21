import styled from "styled-components";

import { TestPenOutlineIcon } from "@/app/components/icons";
import { watermarkStyle } from "@/app/styles";

export const ArenaWatermark = styled(TestPenOutlineIcon)`
    ${watermarkStyle}
    fill: #000000;
    opacity: 0.06;
`;
