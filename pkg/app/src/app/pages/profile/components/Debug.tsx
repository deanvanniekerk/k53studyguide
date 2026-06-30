import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Device } from "@capacitor/device";
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
        <SectionTitle>Device</SectionTitle>
        <GroupCard>
          <Row name="App Version Number" value={appVersionNumber} />
          <Row name="App Version Code" value={appVersionCode} />
          <Row name="Device Model" value={deviceModel} />
          <Row name="Device Id" value={deviceId} />
          <Row name="Device Version" value={deviceVersion} />
        </GroupCard>
      </Section>

      <Section>
        <SectionTitle>Build</SectionTitle>
        <GroupCard>
          <Row name="Environment" value={__ENVIRONMENT__} />
          <Row name="Log Level" value={__LOG_LEVEL__} />
          <Row name="Platform" value={platform} />
        </GroupCard>
      </Section>

      <Section>
        <SectionTitle>Purchase</SectionTitle>
        <GroupCard>
          <Row name="RevenueCat API Key" value={maskKey(apiKeyForPlatform(platform))} />
          <Row name="Product Id" value={productId} />
          <Row name="Entitlement Id" value={REVENUECAT_PREMIUM_ENTITLEMENT_ID} />
          <Row name="Can Purchase" value={String(purchase.canPurchase)} />
          <Row name="Owned" value={String(purchase.owned)} />
          <Row name="Order State" value={purchase.orderState} />
          <Row name="Product Price" value={purchase.price || "(none)"} />
          <Row name="Product Title" value={purchase.title || "(none)"} />
        </GroupCard>
      </Section>

      <Section>
        <SectionTitle>Logs</SectionTitle>
        <GroupCard>
          <LogList>
            {logEntries.length === 0 && <LogEmpty>No log messages yet.</LogEmpty>}
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
  padding: 12px 22px;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-md);
`;

const LogItem = styled.div<{ $level: string }>`
  padding: 10px 22px;
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
