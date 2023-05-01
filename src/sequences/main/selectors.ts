export const SELECTORS = {
  InboxContainer: '[data-pagelet="BizP13NInboxUinifiedThreadListView"]',
  InboxItems: 'div > div > div > div > div > div[role="presentation"]',
  InboxItemLast: 'div > div > div > div > :last-child [role="presentation"]',
  InboxItemName: 'div > div + div > div > div > div > div > div + div > span',
  InboxItemAttachmentDesc: 'div > div + div > div > div + div > div > span',
  InboxItemMoveToDoneBtn: 'div > div + div > div + div > div + div > div > a[role="row"]',

  MessageContainer: '[data-pagelet="BizInboxMessengerMessageListContainer"]',
  MessageLastMessageInList: 'div > div > div + div > :nth-child(REPLACE_LAST) > div > :nth-child(2) > div > :last-child'
} as const;
