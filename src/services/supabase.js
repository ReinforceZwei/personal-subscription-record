import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://idhzgwfyteaxgmlswfmn.supabase.co'
const SUPABASE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaHpnd2Z5dGVheGdtbHN3Zm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIxMzQ2ODQsImV4cCI6MjAyNzcxMDY4NH0.YdqbySoEI2RodItb9tYa4_BFQAut_xmAudNUXIzQfnk'

export const supabase = createClient(SUPABASE_URL, SUPABASE_TOKEN)

export const SPENT_RECORD_COL = 'spentRecords'
export const SPENT_TYPE_COL = 'spentTypes'
export const SPENT_RECORD_NAME_COL = 'spentRecordNames'
export const PAYMENT_METHOD_COL = 'paymentMethods'
export const USER_SETTINGS_COL = 'userSettings'
export const BUDGET_HISTORY_COL = 'budgetHistory'
export const SPENT_PRESET_COL = 'spentPresets'
export const SUBSCRIPTION_PLAN_COL = 'subscriptionPlans'