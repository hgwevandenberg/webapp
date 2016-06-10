// TODO: move all of these into a STREAM object
export const ADD_NEW_IDS_TO_RESULT = 'ADD_NEW_IDS_TO_RESULT'
export const HEAD = 'HEAD'
export const HEAD_REQUEST = 'HEAD_REQUEST'
export const HEAD_SUCCESS = 'HEAD_SUCCESS'
export const HEAD_FAILURE = 'HEAD_FAILURE'
export const LOAD_STREAM = 'LOAD_STREAM'
export const LOAD_STREAM_REQUEST = 'LOAD_STREAM_REQUEST'
export const LOAD_STREAM_SUCCESS = 'LOAD_STREAM_SUCCESS'
export const LOAD_STREAM_FAILURE = 'LOAD_STREAM_FAILURE'
export const LOAD_NEXT_CONTENT = 'LOAD_NEXT_CONTENT'
export const LOAD_NEXT_CONTENT_REQUEST = 'LOAD_NEXT_CONTENT_REQUEST'
export const LOAD_NEXT_CONTENT_SUCCESS = 'LOAD_NEXT_CONTENT_SUCCESS'
export const LOAD_NEXT_CONTENT_FAILURE = 'LOAD_NEXT_CONTENT_FAILURE'

// Should these be `POST.JSON, POST.FORM` instead?
export const POST_JSON = 'POST_JSON'
export const POST_FORM = 'POST_FORM'
export const SET_LAYOUT_MODE = 'SET_LAYOUT_MODE'


export const REQUESTER = {
  PAUSE: 'REQUESTER.PAUSE',
  UNPAUSE: 'REQUESTER.UNPAUSE',
}

export const ALERT = {
  OPEN: 'ALERT.OPEN',
  CLOSE: 'ALERT.CLOSE',
}

export const AUTHENTICATION = {
  FORGOT_PASSWORD: 'AUTHENTICATION.FORGOT_PASSWORD',
  CLEAR_STORE: 'AUTHENTICATION.CLEAR_STORE',
  SCHEDULE_REFRESH: 'AUTHENTICATION.SCHEDULE_REFRESH',
  CANCEL_REFRESH: 'AUTHENTICATION.CANCEL_REFRESH',
  LOGOUT: 'AUTHENTICATION.LOGOUT',
  LOGOUT_SUCCESS: 'AUTHENTICATION.LOGOUT_SUCCESS',
  LOGOUT_FAILURE: 'AUTHENTICATION.LOGOUT_FAILURE',
  REFRESH: 'AUTHENTICATION.REFRESH',
  REFRESH_REQUEST: 'AUTHENTICATION.REFRESH_REQUEST',
  REFRESH_SUCCESS: 'AUTHENTICATION.REFRESH_SUCCESS',
  REFRESH_FAILURE: 'AUTHENTICATION.REFRESH_FAILURE',
  SIGN_IN: 'AUTHENTICATION.SIGN_IN',
  USER: 'AUTHENTICATION.USER',
  USER_REQUEST: 'AUTHENTICATION.USER_REQUEST',
  USER_SUCCESS: 'AUTHENTICATION.USER_SUCCESS',
  USER_FAILURE: 'AUTHENTICATION.USER_FAILURE',
}

