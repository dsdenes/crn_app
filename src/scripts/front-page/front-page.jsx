// dependencies -------------------------------------------------------

import React         from 'react';
import Reflux        from 'reflux';
import {Link}        from 'react-router';
import FrontPageTabs from './front-page-tabs.jsx';
import userStore     from '../user/user.store.js';
import Spinner       from '../common/partials/spinner.jsx';
import Footer        from '../common/partials/footer.jsx';
import Pipelines     from './front-page.pipelines.jsx';
import FPActions     from './front-page.actions.js';

//silence lint errors while allowing somewhat simpler merges with upstream
var _ = FrontPageTabs;
var _ = Pipelines;

// component setup ----------------------------------------------------

let FrontPage = React.createClass({

    mixins: [Reflux.connect(userStore)],

    statics: {
        willTransitionTo(transition) {
            if (userStore.data.token) {
                transition.redirect('dashboard');
            }
        }
    },

// life cycle events --------------------------------------------------

    componentWillMount() {
        FPActions.reset();
    },

    render () {

        return (
            <span>
                <div className="intro">
                    <div className="container">
                        <div className="intro-inner fade-in clearfix">
                            <div className="clearfix welcome-block">
                                <div className="logo-layers">
                                    <img className="logo-layer-users" src="./assets/logo_users.png" alt="OpenNeuro Logo" />
                                    <img className="logo-layer-cube" src="./assets/logo_cube.png" alt="OpenNeuro Logo" />
                                    <img className="logo-layer-app" src="./assets/logo_app.png" alt="OpenNeuro Logo" />
                                    <img className="logo-layer-data" src="./assets/logo_data.png" alt="OpenNeuro Logo" />
                                </div>
                                <div className="logo-text">Open<span className="logo-end">Neuro</span></div>
                                <h1>A free and open platform for analyzing and sharing neuroimaging data</h1>
                                <div className="sign-in-block fade-in">
                                    {this._error(this.state.signinError, this.state.loading)}
                                    {this._signinForm(this.state.loading)}
                                    <Spinner text="Signing in..." active={this.state.loading} />
                                </div>
                                <div className="browse-publicly">
                                    <Link to="publicDashboard"><span>Browse Public Datasets</span></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this._moreInfo()}
                <Footer />
            </span>
        );
    },

// custom methods -------------------------------------------------------

    _signinForm(loadingState){
        if (!loadingState) {
            return(
                <span>
                    <button className="btn-admin" onClick={userStore.signIn} >
                        <i className="fa fa-google" /> Sign in with Google
                    </button>
                </span>
            );
        }
    },

    _error(signinError, loadingState) {
        if (signinError && !loadingState) {
            return <div className="alert alert-danger">{this.state.signinError}</div>;
        }
    },

// template functions ----------------------------------------------------

    _moreInfo(){
        return (
            <div className="more-info">
                <div className="container">
{/*
                    <span className="openneuro-more">
                        <div className="col-xs-12">
                            <div className="logo-text">Open<span className="logo-end">Neuro</span></div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <p>A free and open platform for analyzing and sharing neuroimaging data</p>
                            </div>
                            <div className="col-sm-6">
                                <p>View more information about<br/>
                                <a target="_blank" href="http://reproducibility.stanford.edu/">Stanford Center for Reproducible Neuroscience</a></p>
                            </div>
                        </div>
                    </span>
                    <span className="bids-more">
                        <div className="col-xs-12">
                            <h3>Brain Imaging Data Structure (BIDS) </h3>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                    <p>A Validator for the Brain Imaging Data Structure<br/>
                                        Read more about the <a target="_blank" href="http://bids.neuroimaging.io/">BIDS specifications</a></p>
                                </div>
                                <div className="col-sm-6">
                                <p>Want to contribute to BIDS?<br/>
                                    Visit the <a target="_blank" href="https://groups.google.com/forum/#!forum/bids-discussion">Google discussion group</a> to contribute.</p>
                            </div>
                        </div>
                    </span>
*/}
                    <div className="support-more">
                            <h4>Support for OpenNeuro provided by</h4>
                            <div className="row">
                                <div className="col-sm-4">
                                    <a target="_blank" href="http://www.arnoldfoundation.org/" title="Arnold Foundation">
                                        <img src="./assets/ljaf.png" alt="Arnold Foundation"/>
                                    </a>
                                </div>
                                <div className="col-sm-4">
                                    <a target="_blank" href="https://www.nsf.gov/" title="NSF">
                                        <img src="./assets/nsf.png" alt="National Science Foundation"/>
                                    </a>
                                </div>
                                <div className="col-sm-4">
                                    <a target="_blank" href="https://www.nih.gov/" title="NIH">
                                        <img src="./assets/nih.png" alt="National Institute on Drug and Abuse"/>
                                    </a>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-offset-3 col-sm-3">
                                    <a target="_blank" href="https://www.stanford.edu/" title="Stanford">
                                        <img src="./assets/stanford.png" alt="Stanford"/>
                                    </a>
                                </div>
                                <div className="col-sm-3">
                                    <a target="_blank" href="https://squishymedia.com/" title="Squishymedia">
                                        <img src="./assets/squishymedia.png" alt="Squishymedia"/>
                                    </a>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        );
    }

});

export default FrontPage;
