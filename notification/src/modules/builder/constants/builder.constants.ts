export enum MAIL_TYPE {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export const MAIL_SUBJECT: Record<MAIL_TYPE, string> = {
  FORGOT_PASSWORD: 'Set new password',
};
export const MAIL_TEXT: Record<MAIL_TYPE, string> = {
  FORGOT_PASSWORD:
    'Hello,\n' +
    '\n' +
    'You requested to reset your password.  \n' +
    'Please use the link below to set a new one:\n' +
    '\n' +
    '{url}\n' +
    '\n' +
    'If you did not request this, please ignore this message.\n' +
    '\n' +
    'Best regards,  \n' +
    'The Support Team\n',
};
