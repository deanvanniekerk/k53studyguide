// Bundled URLs keep the same artwork available in the app and landing-page demo.
export const sectionIllustrations = {
  "vehicle-controls": new URL("./illustrations/vehicle-controls.webp", import.meta.url).href,
  "road-rules": new URL("./illustrations/road-rules.webp", import.meta.url).href,
  "defensive-driving": new URL("./illustrations/defensive-driving.webp", import.meta.url).href,
  "road-markings": new URL("./illustrations/road-markings.webp", import.meta.url).href,
  "traffic-signals": new URL("./illustrations/traffic-signals.webp", import.meta.url).href,
  "road-signs": new URL("./illustrations/road-signs.webp", import.meta.url).href,
};

export type SectionIllustrationName = keyof typeof sectionIllustrations;

export const sectionIconSources: Record<string, string> = {
  "nav.vehicleControls": sectionIllustrations["vehicle-controls"],
  "nav.rulesOfTheRoad": sectionIllustrations["road-rules"],
  "nav.defensiveDriving": sectionIllustrations["defensive-driving"],
  "nav.roadMarkings": sectionIllustrations["road-markings"],
  "nav.roadSignals": sectionIllustrations["traffic-signals"],
  "nav.signs": sectionIllustrations["road-signs"],
};

// Decorative artwork: the adjacent section title supplies the accessible label.
export const SectionIcon = ({ navigationItemKey, size }: { navigationItemKey: string; size: number }) => {
  const source = sectionIconSources[navigationItemKey];
  if (!source) return null;

  return (
    <img
      src={source}
      alt=""
      width={size}
      height={size}
      decoding="async"
      style={{ display: "block", objectFit: "contain", flexShrink: 0 }}
    />
  );
};
