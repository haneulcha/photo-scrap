type SlackEventPayload = {
  type: "event_callback";
  token: string;
  team_id: string;
  api_app_id: string;
  event: SlackMessageEvent | SlackMessageSubtypeFileShareEvent;
  event_context: string;
  event_id: string;
  event_time: number;
  authorizations: {
    enterprise_id: string;
    team_id: string;
    user_id: string;
    is_bot: boolean;
    is_enterprise_install: boolean;
  }[];
  is_ext_shared_channel: boolean;
  context_team_id: string;
  context_enterprise_id: null;
  challenge: never;
};

type SlackURLVerificationEventPayload = {
  token: string;
  challenge: string;
  type: "url_verification";
};

type SlackMessageEvent = {
  client_msg_id: string;
  type: "message";
  subtype: never;
  text: string;
  user: string;
  ts: string;
  blocks: { type: "rich_text"; block_id: string; elements: any[] }[];
  team: string;
  channel: string;
  event_ts: string;
  channel_type: string;
};

// type FileSharedEvent = {
//   type: "file_shared";
//   channel_id: string;
//   file_id: string;
//   user_id: string;
//   file: {
//     id: string;
//   }[];
//   event_ts: string;
// };

type SlackMessageSubtypeFileShareEvent = {
  type: "message";
  subtype: "file_share";
  text: string;
  files: {
    id: string;
    created: number;
    timestamp: number;
    name: string;
    title: string;
    mimetype: string;
    filetype: string;
    pretty_type: string;
    user: string;
    editable: boolean;
    size: number;
    mode: string;
    is_external: boolean;
    external_type: string;
    is_public: boolean;
    public_url_shared: boolean;
    display_as_bot: boolean;
    username: string;
    url_private: string;
    url_private_download: string;
    thumb_64: string;
    thumb_80: string;
    thumb_360: string;
    thumb_360_w: number;
    thumb_360_h: number;
    thumb_480: string;
    thumb_480_w: number;
    thumb_480_h: number;
    thumb_160: string;
    image_exif_rotation: number;
    original_w: number;
    original_h: number;
    pjpeg: string;
    permalink: string;
    permalink_public: string;
    has_rich_preview: boolean;
  }[];
  upload: boolean;
  user: string;
  display_as_bot: boolean;
  bot_id?: null;
  ts: string;
  channel: string;
  event_ts: string;
  channel_type: string;
  client_msg_id: string;
  blocks?: { type: "rich_text"; block_id: string; elements: any[] }[];
};
