// using handle created in accounts-base
Accounts._server.methods({

    // expose Accounts destroyToken method
    // (note this is secure as database query to pull token requires token itself as well as userId)
    destroyToken: (userId, token) => {
        let hashedToken = Accounts._hashLoginToken(token);
        Accounts.destroyToken(userId, hashedToken);
        return true;
    }

});