import {
    HIDE_MESSAGE,
    ON_HIDE_LOADER,
    ON_SHOW_LOADER,
    SHOW_MESSAGE,
    SIGNIN_USER,
    SIGNIN_USER_SUCCESS,
    SIGNOUT_USER,
    SIGNOUT_USER_SUCCESS,
    SIGNUP_USER,
    SIGNUP_USER_SUCCESS,
    ACTIVATE_USER,
    ACTIVATE_USER_SUCCESS,
} from 'constants/ActionTypes';

export const userSignUp = (user) => {
    return {
        type: SIGNUP_USER,
        payload: user
    };
};
export const userActivate = (user) => {
  return {
    type: ACTIVATE_USER,
    payload: user
  };
};
export const userSignIn = (user) => {
    return {
        type: SIGNIN_USER,
        payload: user
    };
};
export const userSignOut = () => {
    return {
        type: SIGNOUT_USER
    };
};
export const userSignUpSuccess = (authUser) => {
    return {
        type: SIGNUP_USER_SUCCESS,
        payload: authUser
    };
};

export const userActivateSuccess = (authUser) => {
  return {
    type: ACTIVATE_USER_SUCCESS,
    payload: authUser
  };
};

export const userSignInSuccess = (authUser) => {
    return {
        type: SIGNIN_USER_SUCCESS,
        payload: authUser
    }
};
export const userSignOutSuccess = () => {
    return {
        type: SIGNOUT_USER_SUCCESS,
    }
};

export const showAuthMessage = (message) => {
    return {
        type: SHOW_MESSAGE,
        payload: message
    };
};

export const showAuthLoader = () => {
    return {
        type: ON_SHOW_LOADER,
    };
};

export const hideMessage = () => {
    return {
        type: HIDE_MESSAGE,
    };
};
export const hideAuthLoader = () => {
    return {
        type: ON_HIDE_LOADER,
    };
};
