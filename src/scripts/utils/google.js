/* global gapi */

import config  from '../../../config';

let google = {

    authInstance: {},

    initialized: false,

    init(callback) {
        gapi.load('auth2', () => {
            gapi.client.load('plus', 'v1').then(() => {
                gapi.auth2.init({
                    client_id: config.auth.google.clientID,
                    scopes: 'email,openid'
                }).then((authInstance) => {
                    this.authInstance = authInstance;
                    this.initialized = true;
                    this.getCurrentUser(callback);
                });
            });
        });
    },

    refresh(callback) {
        if (this.initialized) {
            this.getCurrentUser(callback);
        } else {
            setTimeout(() => {
                this.refresh(callback);
            }, 500);
        }
    },

    signIn(callback) {
        this.authInstance.signIn({prompt: 'none'}).then(() => {
            this.getCurrentUser(callback);
        });
    },

    signOut(callback) {
        this.authInstance.signOut().then(() => {
            callback();
        });
    },

    getCurrentUser(callback) {
        // get user data
        let user = this.authInstance.currentUser.get();

        // token
        let token = null;
        for (let key in user) {
            if (user[key] && user[key].hasOwnProperty('access_token')) {
                token = user[key];
            }
        }

        // profile
        let basicProfile = user.getBasicProfile();
        let profile = null;
        if (basicProfile) {
            profile = {
                _id:       basicProfile.getEmail(),
                email:     basicProfile.getEmail(),
                firstname: basicProfile.getGivenName(),
                lastname:  basicProfile.getFamilyName(),
                imageUrl:  basicProfile.getImageUrl()
            };
        }

        // is signed in
        let isSignedIn = user.isSignedIn();
        callback(token, profile, isSignedIn);
    }
};

export default google;