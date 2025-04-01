import { createClient } from '@supabase/supabase-js';

// 設置你的 Supabase URL 和 API 密鑰（從你的 Supabase 頁面獲取）
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
