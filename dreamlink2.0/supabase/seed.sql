-- Insert a dummy user into auth.users if not already present
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at)
VALUES ('cdfca057-74f7-4ece-b4de-5f624611d200', 'dummy@example.com', '{}', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.dream_entries (user_id, title, content) VALUES
('cdfca057-74f7-4ece-b4de-5f624611d200', 'Dream Title 1', 'Content of the dream'),
('cdfca057-74f7-4ece-b4de-5f624611d200', 'Dream Title 2', 'Another dream content');