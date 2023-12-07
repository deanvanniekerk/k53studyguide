import { PageHeader, PageHeaderInfoIcon } from '@/app/components';
import React from 'react';

type Props = {
  onInfoClicked: () => void;
};

const DojoPageHeader: React.FC<Props> = (props) => {
  return <PageHeader text="dojo" rightComponent={<PageHeaderInfoIcon onClick={props.onInfoClicked} />} />;
};

export { DojoPageHeader };
