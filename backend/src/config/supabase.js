const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: __dirname + '/../../.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase URL or Anon Key not configured!');
  console.log('Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

module.exports = supabase;
