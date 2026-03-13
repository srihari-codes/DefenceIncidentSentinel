const { createClient } = require('@supabase/supabase-js');

let supabase;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.warn('[Supabase] SUPABASE_URL/SUPABASE_KEY not set. Using no-op storage client.');
  supabase = {
    storage: {
      from: () => ({
        upload: async () => ({
          data: null,
          error: { message: 'Supabase is not configured in this environment' }
        })
      })
    }
  };
} else {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
}

module.exports = supabase;
