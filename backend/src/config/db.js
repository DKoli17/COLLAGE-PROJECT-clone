import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const connectDB = async () => {
  try {
    // Test the connection by making a simple query
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connected successfully');
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    // Supabase doesn't have a disconnect method like mongoose
    // The connection is managed automatically
    console.log('✅ Supabase connection closed');
  } catch (error) {
    console.error('❌ Failed to close Supabase connection:', error.message);
  }
};
