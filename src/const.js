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
    text: '| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text     | Text     |',
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
};

export const uploadRPC = '//127.0.0.1:8090/file-upload';
