// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import Actions     from './upload.actions.js';
import UploadStore from './upload.store.js';
import {TabbedArea, TabPane, PanelGroup, Accordion, Panel} from 'react-bootstrap';

import Select   from './upload.select.jsx';
import Rename   from './upload.rename.jsx';
import Issues   from './upload.issues.jsx';
import Resume   from './upload.resume.jsx';
import Progress from './upload.progress.jsx';
import Alert    from './upload.alert.jsx';


let Upload = React.createClass({

	mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

	render () {

	// short references ----------------------------

		let activeKey    = this.state.activeKey;
		let uploadStatus = this.state.uploadStatus;
		let dirName      = this.state.dirName;
		let disabledTab  = this.state.disabledTab;

	// conditional variables -----------------------

		let totalTabs    = this.state.showResume ? 5 : 4;
		let activeBar = "activeTab-" + activeKey;
		if (activeKey === 5 && totalTabs < 5) {activeBar = 'activeTab-4'}
		let activePane = "upload-wrap activePane-" + activeKey;

	// panels --------------------------------------


		let select;
		if (this.state.showSelect) {
			let tabName = <span><span>1:</span><span> Select</span></span>;
			select = (
				<TabPane eventKey={1} tab={tabName}  className="upload-step" disabled={disabledTab}>
					<div className={activePane}>
						<Select  />
					</div>
				</TabPane>
			);
		}

		let rename;
		if (this.state.showRename) {
			let tabName = this.state.resuming ? <span><span>2:</span><span> Resume</span></span> : <span><span>2:</span><span> Rename</span></span>;
			rename = (
				<TabPane eventKey={2} tab={tabName}  className="upload-step" disabled={disabledTab || !this.state.renameEnabled}>
					<div className={activePane}>
						<Rename />
					</div>
				</TabPane>
			);
		}

		let issues;
		if (this.state.showIssues) {
			let tabName = <span><span>3:</span><span> Issues</span></span>;
			issues = (
				<TabPane eventKey={3} tab={tabName}  className="upload-step" disabled={disabledTab}>
					<div className={activePane}>
						<Issues />
					</div>
				</TabPane>
			);
		}

		let resume;
		if (this.state.showResume) {
			let tabName = <span><span>4:</span><span> Resume</span></span>;
			resume = (
				<TabPane eventKey={4} tab={tabName}  className="upload-step" disabled={disabledTab}>
					<div className={activePane}>
						<Resume />
					</div>
				</TabPane>
			)
		}

		let progress;
		if (this.state.showProgress) {
			let tabName = <span><span>{totalTabs + ':'}</span><span> Progress</span></span>;
			progress = (
				<TabPane eventKey={5} tab={tabName}  className="upload-step" >
					<div className={activePane}>
						<Progress progress={this.state.progress} name={dirName} /> 
					</div>
				</TabPane>
			);
		}

	// main template -------------------------------

		return (
			<div className='right-sidebar'>
				<div className="rightsidebar-header">
					<h2>My Tasks</h2>
				</div>
				<div className="upload-wrap panel-group" defaultActiveKey='1'>
					<div className="upload-panel panel panel-default" h>

					    <div className="panel-heading">
					      <h4 className="panel-title">
					      Upload Dataset
					      </h4>
					    </div>

					    <div className="panel-collapse collapse in">
					    	<div className="panel-body">
					        	<div>

									<TabbedArea bsStyle="pills" bsSize="xsmall" className="upload-steps clearfix" activeKey={activeKey} animation={false}  onSelect={this._selectTab}>
										<div className={activeBar}></div>
										{select}
										{rename}
										{issues}
										{resume}
										{progress}
									</TabbedArea>

								</div>
							</div>
						</div>
					</div>
				</div>
				{this.state.alert ? <Alert type={this.state.alert} message={this.state.alertMessage} onClose={this._closeAlert} /> : null}
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_closeAlert: Actions.closeAlert,

	_selectTab: Actions.selectTab,

});


export default Upload;