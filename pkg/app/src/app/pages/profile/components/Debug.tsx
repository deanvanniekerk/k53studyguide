import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Device } from "@capacitor/device";
import { Translate, useTranslate } from "@k53studyguide/shared/translation";
import type React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getPremiumProductId, REVENUECAT_PREMIUM_ENTITLEMENT_ID } from "@/services";
import { logEntriesSelector } from "@/state/log";
import { purchaseSelector } from "@/state/purchase";
import { GroupCard, Row, Section, SectionTitle } from "./";

const maskKey = (key: string): string => {
  if (!key) return "(empty)";
  const prefix = key.split("_")[0];
  return `${prefix}_… (${key.length} chars)`;
};

const apiKeyForPlatform = (platform: string): string => {
  if (platform === "ios") return __REVENUECAT_IOS_API_KEY__;
  if (platform === "android") return __REVENUECAT_ANDROID_API_KEY__;
  return "";
};

const Debug: React.FC = () => {
  const translate = useTranslate();
  const [appVersionNumber, setAppVersionNumber] = useState("");
  const [appVersionCode, setAppVersionCode] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [deviceVersion, setDeviceVersion] = useState("");

  const purchase = useSelector(purchaseSelector);
  const logEntries = useSelector(logEntriesSelector);

  const platform = Capacitor.getPlatform();
  const productId = getPremiumProductId(platform === "ios");

  useEffect(() => {
    const load = async () => {
      const [appInfo, deviceInfo, deviceId] = await Promise.all([App.getInfo(), Device.getInfo(), Device.getId()]);
      setAppVersionNumber(appInfo.version);
      setAppVersionCode(appInfo.build);
      setDeviceModel(deviceInfo.model);
      setDeviceId(deviceId.identifier);
      setDeviceVersion(deviceInfo.osVersion);
    };
    void load();
  }, []);

  return (
    <>
      <Section>
        <SectionTitle>
          <Translate text="debugDevice" />
        </SectionTitle>
        <GroupCard>
          <Row name={translate({ text: "debugAppVersionNumber" })} value={appVersionNumber} />
          <Row name={translate({ text: "debugAppVersionCode" })} value={appVersionCode} />
          <Row name={translate({ text: "debugDeviceModel" })} value={deviceModel} />
          <Row name={translate({ text: "debugDeviceId" })} value={deviceId} />
          <Row name={translate({ text: "debugDeviceVersion" })} value={deviceVersion} />
        </GroupCard>
      </Section>

      <Section>
        <SectionTitle>
          <Translate text="debugBuild" />
        </SectionTitle>
        <GroupCard>
          <Row name={translate({ text: "debugEnvironment" })} value={__ENVIRONMENT__} />
          <Row name={translate({ text: "debugLogLevel" })} value={__LOG_LEVEL__} />
          <Row name={translate({ text: "debugPlatform" })} value={platform} />
        </GroupCard>
      </Section>

      <Section>
        <SectionTitle>
          <Translate text="debugPurchase" />
        </SectionTitle>
        <GroupCard>
          <Row name={translate({ text: "debugRevenuecatApiKey" })} value={maskKey(apiKeyForPlatform(platform))} />
          <Row name={translate({ text: "debugProductId" })} value={productId} />
          <Row name={translate({ text: "debugEntitlementId" })} value={REVENUECAT_PREMIUM_ENTITLEMENT_ID} />
          <Row name={translate({ text: "debugCanPurchase" })} value={String(purchase.canPurchase)} />
          <Row name={translate({ text: "debugOwned" })} value={String(purchase.owned)} />
          <Row name={translate({ text: "debugOrderState" })} value={purchase.orderState} />
          <Row name={translate({ text: "debugProductPrice" })} value={purchase.price || "(none)"} />
          <Row name={translate({ text: "debugProductTitle" })} value={purchase.title || "(none)"} />
        </GroupCard>
      </Section>

      <Section>
        <SectionTitle>
          <Translate text="debugLogs" />
        </SectionTitle>
        <GroupCard>
          <LogList>
            {logEntries.length === 0 && (
              <LogEmpty>
                <Translate text="debugNoLogMessagesYet" />
              </LogEmpty>
            )}
            {logEntries.map((entry, index) => (
              <LogItem key={`${entry.timestamp}-${index}`} $level={entry.level}>
                <LogMeta>
                  [{entry.level}] {new Date(entry.timestamp).toLocaleTimeString()}
                </LogMeta>
                <LogMessage>{entry.message}</LogMessage>
                {entry.data && <LogData>{JSON.stringify(entry.data)}</LogData>}
              </LogItem>
            ))}
          </LogList>
        </GroupCard>
      </Section>
    </>
  );
};

const LogList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
`;

const LogEmpty = styled.div`
  padding: var(--app-card-padding);
  color: var(--app-text-muted);
  font-size: var(--app-font-size-md);
`;

const LogItem = styled.div<{ $level: string }>`
  padding: var(--app-row-padding);
  border-bottom: 1px solid var(--app-profile-card-divider);
  color: ${(props) =>
    props.$level === "ERROR"
      ? "var(--app-profile-status-incomplete)"
      : props.$level === "WARNING"
        ? "var(--app-profile-action-icon)"
        : "var(--app-text-primary)"};

  &:last-child {
    border-bottom: 0;
  }
`;

const LogMeta = styled.div`
  color: var(--app-text-muted);
  font-size: var(--app-font-size-sm);
  font-weight: 700;
`;

const LogMessage = styled.div`
  margin-top: 2px;
  font-size: var(--app-font-size-md);
  overflow-wrap: anywhere;
`;

const LogData = styled.pre`
  margin: 4px 0 0;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-sm);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

export { Debug };
