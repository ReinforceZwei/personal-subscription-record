import { UserSetting } from "../services/pocketbase";

const defaultUserSettings: Partial<UserSetting> = {
    'default_page': 'spentRecord',
    'color_mode': 'system',
}

export default defaultUserSettings