import React from "react";

import { PageHeader, PageHeaderInfoIcon } from "@/app/components";

type Props = {
    onInfoClicked: () => void;
};

const StudyPageHeader: React.FC<Props> = props => {
    return (
        <PageHeader
            text="study"
            rightComponent={<PageHeaderInfoIcon onClick={props.onInfoClicked} />}
        />
    );
};

export { StudyPageHeader };
