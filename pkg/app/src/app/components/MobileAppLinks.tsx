import { Translate } from "@k53studyguide/shared/translation";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { analytics } from "@/services/analytics";
import { showsMobileAppLinksSelector } from "@/state/access";

type Placement = "profile" | "quiz_results" | "test_results";

export function MobileAppLinks({ placement }: { placement: Placement }) {
  const visible = useSelector(showsMobileAppLinksSelector);
  if (!visible) return null;
  return (
    <Card>
      <Title>
        <Translate text={placement === "profile" ? "mobileAppTitle" : "mobileAppResults"} />
      </Title>
      <Copy>
        <Translate text="mobileAppHonesty" />
      </Copy>
      <Links>
        {(["android", "ios"] as const).map((platform) => {
          const location = `web_app_${placement}_${platform}`;
          const href =
            platform === "android"
              ? `https://play.google.com/store/apps/details?id=deanvniekerk.k53studyguide.app&hl=en&referrer=${encodeURIComponent(`utm_source=web_app&utm_medium=${location}&utm_campaign=organic_web`)}`
              : `https://apps.apple.com/us/app/k53-study-guide/id6784718443?ct=web_app_${location}`;
          return (
            <a
              key={platform}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                analytics.logEvent("select_store_cta", { cta_location: location, store_platform: platform })
              }
            >
              {platform === "android" ? "Google Play" : "App Store"}
            </a>
          );
        })}
      </Links>
    </Card>
  );
}

const Card = styled.section`
  margin: var(--app-section-gap) var(--app-padding);
  padding: var(--app-card-padding);
  border: var(--app-card-border);
  border-radius: 22px;
  background: var(--app-card-background);
`;
const Title = styled.h2`
  margin: 0 0 8px;
  color: var(--app-text-primary);
  font-size: var(--app-font-size-card-title);
`;
const Copy = styled.p`
  margin: 0;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-sm);
  line-height: 1.5;
`;
const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  margin-top: 16px;
  a { color: var(--app-text-primary); padding-block: 8px; text-underline-offset: 4px; }
`;
