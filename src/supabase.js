import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ixyohowqjfuzrgalatjp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4eW9ob3dxamZ1enJnYWxhdGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MzEyODMsImV4cCI6MjA1OTEwNzI4M30.O8NrYmtfVMHwBm3yN-I_KUr5sXgB4ki3C91Z861HzCs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
