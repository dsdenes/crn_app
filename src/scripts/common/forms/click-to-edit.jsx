// dependencies -------------------------------------------------------

import React          from 'react';
import AuthorInput    from './author-input.jsx';
import FileArrayInput from './file-array-input.jsx';
import Spinner        from '../partials/spinner.jsx';
import WarnButton     from './warn-button.jsx';

let ClickToEdit = React.createClass({

// life cycle events --------------------------------------------------

    getDefaultProps () {
        return {
            editable: true,
            type: 'string',
            value: ''
        };
    },

    getInitialState() {
        return {
            value: this.props.value,
            initialValue: JSON.stringify(this.props.value),
            loading: false,
            edit: false
        };
    },

    componentWillReceiveProps(nextProps) {
        // display edit when error is triggered
        if (nextProps.error) {
            this.setState({edit: true});
        }
    },

    propTypes: {
        value: React.PropTypes.any,
        type: React.PropTypes.any,
        label: React.PropTypes.any,
        error: React.PropTypes.func,
        editable: React.PropTypes.bool,
        onDismissIssue: React.PropTypes.func,
        onDelete: React.PropTypes.func,
        onFileClick: React.PropTypes.func,
        onChange: React.PropTypes.func
    },

    render() {
        let value = this.state.value;
        let type = this.props.type;
        let input, display;

        switch (type) {
        case 'string':
            display = <div className="cte-display"><div className="fadeIn">{value}</div></div>;
            input = (
                <div>
                    <textarea className="form-control" value={value} onChange={this._handleChange.bind(null, type)}></textarea>
                    <div className="btn-wrapper">
                        <button className="cte-save-btn btn-admin-blue" onClick={this._save}>save</button>
                    </div>
                </div>
            );
            break;
        case 'authors':
            input = <AuthorInput value={value} onChange={this._handleChange.bind(null, type)} />;
            display = <div className="cte-display">{this._authorList(value)}</div>;
            break;
        case 'fileArray':
            input = <FileArrayInput
                        value={this.props.value}
                        onChange={this._handleFile}
                        onDelete={this._handleDelete}
                        onFileClick={this._download}/>;
            display = <div className="cte-display">{this._fileList(this.props.value)}</div>;
            break;
        }

        let edit = (
            <div className="cte-edit fadeIn clearfix">
                {!this.state.loading ? input : null}
                <Spinner active={this.state.loading} />
            </div>
        );

        return (
            <div className="form-group" >
                <label>{this.props.label} {this._editBtn()}</label>
                {this._error(this.props.error)}
                <div>
                    {this.state.edit ? edit : display}
                </div>
            </div>
        );
    },

// template methods ---------------------------------------------------

    _authorList(authors) {
        let list = authors.map((item, index) => {
            return (
                <div className="fadeIn" key={index}>
                    <span>{item.name} {item.ORCIDID ? '-' : null} {item.ORCIDID}</span>
                </div>
            );
        });
        return list;
    },

    _editBtn() {
        let edit = this.state.edit;
        if (this.props.editable) {
            return (
                <button onClick={this._toggleEdit} className="cte-edit-button btn btn-admin fadeIn" >
                    <span><i className={'fa fa-' + (edit ? 'times' : 'pencil')}></i> {edit ? 'Hide' : 'Edit'}</span>
                </button>
            );
        }
    },

    _error(error) {
        if (error) {
            return (
                <div className="alert alert-danger">
                    <button className="close" onClick={this.props.onDismissIssue}><span>&times;</span></button>
                    {error}
                </div>
            );
        }
    },

    _fileList(files) {
        let list = files.map((file) => {
            return (
                <div className="fadeIn file-array" key={file.name}>
                    <span>
                        <span className="file-array-btn">
                            <WarnButton
                                tooltip="Download Attachment"
                                icon="fa-download"
                                prepDownload={this._download.bind(null, file.name)} />
                        </span>
                        {file.name}
                    </span>
                </div>
            );
        });
        return list;
    },

// custom methods -----------------------------------------------------

    _display() {
        this.setState({edit: false});
    },

    _toggleEdit() {
        this.setState({edit: !this.state.edit});
    },

    _handleFile(file, callback) {
        if (this.props.onChange) {
            this.props.onChange(file, callback);
        }
    },

    _handleChange(type, event) {
        this.setState({value: event.target.value}, () => {
            if (type === 'authors') {
                this._save(type);
            }
        });
    },

    _handleDelete(filename, index) {
        if (this.props.onDelete) {
            this.props.onDelete(filename, index);
        }
    },

    _download(filename, callback) {
        if (this.props.onFileClick) {
            this.props.onFileClick(filename, callback);
        }
    },

    _save(type) {
        let self = this;
        this.setState({loading: true});
        let edit = type == 'authors' ? true : false;
        if (this.props.onChange) {
            this.props.onChange(this.state.value, () => {
                let initialValue = JSON.stringify(this.state.value);
                self.setState({loading: false, edit: edit, initialValue: initialValue});
            });
        }
    },

    _cancel() {
        let value = JSON.parse(this.state.initialValue);
        this.setState({edit: false, value: value});
    }

});

export default ClickToEdit;