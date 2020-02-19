import "./PageHeader.css";

import React from "react";
import { Translate } from "react-translated";

type Props = {
    text: string;
};

const PageHeader: React.FC<Props> = props => {
    return (
        <div className="page-header">
            <Translate text={props.text} />
        </div>
    );
};

export { PageHeader };