export const COMMENT = {
  CREATE: 'COMMENT.CREATE',
  CREATE_REQUEST: 'COMMENT.CREATE_REQUEST',
  CREATE_SUCCESS: 'COMMENT.CREATE_SUCCESS',
  CREATE_FAILURE: 'COMMENT.CREATE_FAILURE',
  DELETE: 'COMMENT.DELETE',
  DELETE_REQUEST: 'COMMENT.DELETE_REQUEST',
  DELETE_SUCCESS: 'COMMENT.DELETE_SUCCESS',
  DELETE_FAILURE: 'COMMENT.DELETE_FAILURE',
  EDITABLE: 'COMMENT.EDITABLE',
  EDITABLE_REQUEST: 'COMMENT.EDITABLE_REQUEST',
  EDITABLE_SUCCESS: 'COMMENT.EDITABLE_SUCCESS',
  EDITABLE_FAILURE: 'COMMENT.EDITABLE_FAILURE',
  FLAG: 'COMMENT.FLAG',
  FLAG_REQUEST: 'COMMENT.FLAG_REQUEST',
  FLAG_SUCCESS: 'COMMENT.FLAG_SUCCESS',
  FLAG_FAILURE: 'COMMENT.FLAG_FAILURE',
  UPDATE: 'COMMENT.UPDATE',
  UPDATE_REQUEST: 'COMMENT.UPDATE_REQUEST',
  UPDATE_SUCCESS: 'COMMENT.UPDATE_SUCCESS',
  UPDATE_FAILURE: 'COMMENT.UPDATE_FAILURE',
  TOGGLE_EDITING: 'COMMENT.TOGGLE_EDITING',
}

export const EDITOR = {
  ADD_BLOCK: 'EDITOR.ADD_BLOCK',
  ADD_DRAG_BLOCK: 'EDITOR.ADD_DRAG_BLOCK',
  REMOVE_DRAG_BLOCK: 'EDITOR.REMOVE_DRAG_BLOCK',
  ADD_EMPTY_TEXT_BLOCK: 'EDITOR.ADD_EMPTY_TEXT_BLOCK',
  APPEND_TEXT: 'EDITOR.APPEND_TEXT',
  CLEAR_AUTO_COMPLETERS: 'EDITOR.CLEAR_AUTO_COMPLETERS',
  EMOJI_COMPLETER: 'EDITOR.EMOJI_COMPLETER',
  EMOJI_COMPLETER_REQUEST: 'EDITOR.EMOJI_COMPLETER_REQUEST',
  EMOJI_COMPLETER_SUCCESS: 'EDITOR.EMOJI_COMPLETER_SUCCESS',
  EMOJI_COMPLETER_FAILURE: 'EDITOR.EMOJI_COMPLETER_FAILURE',
  INITIALIZE: 'EDITOR.INITIALIZE',
  LOAD_REPLY_ALL: 'EDITOR.LOAD_REPLY_ALL',
  LOAD_REPLY_ALL_REQUEST: 'EDITOR.LOAD_REPLY_ALL_REQUEST',
  LOAD_REPLY_ALL_SUCCESS: 'EDITOR.LOAD_REPLY_ALL_SUCCESS',
  LOAD_REPLY_ALL_FAILURE: 'EDITOR.LOAD_REPLY_ALL_FAILURE',
  // used for previewing an embed
  POST_PREVIEW: 'EDITOR.POST_PREVIEW',
  POST_PREVIEW_REQUEST: 'EDITOR.POST_PREVIEW_REQUEST',
  POST_PREVIEW_SUCCESS: 'EDITOR.POST_PREVIEW_SUCCESS',
  POST_PREVIEW_FAILURE: 'EDITOR.POST_PREVIEW_FAILURE',
  REORDER_BLOCKS: 'EDITOR.REORDER_BLOCKS',
  REMOVE_BLOCK: 'EDITOR.REMOVE_BLOCK',
  REPLACE_TEXT: 'EDITOR.REPLACE_TEXT',
  RESET: 'EDITOR.RESET',
  // kicks off a post image upload
  SAVE_ASSET: 'EDITOR.SAVE_ASSET',
  // actually saves the image to s3
  SAVE_IMAGE: 'EDITOR.SAVE_IMAGE',
  SAVE_IMAGE_REQUEST: 'EDITOR.SAVE_IMAGE_REQUEST',
  SAVE_IMAGE_SUCCESS: 'EDITOR.SAVE_IMAGE_SUCCESS',
  SAVE_IMAGE_FAILURE: 'EDITOR.SAVE_IMAGE_FAILURE',
  // Editor tool states
  SET_IS_COMPLETER_ACTIVE: 'EDITOR.SET_IS_COMPLETER_ACTIVE',
  SET_IS_TEXT_TOOLS_ACTIVE: 'EDITOR.SET_IS_TEXT_TOOLS_ACTIVE',
  SET_TEXT_TOOLS_COORDINATES: 'EDITOR.SET_TEXT_TOOLS_COORDINATES',
  // fires after the objectURL is created
  TMP_IMAGE_CREATED: 'EDITOR.TMP_IMAGE_CREATED',
  UPDATE_BLOCK: 'EDITOR.UPDATE_BLOCK',
  USER_COMPLETER: 'EDITOR.USER_COMPLETER',
  USER_COMPLETER_REQUEST: 'EDITOR.USER_COMPLETER_REQUEST',
  USER_COMPLETER_SUCCESS: 'EDITOR.USER_COMPLETER_SUCCESS',
  USER_COMPLETER_FAILURE: 'EDITOR.USER_COMPLETER_FAILURE',
}

