type SlackSlashCommandPayload = {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  api_app_id: string;
  is_enterprise_install: boolean;
  response_url: string;
  trigger_id: string;
  payload: never;
};

type SlackInteractivityPayload = {
  payload: string;
  command: never;
};

type SlackPayload = SlackSlashCommandPayload | SlackInteractivityPayload;

type SlackBlockSection = {
  type: "section";
  text: {
    type: "plain_text" | "mrkdwn";
    text: string;
    verbatim?: boolean;
  };
};

type SlackBlockInput = {
  type: "input";
  block_id: string;
  label: {
    type: "plain_text";
    text: string;
    emoji?: boolean;
  };
  hint?: {
    type: "plain_text";
    text: string;
    emoji?: boolean;
  };
  optional?: boolean;
  dispatch_action?: boolean;
  element: {
    type: string;
    action_id: string;
    placeholder?: {
      type: string;
      text: string;
      emoji?: boolean;
    };
    options?: {
      text: {
        type: "plain_text";
        text: string;
        emoji?: boolean;
      };
      value: string;
    }[];
    initial_value?: string;
    initial_date?: string;
    dispatch_action_config?: {
      trigger_actions_on: string[];
    };
  };
};

type SlackBlock = SlackBlockSection | SlackBlockInput;

type FoodOpinionModalState = {
  values: {
    ham_input_input: {
      ham_input: {
        type: "plain_text_input";
        value: string;
      };
    };
    ham_datepicker_block: {
      datepicker_action: {
        type: "datepicker";
        selected_date: string;
        // type: "static_select";
        // selected_option: {
        //   text: {
        //     type: "plain_text";
        //     text: string;
        //     emoji: boolean;
        //   };
        //   value: string;
        // };
      };
    };
  };
};

type ModalArgs = {
  trigger_id: string;
  id: string;
  title: string;
  submit_text?: string;
  blocks: SlackBlock[];
};

type SlackModalPayload = {
  type: string;
  callback_id?: string;
  team: {
    id: string;
    domain: string;
  };
  user: {
    id: string;
    username: string;
    name: string;
    team_id: string;
  };
  channel?: {
    id: string;
    name: string;
  };
  message: {
    ts: string;
    thread_ts?: string;
  };
  api_app_id: string;
  token: string;
  trigger_id: string;
  view: {
    id: string;
    team_id: string;
    type: string;
    blocks: SlackBlock[];
    private_metadata: string;
    callback_id: string;
    state: FoodOpinionModalState;
    hash: string;
    title: {
      type: "plain_text";
      text: string;
      emoji: boolean;
    };
    clear_on_close: boolean;
    notify_on_close: boolean;
    close: null;
    submit: {
      type: "plain_text";
      text: string;
      emoji: boolean;
    };
    app_id: string;
    external_id: string;
    app_installed_team_id: string;
    bot_id: string;
  };
};

type SlackApiEndpoint =
  | "chat.postMessage"
  | "views.open"
  | "users.info"
  | string;

type SlackApiRequestBody = {};

type BlockArgs = {
  id: string;
  label: string;
  placeholder: string;
};

type SectionBlockArgs = {
  text: string;
};

type InputBlockArgs = {
  initial_value?: string;
  hint?: string;
} & BlockArgs;

type SelectBlockArgs = {
  options: {
    label: string;
    value: string;
  }[];
} & BlockArgs;

type NotionItem = {
  properties: {
    opinion: {
      title: {
        text: {
          content: string;
        };
      }[];
    };
    spiceLevel: {
      select: {
        name: string;
      };
    };
    Status: {
      status: {
        name: string;
      };
    };
  };
};

type NewItem = {
  opinion: string;
  spiceLevel: string;
  status?: string;
  submitter?: string;
};

type SlackUserInfoResponse = {
  ok: boolean;
  user: {
    id: string;
    team_id: string;
    name: string;
    deleted: boolean;
    color: string;
    real_name: string;
    tz: string;
    tz_label: string;
    tz_offset: number;
    profile: {
      title: string;
      phone: string;
      skype: string;
      real_name: string;
      real_name_normalized: string;
      display_name: string;
      display_name_normalized: string;
      fields: null;
      status_text: string;
      status_emoji: string;
      status_emoji_display_info: string[];
      status_expiration: number;
      avatar_hash: string;
      image_original: string;
      is_custom_image: boolean;
      email: string;
      first_name: string;
      last_name: string;
      image_24: string;
      image_32: string;
      image_48: string;
      image_72: string;
      image_192: string;
      image_512: string;
      image_1024: string;
      status_text_canonical: string;
      team: string;
    };
    is_admin: boolean;
    is_owner: boolean;
    is_primary_owner: boolean;
    is_restricted: boolean;
    is_ultra_restricted: boolean;
    is_bot: boolean;
    is_app_user: boolean;
    updated: number;
    is_email_confirmed: boolean;
    who_can_share_contact_card: "EVERYONE";
  };
};
