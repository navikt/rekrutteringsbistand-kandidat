export const HIDE_FEEDBACK = 'HIDE_FEEDBACK';

const initialState = {
    shouldShowFeedback: true,
};

export default function feedbackReducer(state = initialState, action) {
    switch (action.type) {
        case HIDE_FEEDBACK:
            return {
                ...state,
                shouldShowFeedback: false,
            };
        default:
            return state;
    }
}
