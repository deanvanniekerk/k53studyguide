import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { type Action, applyMiddleware, createStore, type Reducer } from "redux";
import { withExtraArgument } from "redux-thunk";
import { vi } from "vitest";
import * as quiz from "./quiz/session";
import createRootReducer, { type RootState } from "./rootReducer";

vi.mock("@capacitor-firebase/analytics", () => ({ FirebaseAnalytics: { logEvent: vi.fn() } }));

const createAssessmentStore = (state?: RootState) =>
  createStore(
    createRootReducer() as unknown as Reducer<RootState, Action>,
    state,
    applyMiddleware(withExtraArgument<RootState, Action, null>(null)),
  );
const question = (id: string) => ({
  id,
  answer: "B",
  text: id,
  option: [
    { id: "A", value: "Wrong" },
    { id: "B", value: "Correct" },
  ],
});
const events = () => vi.mocked(FirebaseAnalytics.logEvent).mock.calls.map(([event]) => event);

beforeEach(() => vi.clearAllMocks());

it("counts a submitted practice quiz once, including after saved state is reopened", () => {
  const store = createAssessmentStore();
  store.dispatch(
    quiz.recieveQuestionAnswers([
      { question: question("1"), answer: null },
      { question: question("2"), answer: null },
    ]),
  );
  store.dispatch(quiz.recieveAnswer("1", "B"));
  store.dispatch(quiz.recieveAnswer("2", "A"));
  store.dispatch(quiz.submitTest());
  store.dispatch(quiz.submitTest());
  const reopened = createAssessmentStore(JSON.parse(JSON.stringify(store.getState())));
  reopened.dispatch(quiz.submitTest());
  expect(events()).toEqual([
    {
      name: "quiz_complete",
      params: {
        question_count: 2,
        correct_count: 1,
        score_percent: 50,
        experience_gained: 1,
        analytics_schema_version: 2,
      },
    },
  ]);
});

it("does not complete an empty or partially answered practice quiz, and counts a resumed attempt when submitted", () => {
  const store = createAssessmentStore();
  store.dispatch(quiz.submitTest());
  store.dispatch(
    quiz.recieveQuestionAnswers([
      { question: question("1"), answer: null },
      { question: question("2"), answer: null },
    ]),
  );
  store.dispatch(quiz.recieveAnswer("1", "B"));
  store.dispatch(quiz.submitTest());
  expect(events()).toEqual([]);
  const resumed = createAssessmentStore(JSON.parse(JSON.stringify(store.getState())));
  resumed.dispatch(quiz.recieveAnswer("2", "B"));
  expect(events()).toEqual([]);
  resumed.dispatch(quiz.submitTest());
  expect(events()).toEqual([
    {
      name: "quiz_complete",
      params: {
        question_count: 2,
        correct_count: 2,
        score_percent: 100,
        experience_gained: 2,
        analytics_schema_version: 2,
      },
    },
  ]);
});

it("counts a completed mock test once with accurate section results after reopening", async () => {
  const mockTest = await import("./test/session");
  const store = createAssessmentStore();
  const answers = (
    [
      ["A", 8, 7],
      ["B", 28, 24],
      ["C", 28, 26],
    ] as const
  ).flatMap(([section, count, correct]) =>
    Array.from({ length: count }, (_, index) => ({
      section,
      question: question(`${section}${index}`),
      answer: index < correct ? "B" : "A",
    })),
  );
  store.dispatch(mockTest.recieveQuestionAnswers(answers));
  store.dispatch(mockTest.submitTest());
  store.dispatch(mockTest.submitTest());
  const reopened = createAssessmentStore(JSON.parse(JSON.stringify(store.getState())));
  reopened.dispatch(mockTest.submitTest());
  expect(events()).toEqual([
    {
      name: "mock_test_complete",
      params: {
        analytics_schema_version: 2,
        question_count: 64,
        correct_count: 57,
        score_percent: 89,
        passed: "true",
        section_a_correct: 7,
        section_a_total: 8,
        section_a_passed: "true",
        section_b_correct: 24,
        section_b_total: 28,
        section_b_passed: "true",
        section_c_correct: 26,
        section_c_total: 28,
        section_c_passed: "true",
      },
    },
  ]);
  expect(reopened.getState().test.log.testsPassed).toBe(1);
});

