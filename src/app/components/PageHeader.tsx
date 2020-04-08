import "./PageHeader.css";

import React from "react";
import { Translate } from "react-translated";

type Props = {
    text: string;
    rightComponent?: React.ReactNode;
};

const PageHeader: React.FC<Props> = (props) => {
    return (
        <div className="page-header">
            <div className="col-1"></div>
            <div className="col-2">
                <Translate text={props.text} />
            </div>
            <div className="col-3">{props.rightComponent}</div>
        </div>
    );
};

export { PageHeader };
