-- Church Notes App - Initial Database Schema
-- Run this in your Supabase SQL editor

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  preferences jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- SERIES
-- ============================================
create table if not exists public.series (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text,
  start_date date,
  end_date date,
  cover_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_series_user on public.series(user_id);

-- ============================================
-- SERMON NOTES
-- ============================================
create table if not exists public.sermon_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null default 'Untitled Sermon',
  date timestamptz default now(),
  speaker text,
  content jsonb default '{}'::jsonb,
  plain_text text default '',
  series_id uuid references public.series on delete set null,
  series_order integer,
  is_favorite boolean default false,
  is_archived boolean default false,
  client_id text unique,
  sync_version integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_sermon_notes_user_date on public.sermon_notes(user_id, date desc);
create index idx_sermon_notes_user_speaker on public.sermon_notes(user_id, speaker);
create index idx_sermon_notes_user_series on public.sermon_notes(user_id, series_id);
create index idx_sermon_notes_user_favorite on public.sermon_notes(user_id, is_favorite);

-- ============================================
-- SCRIPTURE REFERENCES
-- ============================================
create table if not exists public.scripture_references (
  id uuid default gen_random_uuid() primary key,
  note_id uuid references public.sermon_notes on delete cascade not null,
  book text not null,
  chapter integer not null,
  verse_start integer not null,
  verse_end integer,
  translation text default 'KJV',
  full_text text
);

create index idx_scripture_refs_note on public.scripture_references(note_id);
create index idx_scripture_refs_book on public.scripture_references(book, chapter, verse_start);

-- ============================================
-- QUICK CAPTURES
-- ============================================
create table if not exists public.quick_captures (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  note_id uuid references public.sermon_notes on delete set null,
  text text not null,
  is_processed boolean default false,
  created_at timestamptz default now()
);

create index idx_quick_captures_user on public.quick_captures(user_id, created_at desc);

-- ============================================
-- NOTE SUMMARIES (AI)
-- ============================================
create table if not exists public.note_summaries (
  id uuid default gen_random_uuid() primary key,
  note_id uuid references public.sermon_notes on delete cascade not null unique,
  summary text not null,
  key_takeaways jsonb default '[]'::jsonb,
  themes jsonb default '[]'::jsonb,
  application_prompts jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- ACTION ITEMS
-- ============================================
create table if not exists public.action_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  note_id uuid references public.sermon_notes on delete set null,
  text text not null,
  is_completed boolean default false,
  completed_at timestamptz,
  due_date timestamptz,
  created_at timestamptz default now()
);

create index idx_action_items_user on public.action_items(user_id, is_completed);

-- ============================================
-- PRAYER ITEMS
-- ============================================
create table if not exists public.prayer_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  note_id uuid references public.sermon_notes on delete set null,
  text text not null,
  is_answered boolean default false,
  answered_at timestamptz,
  answered_note text,
  created_at timestamptz default now()
);

create index idx_prayer_items_user on public.prayer_items(user_id, is_answered);

-- ============================================
-- MEMORY VERSES
-- ============================================
create table if not exists public.memory_verses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  reference text not null,
  text text not null,
  translation text default 'KJV',
  reminder_time text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create index idx_memory_verses_user on public.memory_verses(user_id, is_active);

-- ============================================
-- BOOKMARKS
-- ============================================
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  note_id uuid references public.sermon_notes on delete cascade not null,
  label text,
  position integer not null,
  color text default 'yellow',
  created_at timestamptz default now()
);

