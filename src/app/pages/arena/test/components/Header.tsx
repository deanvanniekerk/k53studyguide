import { IonGrid, IonListHeader, IonRow } from '@ionic/react';
import React from 'react';

const Header: React.FC = () => {
  return (
    <React.Fragment>
      <IonListHeader>
        <IonGrid>
          <IonRow style={{ paddingTop: 55 }}></IonRow>
        </IonGrid>
      </IonListHeader>
    </React.Fragment>
  );
};

export { Header };
