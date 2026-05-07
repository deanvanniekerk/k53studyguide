import { IonCol, IonGrid, IonRow } from "@ionic/react";
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Translate } from "react-translated";
import type { AnyAction, Dispatch } from "redux";
import styled from "styled-components";
import { PrimaryButton } from "@/app/components";
import { targetNavigationKeySelector } from "@/state/dojo/navigation";
import { recieveCurrentNavigationKey } from "@/state/study/navigation";

export const Footer: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch<Dispatch<AnyAction>>();
  const navigationKey = useSelector(targetNavigationKeySelector);

  return (
    <Grid>
      <PromptRow>
        <IonCol>
          {`Need to study up on '`}
          <b>
            <Translate text={navigationKey} />
          </b>
          {`' content?`}
        </IonCol>
      </PromptRow>
      <IonRow>
        <IonCol>
          <PrimaryButton
            section="study"
            text="yesTakeMeThere"
            onClick={() => {
              dispatch(recieveCurrentNavigationKey(navigationKey));
              history.push(`/content`);
            }}
          />
        </IonCol>
      </IonRow>
    </Grid>
  );
};

const Grid = styled(IonGrid)`
  padding: 4px var(--app-padding) 34px;
`;

const PromptRow = styled(IonRow)`
  padding: 16px 10px 18px;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-md);
  font-weight: 700;
  text-align: center;
`;
