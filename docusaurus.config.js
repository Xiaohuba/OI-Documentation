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
          to: 'docs/doc1',
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
            }
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
            'https://github.com/Xiaohuba/OI-Documentation/edit/main/docs/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/Xiaohuba/OI-Documentation/edit/main/blog',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
