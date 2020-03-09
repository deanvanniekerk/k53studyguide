import styled from "styled-components";

import { TargetOutlineIcon } from "@/app/components/icons/TargetOutlineIcon";
import { watermarkStyle } from "@/app/styles";

export const DojoWatermark = styled(TargetOutlineIcon)`
    ${watermarkStyle}
    opacity: 0.04;
`;
