import PocketBase, { RecordModel } from 'pocketbase'

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

export interface SpentRecord extends RecordModel {
    name: string
    description?: string
    price: number
    type: string
    payment: string
    owned_by: string
}

export interface SpentType extends RecordModel {
    name: string
    color?: string
    icon?: string
    enabled: boolean
    weight: number
    budget_per_month: number
    default_payment?: string
    owned_by: string
}

export interface SpentRecordName extends RecordModel {
    name: string
    type: string
    count: number
    owned_by: string
}

export interface SpentSumByMonth extends RecordModel {
    price: string
    year_month: string
    owned_by: string
}

export interface PaymentMethod extends RecordModel {
    name: string
    owned_by: string
    color?: string
    icon?: string
    enabled: boolean
    weight: number
}

export interface UserSetting extends RecordModel {
    owned_by: string
    default_page: string
    color_mode: string
    budget_per_month: number
    fav_currency?: string[]
}

export interface BudgetHistory extends RecordModel {
    budget: number
    type: string
    year: number
    month: number
    owned_by: string
}

export interface SpentPreset extends RecordModel {
    name?: string
    description?: string
    price?: number
    payment?: string
    type?: string
    weight: number
    owned_by: string
}

export interface SubscriptionPlan extends RecordModel {
    name: string
    description?: string
    price: number
    renew_period_month: number
    active: boolean
    start_date?: string
    end_date?: string
    owned_by: string
    payment?: string
}

export interface SpentSumByTypeMonth extends RecordModel {
    price: number
    owned_by: string
    year_month: string
}