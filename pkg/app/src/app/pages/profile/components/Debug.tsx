import { App } from "@capacitor/app";
import { Device } from "@capacitor/device";
import type React from "react";
import { useEffect, useState } from "react";
import { GroupCard, Row, Section, SectionTitle } from "./";

const Debug: React.FC = () => {
  const [appVersionNumber, setAppVersionNumber] = useState("");
  const [appVersionCode, setAppVersionCode] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [deviceVersion, setDeviceVersion] = useState("");

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
  );
};

export { Debug };
