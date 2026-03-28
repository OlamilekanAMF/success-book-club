const bcrypt = require('bcryptjs');
const supabase = require('./src/config/supabase');

(async () => {
  try {
    const email = 'admin@triumphantbookclub.com';
    const plain = 'admin123';
    // Check if admin exists
    const { data: existing, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    // If no rows found, PostgREST returns PGRST116 - handle it by creating the admin
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Fetch error (admin lookup):', fetchError);
      process.exit(1);
    }

    if (!existing) {
      console.log('Admin user not found for email; creating new admin:', email);
      const { data: inserted, error: insertError } = await supabase
        .from('admin_users')
        .insert({
          email,
          password: await bcrypt.hash(plain, 10),
          name: 'Administrator',
          role: 'admin',
          is_active: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        process.exit(1);
      }

      console.log('Created admin user:', inserted.email);
      process.exit(0);
    }

    const hash = await bcrypt.hash(plain, 10);

    const { data, error } = await supabase
      .from('admin_users')
      .update({ password: hash })
      .eq('email', email)
      .select();

    if (error) {
      console.error('Supabase error (update):', error);
      process.exit(1);
    }

    console.log('Password reset for:', email);
    console.log('Updated rows:', data);
    process.exit(0);
  } catch (err) {
    console.error('Script error:', err);
    process.exit(2);
  }
})();