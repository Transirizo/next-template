-- 数据库模板，确保该文件能够直接生成数据库
create table samples (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    created_at timestamp with time zone default now()
);


-- 插入示例数据
-- 账户 1@1.cc 密码 1
insert into auth.users (id, email, encrypted_password) values ('445c6c53-fc44-462f-8123-0d86239c0a32','1@1.cc', '$2a$10$ih0BhXgZVYDlw1A3XxXR2.nMucnCA19AyjujHJ9RYce.KTHP3Nqja');
insert into samples (name) values ('test');
