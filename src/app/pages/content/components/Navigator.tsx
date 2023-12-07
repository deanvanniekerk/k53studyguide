import { useAnalytics } from '@/app/hooks/useAnalytics';
import { RootState } from '@/state';
import { currentNavigationChildrenSelector, recieveCurrentNavigationKey } from '@/state/study/navigation';
import { IonList } from '@ionic/react';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { NavigationItem } from '../components';

type Props = PropsFromState & PropsFromDispatch;

const NavigatorComponent: React.FC<Props> = (props) => {
  const { logEvent } = useAnalytics();

  const onNavigationItemClicked = (key: string) => {
    logEvent('NAVIGATE', { key: key, component: 'ContentPage:NavigatorComponent' });
    props.recieveCurrentNavigationKey(key);
  };

  if (!props.navigationChildren) return <React.Fragment />;

  return (
    <IonList>
      {props.navigationChildren.map((key, index) => {
        return <NavigationItem key={key} navigationItemKey={key} onClick={onNavigationItemClicked} index={index} />;
      })}
    </IonList>
  );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    navigationChildren: currentNavigationChildrenSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveCurrentNavigationKey }, dispatch),
  };
};

const Navigator = connect(mapStateToProps, mapDispatchToProps)(NavigatorComponent);

export { Navigator };