it("leaves an incomplete mock test resumable without recording completion", async () => {
  const mockTest = await import("./test/session");
  const store = createAssessmentStore();
  store.dispatch(mockTest.submitTest());
  store.dispatch(
    mockTest.recieveQuestionAnswers([
      { section: "A", question: question("1"), answer: null },
      { section: "B", question: question("2"), answer: null },
    ]),
  );
  store.dispatch(mockTest.recieveAnswer("1", "B"));
  store.dispatch(mockTest.submitTest());
  expect(events()).toEqual([]);
  const resumed = createAssessmentStore(JSON.parse(JSON.stringify(store.getState())));
  resumed.dispatch(mockTest.recieveAnswer("2", "A"));
  expect(events()).toEqual([]);
  resumed.dispatch(mockTest.submitTest());
  expect(events()).toEqual([
    {
      name: "mock_test_complete",
      params: {
        analytics_schema_version: 2,
        question_count: 2,
        correct_count: 1,
        score_percent: 50,
        passed: "false",
        section_a_correct: 1,
        section_a_total: 1,
        section_a_passed: "false",
        section_b_correct: 0,
        section_b_total: 1,
        section_b_passed: "false",
        section_c_correct: 0,
        section_c_total: 0,
        section_c_passed: "false",
      },
    },
  ]);
});

it("does not backfill fully answered legacy attempts when they are reopened and submitted", async () => {
  const mockTest = await import("./test/session");
  const state = createAssessmentStore().getState();
  const oldAnswer = { question: question("old"), answer: "B" };
  const legacyState = {
    ...state,
    quiz: { ...state.quiz, session: { questionAnswers: [oldAnswer], maxQuestions: 10, experienceGained: 0 } },
    test: { ...state.test, session: { questionAnswers: [{ ...oldAnswer, section: "A" }], currentSection: "A" } },
  } as RootState;
  const store = createAssessmentStore(legacyState);
  store.dispatch(quiz.submitTest());
  store.dispatch(mockTest.submitTest());
  expect(events()).toEqual([]);
});

it("counts a legacy incomplete attempt only after the learner resumes, answers and submits it", async () => {
  const mockTest = await import("./test/session");
  const state = createAssessmentStore().getState();
  const oldAnswer = { question: question("old"), answer: null };
  const legacyState = {
    ...state,
    quiz: { ...state.quiz, session: { questionAnswers: [oldAnswer], maxQuestions: 10, experienceGained: 0 } },
    test: { ...state.test, session: { questionAnswers: [{ ...oldAnswer, section: "A" }], currentSection: "A" } },
  } as RootState;
  const store = createAssessmentStore(legacyState);
  store.dispatch(quiz.recieveAnswer("old", "B"));
  store.dispatch(mockTest.recieveAnswer("old", "B"));
  expect(events()).toEqual([]);
  store.dispatch(quiz.submitTest());
  store.dispatch(mockTest.submitTest());
  expect(events().map(({ name }) => name)).toEqual(["quiz_complete", "mock_test_complete"]);
});

it("counts a fresh attempt even when the learner practices the same questions again", async () => {
  const mockTest = await import("./test/session");
  const store = createAssessmentStore();
  for (let attempt = 0; attempt < 2; attempt++) {
    store.dispatch(quiz.recieveQuestionAnswers([{ question: question("repeat"), answer: null }]));
    store.dispatch(mockTest.recieveQuestionAnswers([{ question: question("repeat"), answer: null, section: "A" }]));
    store.dispatch(quiz.recieveAnswer("repeat", "B"));
    store.dispatch(mockTest.recieveAnswer("repeat", "B"));
    store.dispatch(quiz.submitTest());
    store.dispatch(mockTest.submitTest());
  }
  expect(events().map(({ name }) => name)).toEqual([
    "quiz_complete",
    "mock_test_complete",
    "quiz_complete",
    "mock_test_complete",
  ]);
  expect(
    events()
      .filter(({ name }) => name === "quiz_complete")
      .map(({ params }) => params?.experience_gained),
  ).toEqual([1, 0]);
});
