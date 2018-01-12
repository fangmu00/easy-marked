export const cmd = {
  img: (name = '', url = '') => {
    const text = `![${name}](${url})`;
    const len = text.length;
    return {
      text,
      selectRange: [len, len],
    };
  },
  table: {
    text: '\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text     | Text     |',
    selectRange: [2, 10],
  },
  link: (name = '') => ({
    text: `[${name}]()`,
    selectRange: (() => {
      const len = `[${name}](`.length;
      return [len, len];
    })(),
  }),
  code: {
    text: '```\ncode\n```',
    selectRange: [4, 8],
  },
  tab: {
    text: '  ',
    selectRange: [2, 2],
  },
  italic: (v = '') => {
    const text = `_${v}_`;
    const len = text.length - 1;
    return {
      text,
      selectRange: [len, len],
    };
  },
  ulist: (v = 'List') => {
    const text = `* ${v}`;
    const len = text.length;
    return {
      text,
      selectRange: [2, len],
    };
  },
  olist: (v = 'List') => {
    const text = `1. ${v}`;
    const len = text.length;
    return {
      text,
      selectRange: [3, len],
    };
  },
  h1: (v = '大标题') => {
    const text = `# ${v}`;
    const len = text.length;
    return {
      text,
      selectRange: [2, len],
    };
  },
  h2: (v = '中标题') => {
    const text = `## ${v}`;
    const len = text.length;
    return {
      text,
      selectRange: [3, len],
    };
  },
  h3: (v = '小标题') => {
    const text = `### ${v}`;
    const len = text.length;
    return {
      text,
      selectRange: [4, len],
    };
  },
  deleteline: (v = '') => {
    const text = `~~${v}~~`;
    const len = text.length - 2;
    return {
      text,
      selectRange: [len, len],
    };
  },
  bold: (v = '') => {
    const text = `**${v}**`;
    const len = text.length - 2;
    return {
      text,
      selectRange: [len, len],
    };
  },
};

export const uploadRPC = '//127.0.0.1:8090/file-upload';
