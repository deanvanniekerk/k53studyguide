import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import type { RootState } from "@/state";
import { recieveLastSeenParentContentKey } from "@/state/study/log";
import { currentContentItemsSelector, currentNavigationKeySelector } from "@/state/study/navigation";
import { Content } from "./Content";

type Props = PropsFromState & PropsFromDispatch;

const ContentListComponent: React.FC<Props> = ({
  contentItems,
  currentNavigationKey,
  recieveLastSeenParentContentKey,
}) => {
  useEffect(() => {
    if (contentItems.length > 0) recieveLastSeenParentContentKey(currentNavigationKey);
  }, [contentItems, currentNavigationKey]);

  if (contentItems.length === 0) return <React.Fragment />;

  const buildItemKey = (index: number): string => {
    return `${currentNavigationKey}.${index + 1}`;
  };

  return (
    <ListShell>
      {contentItems.map((item, index) => {
        const key = buildItemKey(index);
        return <Content key={key} item={item} navigationKey={key} />;
      })}
    </ListShell>
  );
};

const ListShell = styled.section`
  display: grid;
  gap: 28px;
  padding: 18px var(--app-padding) 32px;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    contentItems: currentContentItemsSelector(state),
    currentNavigationKey: currentNavigationKeySelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveLastSeenParentContentKey }, dispatch),
  };
};

const ContentList = connect(mapStateToProps, mapDispatchToProps)(ContentListComponent);

export { ContentList };
