import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const descriptions = [
  {
    title: <>OI</>,
    description: (
      <>
        OI（Olympiad in Informatics，信息学奥林匹克竞赛）在中国起源于 1984 年，是五大高中
        学科竞赛之一。
      </>
    ),
  },
  {
    title: <>ICPC</>,
    description: (
      <>
        ICPC（International Collegiate Programming Contest，国际大学生程序设计竞赛）由
        ICPC 基金会（ICPC Foundation）举办，是最具影响力的大学生计算机竞赛。
        由于以前 ACM 赞助这个竞赛，也有很多人习惯叫它 ACM 竞赛。
      </>
    ),
  },
  {
    title: <>CSP-J/S</>,
    description: (
      <>
        CCF CSP-JS 系CCF CSP非专业级别的软件能力认证（简称CCF CSP-JS），分两个级别，分别为
        CSP-J（入门组，Junior）和CSP-S（提高组，Senior），均涉及算法和编程。任何人都可以报名
        参加。
        CSP-JS赛程分为初赛（笔试）和复赛（机试），即CSP-J1/S1与CSP-J2/S2。参赛者必须先参加
        第一轮，达到一定的分数者方可参加第二轮。
      </>
    ),
  },
];

function DescriptionUI({title, description}) {
  return (
    <div className={classnames('col col--4', styles.feature)}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`你好， ${siteConfig.title}`}
      description="OI-Documentation ｜ lls的编程课堂">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/intro')}>
              现在开始！
            </Link>
          </div>
        </div>
      </header>
      <main>
        {descriptions && descriptions.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {descriptions.map((props, idx) => (
                  <DescriptionUI key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
