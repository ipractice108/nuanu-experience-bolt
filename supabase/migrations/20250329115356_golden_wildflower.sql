/*
  # Set up authentication and user management

  1. Enable email authentication
  2. Create user management functions
  3. Set up user roles
*/

-- Enable email auth provider
CREATE OR REPLACE FUNCTION auth.email_confirm(email_input text, token_input text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, pg_temp
AS $$
BEGIN
  -- Email confirmation is disabled by default
  RETURN;
END;
$$;

-- Create user management trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set default role if not provided
  IF NEW.raw_user_meta_data->>'role' IS NULL THEN
    NEW.raw_user_meta_data = jsonb_set(
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"member"'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to handle new users
CREATE OR REPLACE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create policy to allow users to update their own metadata
CREATE POLICY "Users can update own metadata"
  ON auth.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);