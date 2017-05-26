const app = require('./server'), 
			db = app.get('db');

module.exports = {
  getProjects: (req, res) => {
  	let userId = [parseInt(req.params.id)];

    db.get_projects(userId, (err, projects) => {
      (!err) ? res.send(projects) : res.send(err);
    });
  },

  createProject: (req, res) => {
  	let newPro = [req.body.wf_name, req.body.wf_text, req.body.fav_wf, req.body.user_id];

  	db.create_project(newPro, (err, newProject) => {
  		(!err) ? res.send(newProject) : res.send(err);
  	});
  },

  updateProject: (req, res) => {
  	let newInfo = [req.body.wf_name, req.body.wf_text, req.body.fav_wf, req.body.wf_id];

  	db.update_project(newInfo, (err, updated) => {
  		(!err) ? res.send(updated) : res.send(err);
  	});
  },

  updateFav: (req, res) => {
    let isFav = [req.body.wf_id, req.body.fav_wf];

    db.update_fav(isFav, (err, newFav) => {
      (!err) ? res.send(newFav) : res.send(err);
    });
  },

  deleteProject: (req, res) => {
  	let proId = [parseInt(req.params.wf_id)];
    
  	db.delete_project(proId, (err, deleted) => {
  		(!err) ? res.send(deleted) : res.send(err);
  	});
  }

}