export const GUI = {
  BIND_DISCOVER_KEY: 'DISCOVER.BIND_DISCOVER_KEY',
  NOTIFICATIONS_TAB: 'GUI.NOTIFICATIONS_TAB',
  SET_ACTIVE_USER_FOLLOWING_TYPE: 'GUI.SET_ACTIVE_USER_FOLLOWING_TYPE',
  SET_IS_OFFSET_LAYOUT: 'GUI.SET_IS_OFFSET_LAYOUT',
  SET_IS_PROFILE_MENU_ACTIVE: 'GUI.SET_IS_PROFILE_MENU_ACTIVE',
  SET_LAST_DISCOVER_BEACON_VERSION: 'GUI.SET_LAST_DISCOVER_BEACON_VERSION',
  SET_LAST_FOLLOWING_BEACON_VERSION: 'GUI.SET_LAST_FOLLOWING_BEACON_VERSION',
  SET_LAST_STARRED_BEACON_VERSION: 'GUI.SET_LAST_STARRED_BEACON_VERSION',
  SET_SCROLL_STATE: 'GUI.SET_SCROLL_STATE',
  SET_SCROLL: 'GUI.SET_SCROLL',
  SET_VIEWPORT_SIZE_ATTRIBUTES: 'GUI.SET_VIEWPORT_SIZE_ATTRIBUTES',
  TOGGLE_NOTIFICATIONS: 'GUI.TOGGLE_NOTIFICATIONS',
}

export const INVITATIONS = {
  GET_EMAIL: 'INVITATIONS.GET_EMAIL',
  GET_EMAIL_REQUEST: 'INVITATIONS.GET_EMAIL_REQUEST',
  GET_EMAIL_SUCCESS: 'INVITATIONS.GET_EMAIL_SUCCESS',
  GET_EMAIL_FAILURE: 'INVITATIONS.GET_EMAIL_FAILURE',
  INVITE: 'INVITATIONS.INVITE',
  INVITE_REQUEST: 'INVITATIONS.INVITE_REQUEST',
  INVITE_SUCCESS: 'INVITATIONS.INVITE_SUCCESS',
  INVITE_FAILURE: 'INVITATIONS.INVITE_FAILURE',
}

export const MODAL = {
  OPEN: 'MODAL.OPEN',
  CLOSE: 'MODAL.CLOSE',
}

export const OMNIBAR = {
  OPEN: 'OMNIBAR.OPEN',
  CLOSE: 'OMNIBAR.CLOSE',
}

