// dependencies -------------------------------------------------------

import React                from 'react';


class Dashboard extends React.Component {

// life cycle events --------------------------------------------------

    render () {
        return (
            <div className="fade-in inner-route clearfix">
                <div className="col-xs-12">
                
                    {/*
                                        <ul className="nav nav-pills tabs">
                                            <li><Link to="notifications" className="btn-tab">Notifications<span className="unread-badge">2</span></Link></li>
                                            <li><Link to="datasets" className="btn-tab">My Datasets</Link></li>
                                            <li><Link to="jobs" className="btn-tab">My Results</Link></li>
                                        </ul>

                    */}
                    
                    {this.props.children}
                </div>
            </div>
        );
    }

}

export default Dashboard;





