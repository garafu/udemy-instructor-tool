SELECT
	*
FROM
	transactions
WHERE
  user_name = $name
ORDER BY
	date asc