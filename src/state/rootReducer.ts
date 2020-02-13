import { Reducer } from "react";
import { combineReducers } from "redux";

import { reducer as study, StudyActions, StudyState } from "./study";
import { reducer as translations, TranslationsState } from "./translations";

export type RootState = {
    readonly study: StudyState;
    readonly translations: TranslationsState;
};

export type RootActions = StudyActions;

const createRootReducer = (): Reducer<RootState, RootActions> =>
    combineReducers({
        study: study,
        translations: translations,
    });

export default createRootReducer;
