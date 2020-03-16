import { closeOutline } from "ionicons/icons";
import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { GongIcon, KatanaIcon } from "@/app/components/icons";
import { PurchaseContext } from "@/context";
import { RootState } from "@/state";
import { purchaseSelector } from "@/state/purchase";
import { IonButton, IonContent, IonIcon, IonModal, IonSlide, IonSlides } from "@ionic/react";

type Props = {
    isOpen: boolean;
    onDidDismiss: () => void;
} & PropsFromState;

const PurchaseModal: React.FC<Props> = props => {
    const purchaseService = useContext(PurchaseContext);

    //Close the modal if its owned
    useEffect(() => {
        if (props.purchase.owned) {
            props.onDidDismiss();
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
        <IonContent>
            <Modal isOpen={props.isOpen} onDidDismiss={props.onDidDismiss}>
                <div>
                    <div>
                        <CloseIcon icon={closeOutline} onClick={() => props.onDidDismiss()} />
                    </div>
                    <Header>K53 Ninja</Header>
                    <SubHeader>
                        <IonButton color="tertiary" fill="solid" class="button-x-small">
                            Premium
                        </IonButton>
                    </SubHeader>
                    <SlidesContainer>
                        <Slides pager={true} options={slideOpts}>
                            <Slide>
                                <div>
                                    <div>
                                        <KatanaIcon style={{ fontSize: "4rem" }} />
                                        <SlideText>Unlock the Arena</SlideText>
                                        <SlideSubText>
                                            Write tests that are structured and marked like the real
                                            one
                                        </SlideSubText>
                                    </div>
                                </div>
                            </Slide>
                            <Slide>
                                <div>
                                    <div>
                                        <GongIcon style={{ fontSize: "4rem" }} />
                                        <SlideText>Reset your History</SlideText>
                                        <SlideSubText>
                                            Reset your Seen, Dojo and Arena History
                                        </SlideSubText>
                                    </div>
                                </div>
                            </Slide>
                        </Slides>
                    </SlidesContainer>
                    <PurchasePriceText>
                        Purchase Premium Access for {props.purchase.price}
                    </PurchasePriceText>
                    <PurchasePriceButton>
                        <IonButton
                            color="tertiary"
                            shape="round"
                            fill="solid"
                            disabled={!props.purchase.canPurchase}
                            onClick={() => {
                                if (purchaseService) purchaseService.purchase();
                            }}
                        >
                            Get Premium
                        </IonButton>
                    </PurchasePriceButton>
                    <DisclaimerText>* purchases are for this device only</DisclaimerText>
                </div>
            </Modal>
        </IonContent>
    );
};

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
    height: 220px;
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

const PurchasePriceText = styled.div`
    color: var(--ion-color-light);
    font-size: var(--ion-font-size-sm);
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
    text-align: center;
    padding-top: 30px;
`;

const PurchasePriceButton = styled.div`
    padding-top: 12px;
    text-align: center;
`;

const DisclaimerText = styled.div`
    padding-top: 25px;
    padding-left: var(--default-padding);
    color: var(--ion-color-light);
    font-size: var(--ion-font-size-xs);
    opacity: 0.9;
`;

const Modal = styled(IonModal)`
    --background: linear-gradient(to right bottom, #501a8e, #00419b, #004d85, #005262, #005247);
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        purchase: purchaseSelector(state),
    };
};

export default connect(mapStateToProps)(PurchaseModal);