create index idx_bookmarks_note on public.bookmarks(note_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.series enable row level security;
alter table public.sermon_notes enable row level security;
alter table public.scripture_references enable row level security;
alter table public.quick_captures enable row level security;
alter table public.note_summaries enable row level security;
alter table public.action_items enable row level security;
alter table public.prayer_items enable row level security;
alter table public.memory_verses enable row level security;
alter table public.bookmarks enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Series: users can CRUD their own series
create policy "Users can view own series" on public.series for select using (auth.uid() = user_id);
create policy "Users can create series" on public.series for insert with check (auth.uid() = user_id);
create policy "Users can update own series" on public.series for update using (auth.uid() = user_id);
create policy "Users can delete own series" on public.series for delete using (auth.uid() = user_id);

-- Sermon Notes: users can CRUD their own notes
create policy "Users can view own notes" on public.sermon_notes for select using (auth.uid() = user_id);
create policy "Users can create notes" on public.sermon_notes for insert with check (auth.uid() = user_id);
create policy "Users can update own notes" on public.sermon_notes for update using (auth.uid() = user_id);
create policy "Users can delete own notes" on public.sermon_notes for delete using (auth.uid() = user_id);

-- Scripture References: accessible if user owns the note
create policy "Users can view own scripture refs" on public.scripture_references
  for select using (exists (select 1 from public.sermon_notes where id = note_id and user_id = auth.uid()));
create policy "Users can create scripture refs" on public.scripture_references
  for insert with check (exists (select 1 from public.sermon_notes where id = note_id and user_id = auth.uid()));
create policy "Users can update own scripture refs" on public.scripture_references
  for update using (exists (select 1 from public.sermon_notes where id = note_id and user_id = auth.uid()));
create policy "Users can delete own scripture refs" on public.scripture_references
  for delete using (exists (select 1 from public.sermon_notes where id = note_id and user_id = auth.uid()));

-- Quick Captures
create policy "Users can view own captures" on public.quick_captures for select using (auth.uid() = user_id);
create policy "Users can create captures" on public.quick_captures for insert with check (auth.uid() = user_id);
create policy "Users can update own captures" on public.quick_captures for update using (auth.uid() = user_id);
create policy "Users can delete own captures" on public.quick_captures for delete using (auth.uid() = user_id);

-- Note Summaries: accessible if user owns the note
create policy "Users can view own summaries" on public.note_summaries
  for select using (exists (select 1 from public.sermon_notes where id = note_id and user_id = auth.uid()));
create policy "Users can create summaries" on public.note_summaries
  for insert with check (exists (select 1 from public.sermon_notes where id = note_id and user_id = auth.uid()));
create policy "Users can update own summaries" on public.note_summaries
  for update using (exists (select 1 from public.sermon_notes where id = note_id and user_id = auth.uid()));

-- Action Items
create policy "Users can view own actions" on public.action_items for select using (auth.uid() = user_id);
create policy "Users can create actions" on public.action_items for insert with check (auth.uid() = user_id);
create policy "Users can update own actions" on public.action_items for update using (auth.uid() = user_id);
create policy "Users can delete own actions" on public.action_items for delete using (auth.uid() = user_id);

-- Prayer Items
create policy "Users can view own prayers" on public.prayer_items for select using (auth.uid() = user_id);
create policy "Users can create prayers" on public.prayer_items for insert with check (auth.uid() = user_id);
create policy "Users can update own prayers" on public.prayer_items for update using (auth.uid() = user_id);
create policy "Users can delete own prayers" on public.prayer_items for delete using (auth.uid() = user_id);

-- Memory Verses
create policy "Users can view own verses" on public.memory_verses for select using (auth.uid() = user_id);
create policy "Users can create verses" on public.memory_verses for insert with check (auth.uid() = user_id);
create policy "Users can update own verses" on public.memory_verses for update using (auth.uid() = user_id);
create policy "Users can delete own verses" on public.memory_verses for delete using (auth.uid() = user_id);

-- Bookmarks: accessible if user owns the note
create policy "Users can view own bookmarks" on public.bookmarks
  for select using (exists (select 1 from public.sermon_notes where id = note_id and user_id = auth.uid()));
create policy "Users can create bookmarks" on public.bookmarks
  for insert with check (exists (select 1 from public.sermon_notes where id = note_id and user_id = auth.uid()));
create policy "Users can delete own bookmarks" on public.bookmarks
  for delete using (exists (select 1 from public.sermon_notes where id = note_id and user_id = auth.uid()));
