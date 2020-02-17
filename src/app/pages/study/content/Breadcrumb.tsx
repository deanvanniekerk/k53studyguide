import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import { RootState } from "src/state";
import { currentNavigationBreadcrumbSelector } from "src/state/study/navigation";

import { IonText } from "@ionic/react";

type Props = PropsFromState;

const BreadcrumbComponent: React.FC<Props> = props => {
    return (
        <div
            style={{
                flexDirection: "row",
            }}
        >
            {props.breadcrumb.map((b, i) => {
                const isLast = i === props.breadcrumb.length - 1;

                if (isLast) return <React.Fragment key={b} />;

                return (
                    <IonText
                        key={b}
                        style={{
                            opacity: 0.6,
                            fontSize: 12,
                        }}
                    >
                        {b !== "nav" ? <Translate text={b} /> : "Home"}
                        {" / "}
                    </IonText>
                );
            })}
        </div>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        breadcrumb: currentNavigationBreadcrumbSelector(state),
    };
};

const Breadcrumb = connect(mapStateToProps)(BreadcrumbComponent);

export { Breadcrumb };
