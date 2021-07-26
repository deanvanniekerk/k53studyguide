import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { recieveCurrentNavigationKey, ROOT_NAVIGATION_KEY } from "@/state/study/navigation";
import { navigationKeyToBreadcrumb } from "@/utils";
import { IonText } from "@ionic/react";

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

                let opacity = props.opacity === undefined ? 0.6 : props.opacity;

                if (isLast && props.lastOpacity) opacity = props.lastOpacity;

                return (
                    <BreadcrumbText
                        key={key}
                        style={{
                            opacity: opacity,
                        }}
                        className="text-sm"
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
    color: var(--ion-color-light);
`;

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveCurrentNavigationKey }, dispatch),
    };
};

const Breadcrumb = connect(null, mapDispatchToProps)(BreadcrumbComponent);

export { Breadcrumb };
