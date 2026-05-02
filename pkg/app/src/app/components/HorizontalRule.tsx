import type React from "react";

type Props = {
  leftMargin?: number;
  rightMargin?: number;
  paddingTop?: number;
  paddingBottom?: number;
};

const HorizontalRule: React.FC<Props> = ({ leftMargin = 0, rightMargin = 0, paddingTop = 15, paddingBottom = 15 }) => {
  return (
    <div
      style={{
        flex: 1,
        marginLeft: leftMargin,
        marginRight: rightMargin,
        paddingTop,
        paddingBottom,
      }}
    >
      <div
        style={{
          backgroundColor: `rgba(255,255,255, 0.1)`,
          height: 1,
          width: "100%",
        }}
      ></div>
    </div>
  );
};

export { HorizontalRule };
