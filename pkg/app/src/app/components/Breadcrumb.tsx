import { IonText } from "@ionic/react";
import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { ROOT_NAVIGATION_KEY, recieveCurrentNavigationKey } from "@/state/study/navigation";
import { navigationKeyToBreadcrumb } from "@/utils";

type Props = {
  navigationKey: string;
  rootText?: string;
  showLast?: boolean;
  opacity?: number;
  lastOpacity?: number;
} & PropsFromDispatch;

const BreadcrumbComponent: React.FC<Props> = (props) => {
  const breadcrumb = navigationKeyToBreadcrumb(props.navigationKey);
  return (
    <div
      style={{
        flexDirection: "row",
      }}
    >
      {breadcrumb.map((key, index) => {
        const isLast = index === breadcrumb.length - 1;

        if (!props.showLast && isLast) return <React.Fragment key={key} />;

        let opacity = props.opacity === undefined ? 0.8 : props.opacity;

        if (isLast && props.lastOpacity) opacity = props.lastOpacity;

        return (
          <BreadcrumbText
            key={key}
            style={{
              opacity: opacity,
            }}
            className="text-md"
            onClick={() => props.recieveCurrentNavigationKey(key)}
          >
            {key !== ROOT_NAVIGATION_KEY ? (
              <Translate text={key} />
            ) : (
              <Translate text={props.rootText ? props.rootText : "study"} />
            )}
            {isLast ? "" : " / "}
          </BreadcrumbText>
        );
      })}
    </div>
  );
};

const BreadcrumbText = styled(IonText)`
  color: var(--breadcrumb-color, var(--ion-color-light));
`;

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveCurrentNavigationKey }, dispatch),
  };
};

const Breadcrumb = connect(null, mapDispatchToProps)(BreadcrumbComponent);

export { Breadcrumb };
