import { targetNavigationKeySelector } from '@/state/dojo/navigation';
import { recieveCurrentNavigationKey } from '@/state/study/navigation';
import { IonButton, IonCol, IonGrid, IonRow } from '@ionic/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Translate } from 'react-translated';

export const Footer: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const navigationKey = useSelector(targetNavigationKeySelector);

  return (
    <IonGrid>
      <IonRow style={{ paddingTop: 15, paddingBottom: 20, paddingRight: 10, paddingLeft: 10 }}>
        <IonCol style={{ textAlign: 'center' }}>
          {`Need to study up on '`}
          <b>
            <Translate text={navigationKey} />
          </b>
          {`' content?`}
        </IonCol>
      </IonRow>
      <IonRow style={{ paddingBottom: 20 }}>
        <IonCol style={{ textAlign: 'center' }}>
          <IonButton
            color="primary"
            shape="round"
            fill="solid"
            className="button-med-large"
            onClick={() => {
              dispatch(recieveCurrentNavigationKey(navigationKey));
              history.push(`/content`);
            }}
          >
            Yes, take me there
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
