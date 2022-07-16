const math = require('remark-math');
const katex = require('rehype-katex');
module.exports = {
  title: 'OI-Documentation',
  tagline: 'OI 算法学习笔记总汇 ｜ lls 的编程课堂',
  url: 'https://oi-documentation.vercel.app',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'ab86608661 & Xiaohuba & Spoonjunxi', // Usually your GitHub org/user name.
  projectName: 'OI-Documentation', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'OI-Documentation',
      logo: {
        alt: 'OI-Documentation Logo',
        src: 'img/logo.svg',
      },
      links: [
        {
          to: 'docs/computer',
          activeBasePath: 'docs',
          label: '笔记',
          position: 'left',
        },
        {
          to: 'blog', 
          label: '更新日志', 
          position: 'left'},
        {
          href: 'https://github.com/Xiaohuba/OI-Documentation',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '友链',
          items:
          [
            {
              label:'洛谷',
              href:'https://luogu.com.cn',
            },
            {
              label:'CS 在线作图工具',
              href:'https://csacademy.com/',
            },
            {
              label:'OI-wiki',
              href:'https://OI-wiki.org',
            },
            {
              label:'CCF NOI',
              href:'https://www.noi.cn',
            },
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ab86608661, Xiaohuba, spoonjunxi`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/Xiaohuba/OI-Documentation/edit/main/',
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/Xiaohuba/OI-Documentation/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        
      },
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
};
