import { Capacitor } from "@capacitor/core";
import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { Provider } from "react-redux";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { act, create } from "react-test-renderer";
import { combineReducers, createStore } from "redux";
import { PurchaseContext } from "@/context";
import { ANDROID_PREMIUM_PRODUCT_ID, IOS_PREMIUM_PRODUCT_ID } from "@/services/purchase/productIds";
import { recievePurchaseProductOwned, reducer } from "@/state/purchase";
import { usePremiumOffer } from "./usePremiumOffer";

vi.mock("@capacitor-firebase/analytics", () => ({ FirebaseAnalytics: { logEvent: vi.fn() } }));
vi.mock("@capacitor/core", () => ({ Capacitor: { getPlatform: vi.fn(() => "android") } }));
const observers = [];
let page;
let offer;
let navigate;
let store;
beforeEach(() => {
  vi.clearAllMocks();
  Capacitor.getPlatform.mockReturnValue("android");
  observers.length = 0;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe() {}
      disconnect() {
        this.disconnected = true;
      }
      visible() {
        if (!this.disconnected) this.callback([{ isIntersecting: true }]);
      }
    },
  );
  store = createStore(combineReducers({ purchase: reducer }));
});
afterEach(() => {
  act(() => page?.unmount());
  vi.unstubAllGlobals();
});
function Invitation() {
  offer = usePremiumOffer("quiz_results");
  navigate = useNavigate();
  return <div ref={offer.invitationRef} />;
}
function mount(path = "/quiz/results", service = undefined) {
  act(() => {
    page = create(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <PurchaseContext.Provider value={service}>
            <Invitation />
          </PurchaseContext.Provider>
        </MemoryRouter>
      </Provider>,
      { createNodeMock: () => ({}) },
    );
  });
}
it("counts only a visible free invitation once per visit, and counts a later return", () => {
  mount();
  expect(FirebaseAnalytics.logEvent).not.toHaveBeenCalled();
  act(() => {
    observers[0].visible();
    observers[0].visible();
  });
  expect(FirebaseAnalytics.logEvent).toHaveBeenCalledTimes(1);
  expect(FirebaseAnalytics.logEvent).toHaveBeenLastCalledWith(
    expect.objectContaining({
      name: "premium_invitation_view",
      params: expect.objectContaining({ offer_origin: "quiz_results" }),
    }),
  );
  act(() => navigate("/study"));
  act(() => navigate("/quiz/results"));
  act(() => observers.at(-1).visible());
  expect(FirebaseAnalytics.logEvent).toHaveBeenCalledTimes(2);
});
it("keeps cached pages and premium learners out of the invitation denominator", () => {
  mount("/study");
  expect(observers).toHaveLength(0);
  act(() => store.dispatch(recievePurchaseProductOwned(true)));
  act(() => navigate("/quiz/results"));
  expect(observers).toHaveLength(0);
  expect(FirebaseAnalytics.logEvent).not.toHaveBeenCalled();
});
it("attributes offer entry and closes the sheet when its cached page is left", () => {
  mount();
  act(() => offer.open());
  expect(offer.isOpen).toBe(true);
  expect(FirebaseAnalytics.logEvent).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "premium_invitation_tap",
      params: expect.objectContaining({ offer_origin: "quiz_results" }),
    }),
  );
  act(() => navigate("/quiz"));
  expect(offer.isOpen).toBe(false);
});

it("attributes cold iOS invitations before the purchase service initializes", () => {
  Capacitor.getPlatform.mockReturnValue("ios");
  mount("/quiz/results", { productId: ANDROID_PREMIUM_PRODUCT_ID });
  act(() => observers[0].visible());
  act(() => offer.open());
  for (const event of ["premium_invitation_view", "premium_invitation_tap"]) {
    expect(FirebaseAnalytics.logEvent).toHaveBeenCalledWith(
      expect.objectContaining({ name: event, params: expect.objectContaining({ product_id: IOS_PREMIUM_PRODUCT_ID }) }),
    );
  }
});
