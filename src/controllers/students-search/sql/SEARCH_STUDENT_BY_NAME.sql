SELECT
	distinct user_name
FROM
	transactions
WHERE
  user_name like $name