export const POST = {
  COMMENT: 'POST.COMMENT',
  COMMENT_REQUEST: 'POST.COMMENT_REQUEST',
  COMMENT_SUCCESS: 'POST.COMMENT_SUCCESS',
  COMMENT_FAILURE: 'POST.COMMENT_FAILURE',
  CREATE: 'POST.CREATE',
  CREATE_REQUEST: 'POST.CREATE_REQUEST',
  CREATE_SUCCESS: 'POST.CREATE_SUCCESS',
  CREATE_FAILURE: 'POST.CREATE_FAILURE',
  DELETE: 'POST.DELETE',
  DELETE_REQUEST: 'POST.DELETE_REQUEST',
  DELETE_SUCCESS: 'POST.DELETE_SUCCESS',
  DELETE_FAILURE: 'POST.DELETE_FAILURE',
  DETAIL: 'POST.DETAIL',
  DETAIL_REQUEST: 'POST.DETAIL_REQUEST',
  DETAIL_SUCCESS: 'POST.DETAIL_SUCCESS',
  DETAIL_FAILURE: 'POST.DETAIL_FAILURE',
  EDITABLE: 'POST.EDITABLE',
  EDITABLE_REQUEST: 'POST.EDITABLE_REQUEST',
  EDITABLE_SUCCESS: 'POST.EDITABLE_SUCCESS',
  EDITABLE_FAILURE: 'POST.EDITABLE_FAILURE',
  FLAG: 'POST.FLAG',
  FLAG_REQUEST: 'POST.FLAG_REQUEST',
  FLAG_SUCCESS: 'POST.FLAG_SUCCESS',
  FLAG_FAILURE: 'POST.FLAG_FAILURE',
  LOVE: 'POST.LOVE',
  LOVE_REQUEST: 'POST.LOVE_REQUEST',
  LOVE_SUCCESS: 'POST.LOVE_SUCCESS',
  LOVE_FAILURE: 'POST.LOVE_FAILURE',
  PERSIST: 'POST.PERSIST',
  UPDATE: 'POST.UPDATE',
  UPDATE_REQUEST: 'POST.UPDATE_REQUEST',
  UPDATE_SUCCESS: 'POST.UPDATE_SUCCESS',
  UPDATE_FAILURE: 'POST.UPDATE_FAILURE',
  TOGGLE_COMMENTS: 'POST.TOGGLE_COMMENTS',
  TOGGLE_EDITING: 'POST.TOGGLE_EDITING',
  TOGGLE_LOVERS: 'POST.TOGGLE_LOVERS',
  TOGGLE_REPOSTERS: 'POST.TOGGLE_REPOSTERS',
  TOGGLE_REPOSTING: 'POST.TOGGLE_REPOSTING',
}

