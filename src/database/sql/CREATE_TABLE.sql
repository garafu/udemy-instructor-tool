CREATE TABLE IF NOT EXISTS students (
  id integer primary key autoincrement,
  name text
);

CREATE TABLE IF NOT EXISTS courses (
  id integer primary key autoincrement,
  name text
);

CREATE TABLE IF NOT EXISTS transactions (
  id integer primary key autoincrement,
  transaction_id integer,
  user_name text,
  course_name text,
  date text,
  type text,
  channel text,
  vendor text,
  coupon_code text,
  paid_price real,
  paid_currency text,
  instructor_share real
);
CREATE INDEX IF NOT EXISTS idx_transactions_01 ON transactions (user_name);