const user_tokens_expires_in = {
    access_user_tokens_expires_in: '1h',
    refresh_user_tokens_expires_in: '1d'
}


const admin_tokens_expires_in = {
    access_tokens_expires_in: '1h',
    refresh_tokens_expires_in: '1d'
}


const otp_token_request_types = {
    RESET_PASSWORD: 'reset password',
    SIGNUP: 'signup'

}


module.exports = { user_tokens_expires_in, admin_tokens_expires_in, otp_token_request_types }