export const PROFILE = {
  AVAILABILITY: 'PROFILE.AVAILABILITY',
  AVAILABILITY_REQUEST: 'PROFILE.AVAILABILITY_REQUEST',
  AVAILABILITY_SUCCESS: 'PROFILE.AVAILABILITY_SUCCESS',
  AVAILABILITY_FAILURE: 'PROFILE.AVAILABILITY_FAILURE',
  DELETE: 'PROFILE.DELETE',
  DELETE_REQUEST: 'PROFILE.DELETE_REQUEST',
  DELETE_SUCCESS: 'PROFILE.DELETE_SUCCESS',
  DELETE_FAILURE: 'PROFILE.DELETE_FAILURE',
  DETAIL: 'PROFILE.DETAIL',
  DETAIL_REQUEST: 'PROFILE.DETAIL_REQUEST',
  DETAIL_SUCCESS: 'PROFILE.DETAIL_SUCCESS',
  DETAIL_FAILURE: 'PROFILE.DETAIL_FAILURE',
  EXPORT: 'PROFILE.EXPORT',
  EXPORT_REQUEST: 'PROFILE.EXPORT_REQUEST',
  EXPORT_SUCCESS: 'PROFILE.EXPORT_SUCCESS',
  EXPORT_FAILURE: 'PROFILE.EXPORT_FAILURE',
  LOAD: 'PROFILE.LOAD',
  LOAD_REQUEST: 'PROFILE.LOAD_REQUEST',
  LOAD_SUCCESS: 'PROFILE.LOAD_SUCCESS',
  LOAD_FAILURE: 'PROFILE.LOAD_FAILURE',
  REGISTER_FOR_GCM: 'PROFILE.REGISTER_FOR_GCM',
  REGISTER_FOR_GCM_REQUEST: 'PROFILE.REGISTER_FOR_GCM_REQUEST',
  REGISTER_FOR_GCM_SUCCESS: 'PROFILE.REGISTER_FOR_GCM_SUCCESS',
  REGISTER_FOR_GCM_FAILURE: 'PROFILE.REGISTER_FOR_GCM_FAILURE',
  REQUEST_INVITE: 'PROFILE.REQUEST_INVITE',
  REQUEST_INVITE_REQUEST: 'PROFILE.REQUEST_INVITE_REQUEST',
  REQUEST_INVITE_SUCCESS: 'PROFILE.REQUEST_INVITE_SUCCESS',
  REQUEST_INVITE_FAILURE: 'PROFILE.REQUEST_INVITE_FAILURE',
  REQUEST_PUSH_SUBSCRIPTION: 'REQUEST_PUSH_SUBSCRIPTION',
  SAVE: 'PROFILE.SAVE',
  SAVE_REQUEST: 'PROFILE.SAVE_REQUEST',
  SAVE_SUCCESS: 'PROFILE.SAVE_SUCCESS',
  SAVE_FAILURE: 'PROFILE.SAVE_FAILURE',
  SAVE_AVATAR: 'PROFILE.SAVE_AVATAR',
  SAVE_AVATAR_REQUEST: 'PROFILE.SAVE_AVATAR_REQUEST',
  SAVE_AVATAR_SUCCESS: 'PROFILE.SAVE_AVATAR_SUCCESS',
  SAVE_AVATAR_FAILURE: 'PROFILE.SAVE_AVATAR_FAILURE',
  SAVE_COVER: 'PROFILE.SAVE_COVER',
  SAVE_COVER_REQUEST: 'PROFILE.SAVE_COVER_REQUEST',
  SAVE_COVER_SUCCESS: 'PROFILE.SAVE_COVER_SUCCESS',
  SAVE_COVER_FAILURE: 'PROFILE.SAVE_COVER_FAILURE',
  SIGNUP: 'PROFILE.SIGNUP',
  SIGNUP_SUCCESS: 'PROFILE.SIGNUP_SUCCESS',
  TMP_AVATAR_CREATED: 'PROFILE.TMP_AVATAR_CREATED',
  TMP_COVER_CREATED: 'PROFILE.TMP_COVER_CREATED',
  UNREGISTER_FOR_GCM: 'PROFILE.UNREGISTER_FOR_GCM',
  UNREGISTER_FOR_GCM_REQUEST: 'PROFILE.UNREGISTER_FOR_GCM_REQUEST',
  UNREGISTER_FOR_GCM_SUCCESS: 'PROFILE.UNREGISTER_FOR_GCM_SUCCESS',
  UNREGISTER_FOR_GCM_FAILURE: 'PROFILE.UNREGISTER_FOR_GCM_FAILURE',
}

export const RELATIONSHIPS = {
  BATCH_UPDATE_INTERNAL: 'RELATIONSHIPS.BATCH_UPDATE_INTERNAL',
  UPDATE_INTERNAL: 'RELATIONSHIPS.UPDATE_INTERNAL',
  UPDATE: 'RELATIONSHIPS.UPDATE',
  UPDATE_REQUEST: 'RELATIONSHIPS.UPDATE_REQUEST',
  UPDATE_SUCCESS: 'RELATIONSHIPS.UPDATE_SUCCESS',
  UPDATE_FAILURE: 'RELATIONSHIPS.UPDATE_FAILURE',
}

export const TRACK = {
  EVENT: 'TRACK.EVENT',
}

export const USER = {
  FLAG: 'USER.FLAG',
  FLAG_REQUEST: 'USER.FLAG_REQUEST',
  FLAG_SUCCESS: 'USER.FLAG_SUCCESS',
  FLAG_FAILURE: 'USER.FLAG_FAILURE',
}

export const ZEROS = {
  SAY_HELLO: 'ZEROS.SAY_HELLO',
}

