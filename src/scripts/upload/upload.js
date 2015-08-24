import scitran from '../utils/scitran';
import uploads from '../utils/upload';
import actions from './upload.actions';

export default {

    /**
     * Handle Upload Response
     *
     * A generic response handler for all upload
     * related requests.
     */
    handleUploadResponse (err, res, callback) {
        if (err) {
            actions.uploadError();
        } else {
            callback(err, res);
        }
    },

    /**
     * Upload File
     *
     * Pushes upload details into an upload queue.
     */
    uploadFile (level, id, file, tag) {
        let url = level + '/' + id + '/file/' + file.name;
        uploads.add({url: url, file: file, tag: tag, progressStart: this.progressStart, progressEnd: this.progressEnd});
    },

    /**
     * Current Files
     *
     * An array of file names that are currently being uploaded.
     */
    currentFiles: [],

    /**
     * Upload
     *
     * Takes an entire bids file tree and and file count
     * and recurses through and uploads all the files.
     * Additionally takes a progress callback that gets
     * updated at the start and end of every file or
     * folder upload request.
     */
    upload (userId, fileTree, count, progress) {
        let self = this;
        self.completed = 0;
        self.count = count;
        self.progressStart = function (filename) {
            self.currentFiles.push(filename);
            progress({total: self.count, completed: self.completed, currentFiles: self.currentFiles});
        }
        self.progressEnd = function (filename) {
            let index = self.currentFiles.indexOf(filename);
            self.currentFiles.splice(index, 1);
            self.completed++;
            progress({total: self.count, completed: self.completed, currentFiles: self.currentFiles});
        }
        
        let existingProjectId = null;
        scitran.getProjects(function (projects) {
            for (let project of projects) {
                if (project.name === fileTree[0].name && project.group === userId) {
                    existingProjectId = project._id;
                    break;
                }
            }

            if (existingProjectId) {
                scitran.getBIDSDataset(existingProjectId, function (oldDataset) {
                    let newDataset = fileTree[0];
                    let oldDataset = oldDataset[0];
                    self.progressEnd();
                    self.resumeSubjects(newDataset.children, oldDataset.children, existingProjectId);
                });
            } else {
                scitran.createProject(userId, fileTree[0].name, function (err, res) {
                    self.handleUploadResponse(err, res, function () {
                        let projectId = res.body._id;
                        self.progressEnd();
                        self.uploadSubjects(fileTree[0].children, projectId);
                    });
                });
            }

        });
    },

    /**
     * Upload Subjects
     *
     */
    uploadSubjects (subjects, projectId) {
        let self = this;
        for (let subject of subjects) {
            if (subject.children && subject.children.length > 0) {
                self.progressStart(subject.name);
                scitran.createSubject(projectId, subject.name, function (err, res, name) {
                    self.handleUploadResponse(err, res, function () {
                        self.progressEnd(res.req._data.name);
                        let subjectId = res.body._id;
                        self.uploadSessions(subject.children, projectId, subjectId);
                    });
                });
            } else {
                self.uploadFile('projects', projectId, subject, 'project');
            }
        }
    },

    /**
     * Resume Subjects
     *
     */
    resumeSubjects (newSubjects, oldSubjects, projectId) {
        let subjectUploads = [];
        for (let i = 0; i < newSubjects.length; i++) {
            let newSubject = newSubjects[i];
            let oldSubject = this.contains(oldSubjects, newSubject);
            if (oldSubject) {
                this.progressStart(newSubject.name);
                this.progressEnd(newSubject.name);
                if (newSubject.type === 'folder') {
                    this.resumeSessions(newSubject.children, oldSubject.children, projectId, oldSubject._id);
                }
            } else {
                subjectUploads.push(newSubject);
            }
        }
        if (subjectUploads.length > 0) {
            this.uploadSubjects(subjectUploads, projectId);
        }
    },

    /**
     * Upload Sessions
     *
     */
    uploadSessions (sessions, projectId, subjectId) {
        let self = this;
        for (let session of sessions) {
            if (session.children && session.children.length > 0) {
                self.progressStart(session.name);
                scitran.createSession(projectId, subjectId, session.name, function (err, res, name) {
                    self.handleUploadResponse(err, res, function () {
                        self.progressEnd(res.req._data.name);
                        self.uploadModalities(session.children, res.body._id);
                    });
                }); 
            } else {
                self.uploadFile('sessions', subjectId, session, 'subject');
            }
        }
    },

    /**
     * Resume Sessions
     *
     */
    resumeSessions (newSessions, oldSessions, projectId, subjectId) {
        let sessionUploads = [];
        for (let i = 0; i < newSessions.length; i++) {
            let newSession = newSessions[i];
            let oldSession = this.contains(oldSessions, newSession);
            if (oldSession) {
                this.progressStart(newSession.name);
                this.progressEnd(newSession.name);
                if (newSession.type === 'folder') {
                    this.resumeModalities(newSession.children, oldSession.children, oldSession._id);
                }
            } else {
                sessionUploads.push(newSession);
            }
        }
        if (sessionUploads.length > 0) {
            this.uploadSessions(sessionUploads, projectId, subjectId);
        }
    },

    /**
     * Upload Modalities
     *
     */
    uploadModalities (modalities, subjectId) {
        let self = this;
        for (let modality of modalities) {
            if (modality.children && modality.children.length > 0) {
                self.progressStart(modality.name);
                scitran.createModality(subjectId, modality.name, function (err, res, name) {
                    self.handleUploadResponse(err, res, function () {
                        self.progressEnd(res.req._data.name);
                        let modalityId = res.body._id;
                        self.uploadAcquisitions(modality.children, modalityId);
                    });
                });
            } else {
                self.uploadFile('sessions', subjectId, modality, 'session');
            }
        }
    },

    /**
     * Resume Modalities
     *
     */
    resumeModalities (newModalities, oldModalities, subjectId) {
        let modalityUploads = [];
        for (let i = 0; i < newModalities.length; i++) {
            let newModality = newModalities[i];
            let oldModality = this.contains(oldModalities, newModality);
            if (oldModality) {
                this.progressStart(newModality.name);
                this.progressEnd(newModality.name);
                if (newModality.type === 'folder') {
                    this.resumeAcquisitions(newModality.children, oldModality.children, oldModality._id);
                }
            } else {
                modalityUploads.push(newModality);
            }
        }
        if (modalityUploads.length > 0) {
            this.uploadModalities(modalityUploads, subjectId);
        }
    },

    /**
     * Upload Acquisitions
     *
     */
    uploadAcquisitions (acquisitions, modalityId) {
        for (let acquisition of acquisitions) {
            this.uploadFile('acquisitions', modalityId, acquisition, 'modality');
        }
    },

    /**
     * Resume Acquisitions
     *
     */
    resumeAcquisitions (newAcquisitions, oldAcquisitions, modalityId) {
        let acquisitionUploads = [];
        for (let i = 0; i < newAcquisitions.length; i++) {
            let newAcquisition = newAcquisitions[i];
            let oldAcquisition = this.contains(oldAcquisitions, newAcquisition);
            if (oldAcquisition) {
                this.progressStart(newAcquisition.name);
                this.progressEnd(newAcquisition.name);
            } else {
                acquisitionUploads.push(newAcquisition);
            }
        }
        if (acquisitionUploads.length > 0) {
            this.uploadAcquisitions(acquisitionUploads, modalityId);
        }
    },

    /**
     * Contains
     *
     * Takes an array of container children and
     * an element. Checks if the element already
     * exists in the array and return the match
     * from the array.
     */
    contains (arr, elem) {
        let match = null;
        for (let i = 0; i < arr.length; i++) {
            let arrayElem = arr[i];
            if (arrayElem.name === elem.name) {
                match = arrayElem;
            }
        }
        return match;
    }

};