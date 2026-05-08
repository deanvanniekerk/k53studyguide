import type React from "react";
import { Translate } from "react-translated";
import styled from "styled-components";
import { PrimaryButton } from "@/app/components";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import { useAppRate } from "@/app/hooks/useAppRate";
import { GroupCard, Section, SectionTitle } from "./";

const RateApp: React.FC = () => {
  const appRate = useAppRate();
  const { analytics, logEvent } = useAnalytics();
  return (
    <Section>
      <SectionTitle>
        <Translate text="app" />
      </SectionTitle>
      <GroupCard>
        <PanelContent>
          <Info>
            <Translate text="rateAppRequest" />
          </Info>
          <ButtonWrap>
            <PrimaryButton
              section="profile"
              text="rateApp"
              onClick={() => {
                analytics.trackRateAppTap({ cta_location: "profile" });
                logEvent("RATE_APP");
                appRate.navigateToAppStore();
              }}
            />
          </ButtonWrap>
        </PanelContent>
      </GroupCard>
    </Section>
  );
};

const PanelContent = styled.div`
  padding: 20px 22px;
`;

const Info = styled.div`
  color: var(--app-text-muted);
  font-size: var(--app-font-size-md);
  font-weight: 700;
  line-height: 1.45;
`;

const ButtonWrap = styled.div`
  margin: 16px 0 0;
`;

export { RateApp };
