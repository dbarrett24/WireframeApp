
UPDATE projects
	SET wf_name = $1,
			wf_text = $2,
			fav_wf = $3
	WHERE wf_id = $4;