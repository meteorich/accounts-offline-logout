export const name = 'accounts-offline-logout';

import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson'
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';

const LOGIN_TOKEN_KEY = 'Meteor.loginToken';
const USER_ID_KEY = 'Meteor.userId';
const DESTROY_TOKENS_KEY = 'Meteor.destroyTokens';

_loadTokens = () => ( tokensStr = localStorage.getItem(DESTROY_TOKENS_KEY) ) ? EJSON.parse(tokensStr) : [];
_saveTokens = (tokens) => (tokens && tokens.length) ? localStorage.setItem(DESTROY_TOKENS_KEY, EJSON.stringify(tokens)) : localStorage.removeItem(DESTROY_TOKENS_KEY);

const _addTokenToDestroy = (userId, token) => {
    let tokenObjects = _loadTokens();         // note tokenObjects is in the format [{ userId, token }, ...]
    tokenObjects.push({ userId, token });
    _saveTokens(tokenObjects);
}

const _removeTokenToDestroy = (tokenObject) => {
    let tokenObjects = _loadTokens();
    tokenObjects.splice( tokenObjects.indexOf(tokenObject), 1 );
    _saveTokens(tokenObjects);
}

const _logout = Accounts.logout;
Accounts.logout = function() {

    // logout normally if connected
    if ( Accounts.connection.status().connected ) {
        _logout.call(Accounts);

    // otherwise, make client logged out, and hold login token (if set) to logout when connection is re-established
    } else {
        let userId = localStorage.getItem(USER_ID_KEY);
        let token = localStorage.getItem(LOGIN_TOKEN_KEY);
        if ( userId && token ) _addTokenToDestroy(userId, token);
        Accounts.makeClientLoggedOut();
    }

}

const _destroyTokens = () => {
    // check for tokens to destroy (using reduceRight to iterate in reverse, so we can splice as we go)
    _loadTokens().forEach((tokenObject) => {

        Accounts.connection.apply('destroyToken', [ tokenObject.userId, tokenObject.token ], {
            wait: false
        }, function (error, result) {
            if (error) {
                console.error(error);
            } else {
                // successfully notified server to remove login token from database, so remove from local storage
                _removeTokenToDestroy(tokenObject);
            }
        });

    });    
}

// _destroy tokens when connected
Tracker.autorun(() => {
    console.log('connection check');
    let connected = Accounts.connection.status().connected;
    if (connected) {
        _destroyTokens();
    }
});

