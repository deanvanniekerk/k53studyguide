import { AppVersion } from "@awesome-cordova-plugins/app-version";
import { Device } from "@awesome-cordova-plugins/device";
import type React from "react";
import { useEffect, useState } from "react";
import { GroupCard, Row, Section, SectionTitle } from "./";

const Debug: React.FC = () => {
  const [appVersionNumber, setAppVersionNumber] = useState("");
  const [appVersionCode, setAppVersionCode] = useState("");

  useEffect(() => {
    const load = async () => {
      const avn = await AppVersion.getVersionNumber();
      setAppVersionNumber(avn);

      const avc = await AppVersion.getVersionCode();
      setAppVersionCode(avc.toString());
    };
    load();
  }, []);

  return (
    <Section>
      <SectionTitle>Device</SectionTitle>
      <GroupCard>
        <Row name="App Version Number" value={appVersionNumber} />
        <Row name="App Version Code" value={appVersionCode} />
        <Row name="Device Model" value={Device.model} />
        <Row name="Device Id" value={Device.uuid} />
        <Row name="Device Version" value={Device.version} />
      </GroupCard>
    </Section>
  );
};

export { Debug };
