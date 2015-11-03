// dependencies -------------------------------------------------------

import React                      from 'react';
import {RouteHandler, Link}       from 'react-router';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import BlacklistModal             from './admin.blacklist.modal.jsx';
import actions                    from './admin.actions';

class Dashboard extends React.Component {

// life cycle events --------------------------------------------------

	componentDidMount() {
		actions.getBlacklist();
		actions.getUsers();
		actions.update({showBlacklistModal: false});
	}

	render () {
		return (
			<div className="fadeIn inner-route dashboard">
				<ul className="nav nav-pills dash-tab-link">
					<li><Link to="users" className="btn-blue">Users</Link></li>
					<li><Link to="blacklist" className="btn-blue">Blocked Users</Link></li>
				</ul>
				<div>
					<RouteHandler/>
				</div>
				<BlacklistModal />
			</div>
    	);
	}

}

export default Dashboard;




