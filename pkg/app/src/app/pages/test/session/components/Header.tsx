import type React from "react";
import styled from "styled-components";

const Header: React.FC = () => {
  return <Spacer />;
};

const Spacer = styled.div`
  height: var(--app-page-header-height);
`;

export { Header };
