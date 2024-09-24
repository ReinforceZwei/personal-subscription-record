import PocketBase from 'pocketbase'

const PB_URL = import.meta.env.VITE_PB_URL
console.log('PB_URL', PB_URL)
const pocketbase = new PocketBase(PB_URL)
pocketbase.autoCancellation(false)

export const USER_COL = 'users'
export const SPENT_RECORD_COL = 'spentRecords'
export const SPENT_TYPE_COL = 'spentTypes'
export const SPENT_RECORD_NAME_COL = 'spentRecordNames'
export const SPENT_SUM_BY_MONTH_COL = 'spentSumByMonth'
export const PAYMENT_METHOD_COL = 'paymentMethods'
export const USER_SETTINGS_COL = 'userSettings'
export const BUDGET_HISTORY_COL = 'budgetHistory'
export const SPENT_PRESET_COL = 'spentPresets'
export const SUBSCRIPTION_PLAN_COL = 'subscriptionPlans'
export const SPENT_SUM_BY_MONTH_TYPE_COL = 'spentSumByTypeMonth'

export default pocketbase