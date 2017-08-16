export const name = 'accounts-offline-logout';

import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson'
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';

const LOGIN_TOKEN_KEY = 'Meteor.loginToken';
const USER_DOC_KEY = 'Meteor.user';
const DESTROY_TOKENS_KEY = 'Meteor.destroyTokens';

const _addTokenToDestroy = (token) => {
    let tokens = ( tokensStr = localStorage.getItem(DESTROY_TOKENS_KEY) ) ? EJSON.parse(tokensStr) : [];
    tokens.push(token);
    localStorage.setItem(DESTROY_TOKENS_KEY, EJSON.stringify(tokens));
}

const _removeTokenToDestroy = (token) => {
    let tokens = ( tokensStr = localStorage.getItem(DESTROY_TOKENS_KEY) ) ? EJSON.parse(tokensStr) : [];
    tokens.splice( tokens.indexOf(token), 1 );
    localStorage.setItem(DESTROY_TOKENS_KEY, EJSON.stringify(tokens));
}

const _logout = Accounts.logout;
Accounts.logout = function() {

    // logout normally if connected
    if ( Meteor.connection.status().connected ) {
        _logout.call(Accounts);

    // otherwise, make client logged out, and hold login token to logout when connection is re-established
    } else {
        if ( loginToken = localStorage.getItem(LOGIN_TOKEN_KEY) ) _addTokenToDestroy(loginToken);
        Accounts.makeClientLoggedOut();
    }

}
