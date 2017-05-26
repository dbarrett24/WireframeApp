
UPDATE projects
	SET fav_wf = $2
	WHERE wf_id = $1
	RETURNING *;