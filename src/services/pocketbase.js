import PocketBase from 'pocketbase'

const PB_URL = 'https://pb.reinforce.moe'
const pocketbase = new PocketBase(PB_URL)

const USER_COL = 'users'
const SPENT_RECORD_COL = 'spentRecords'
const SPENT_TYPE_COL = 'spentTypes'
const SPENT_RECORD_NAME_COL = 'spentRecordNames'
const SPENT_SUM_BY_MONTH_COL = 'spentSumByMonth'
const PAYMENT_METHOD_COL = 'paymentMethods'
const USER_SETTINGS_COL = 'userSettings'

export {
    USER_COL,
    SPENT_RECORD_COL,
    SPENT_TYPE_COL,
    SPENT_RECORD_NAME_COL,
    SPENT_SUM_BY_MONTH_COL,
    PAYMENT_METHOD_COL,
    USER_SETTINGS_COL,
}

export default pocketbase