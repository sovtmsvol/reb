// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pqeycviplpqewccmikvk.supabase.co'; // ← твій URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZXljdmlwbHBxZXdjY21pa3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNzA5ODcsImV4cCI6MjA2NTY0Njk4N30.Mzfx1-tNRAfLYpgpkBWN1kdWl3PScnfE98f9XCfNXWI'; // ← твій ключ

export const supabase = createClient(supabaseUrl, supabaseKey);
