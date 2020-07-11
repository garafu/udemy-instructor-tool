INSERT INTO transactions (
  transaction_id,
  user_name,
  course_name,
  date,
  type,
  channel,
  vendor,
  coupon_code,
  paid_price,
  paid_currency,
  instructor_share
) VALUES (
  $transaction_id,
  $user_name,
  $course_name,
  $date,
  $type,
  $channel,
  $vendor,
  $coupon_code,
  $paid_price,
  $paid_currency,
  $instructor_share
);