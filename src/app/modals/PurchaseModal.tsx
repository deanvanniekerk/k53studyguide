import { BookOutlineIcon, ResetIcon, TestPenIcon, YinYangIcon } from '@/app/components/icons';
import { PurchaseContext } from '@/context';
import { RootState } from '@/state';
import { purchaseSelector, recievePurchaseOrderState } from '@/state/purchase';
import { Device } from '@ionic-native/device';
import { IonButton, IonIcon, IonLoading, IonModal, IonSlide, IonSlides, IonToast } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Translate, Translator } from 'react-translated';
import { bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import { useAnalytics } from '../hooks/useAnalytics';
import { watermarkStyle } from '../styles';

type Props = {
  isOpen: boolean;
  onDidDismiss: () => void;
} & PropsFromState &
  PropsFromDispatch;

const PurchaseModal: React.FC<Props> = (props) => {
  const { logEvent } = useAnalytics();

  const purchaseService = useContext(PurchaseContext);

  const [showOwnedToast, setShowOwnedToast] = useState(false);
  const [showFailedToast, setShowFailedToast] = useState(false);
  const [showCancelledToast, setShowCancelledToast] = useState(false);

  useEffect(() => {
    if (props.isOpen) logEvent('PRESENT_OFFER');
  }, [props.isOpen]);

  //Close the modal if its owned
  useEffect(() => {
    if (props.purchase.productState == 'finished') {
      setShowOwnedToast(true);
    }
    if (props.purchase.productState == 'owned') {
      props.onDidDismiss();
    }
    if (props.purchase.orderState == 'failed') {
      setShowFailedToast(true);
      props.recievePurchaseOrderState('ready'); //reset
    }
    if (props.purchase.orderState == 'cancelled') {
      setShowCancelledToast(true);
      props.recievePurchaseOrderState('ready'); //reset
    }
  }, [props.purchase]);

  const slideOpts = {
    initialSlide: 0,
    speed: 300,
    loop: true,
    autoplay: {
      delay: 4000,
    },
  };

  return (
    <React.Fragment>
      <Translator>
        {({ translate }) => (
          <React.Fragment>
            <IonToast
              isOpen={showOwnedToast}
              onDidDismiss={() => setShowOwnedToast(false)}
              message={translate({ text: 'purchaseSuccessful' })}
              duration={5000}
              color="success"
              position="top"
            />
            <IonToast
              isOpen={showCancelledToast}
              onDidDismiss={() => setShowCancelledToast(false)}
              message={translate({ text: 'purchaseCancelled' })}
              duration={2500}
              color="light"
              position="top"
            />
            <IonToast
              isOpen={showFailedToast}
              onDidDismiss={() => setShowFailedToast(false)}
              message={translate({ text: 'purchaseFailed' })}
              duration={5000}
              color="danger"
              position="top"
            />
          </React.Fragment>
        )}
      </Translator>
      <Modal mode="ios" isOpen={props.isOpen} onDidDismiss={props.onDidDismiss}>
        <Watermark />
        <Translator>
          {({ translate }) => (
            <IonLoading
              isOpen={props.purchase.productState === 'initiated'}
              message={translate({ text: 'processingPayment' })}
              mode={Device.platform == 'Android' ? 'md' : 'ios'}
            />
          )}
        </Translator>
        <div>
          <div>
            <CloseIcon icon={closeOutline} onClick={() => props.onDidDismiss()} />
          </div>
          <Header>
            <Translate text="k53Ninja" />
          </Header>
          <SubHeader>
            <IonButton mode="md" color="tertiary" fill="solid" class="button-x-small">
              <Translate text="premium" />
            </IonButton>
          </SubHeader>
          <SlidesContainer>
            <Slides pager={true} options={slideOpts}>
              <Slide>
                <div>
                  <div>
                    <TestPenIcon style={{ fontSize: '4rem' }} />
                    <SlideText>
                      <Translate text="accessTheArena" />
                    </SlideText>
                    <SlideSubText>
                      <Translate text="accessTheArenaInfo" />
                    </SlideSubText>
                  </div>
                </div>
              </Slide>
              <Slide>
                <div>
                  <div>
                    <ResetIcon style={{ fontSize: '4rem' }} />
                    <SlideText>
                      <Translate text="resetYourHistory" />
                    </SlideText>
                    <SlideSubText>
                      <Translate text="resetYourHistoryInfo" />
                    </SlideSubText>
                  </div>
                </div>
              </Slide>
              <Slide>
                <div>
                  <div>
                    <YinYangIcon style={{ fontSize: '4rem' }} />
                    <SlideText>
                      <Translate text="supportTheDev" />
                    </SlideText>
                    <SlideSubText>
                      <Translate text="supportTheDevInfo" />
                    </SlideSubText>
                  </div>
                </div>
              </Slide>
            </Slides>
          </SlidesContainer>
          <PurchaseDescriptionText>
            <Translate text="purchasePremiumFor" />
          </PurchaseDescriptionText>
          <PurchasePriceText>{props.purchase.price}</PurchasePriceText>
          <PurchasePriceButton>
            <IonButton
              mode="md"
              color="tertiary"
              shape="round"
              fill="solid"
              disabled={!props.purchase.canPurchase}
              onClick={() => {
                if (purchaseService) purchaseService.purchase();
              }}
            >
              <Translate text="getPremium" />
            </IonButton>
          </PurchasePriceButton>
        </div>
      </Modal>
    </React.Fragment>
  );
};

const Watermark = styled(BookOutlineIcon)`
  ${watermarkStyle}
  fill: #000000;
  opacity: 0.06;
`;

const CloseIcon = styled(IonIcon)`
  color: var(--ion-color-light);
  font-size: var(--ion-font-size-xxxl);
  padding-left: var(--default-padding);
  padding-top: var(--default-padding);
`;

const Header = styled.div`
  color: var(--ion-color-light);
  font-size: var(--ion-font-size-xxl);
  font-family: var(--ion-font-family-bold);
  font-weight: bold;
  text-align: center;
`;

const SubHeader = styled.div`
  text-align: center;
  padding: 5px 0;
`;

const SlidesContainer = styled.div`
  padding: 0;
`;

const Slides = styled(IonSlides)`
  --bullet-background: #000000;
  --bullet-background-active: #ffffff;
`;

const Slide = styled(IonSlide)`
  height: 235px;
`;

const SlideText = styled.div`
  color: var(--ion-color-light);
  font-family: var(--ion-font-family-bold);
  font-weight: bold;
  padding-top: 12px;
`;

const SlideSubText = styled.div`
  color: var(--ion-color-light);
  font-size: var(--ion-font-size-sm);
  font-weight: bold;
  padding-top: 12px;
  padding-right: 25px;
  padding-left: 25px;
  opacity: 0.6;
`;

const PurchaseDescriptionText = styled.div`
  color: var(--ion-color-light);
  font-size: var(--ion-font-size-sm);
  font-family: var(--ion-font-family-bold);
  font-weight: bold;
  text-align: center;
  padding-top: 30px;
`;

const PurchasePriceText = styled.div`
  color: var(--ion-color-light);
  font-size: var(--ion-font-size-xxl);
  font-family: var(--ion-font-family-bold);
  font-weight: bold;
  text-align: center;
  padding-top: 20px;
`;

const PurchasePriceButton = styled.div`
  padding-top: 15px;
  text-align: center;
`;

const Modal = styled(IonModal)`
  --background: var(--purchase-background);
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    purchase: purchaseSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators(
      {
        recievePurchaseOrderState,
      },
      dispatch,
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseModal);
