import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    RedditIcon,
    RedditShareButton,
    RedditShareCount,
    TelegramIcon,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon,
} from 'react-share';

import styles from './shareSocialPlatformsStyle.module.css';
// const window.location.href = new URLSearchParams(window.location.search);
export function ShareSocialPlatforms({ answer, question, url }) {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.spaceItem}>
                <FacebookShareButton
                    url={
                        url ? url : 'https://twinciti-frontend-dev.vercel.app/'
                    }
                    title="share"
                >
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
            </div>

            {/* <div className={styles.spaceItem}>
        <FacebookMessengerShareButton
          url={url ? url : "https://twinciti-frontend-dev.vercel.app/"}
          appId="521270401588372"
        >
          <FacebookMessengerIcon size={32} round />
        </FacebookMessengerShareButton>
      </div> */}

            <div className={styles.spaceItem}>
                <TwitterShareButton
                    url={
                        url ? url : 'https://twinciti-frontend-dev.vercel.app/'
                    }
                    title={question}
                >
                    <XIcon size={32} round />
                </TwitterShareButton>
            </div>

            <div className={styles.spaceItem}>
                <TelegramShareButton
                    url={
                        url ? url : 'https://twinciti-frontend-dev.vercel.app/'
                    }
                    title={question}
                >
                    <TelegramIcon size={32} round />
                </TelegramShareButton>
            </div>

            <div className={styles.spaceItem}>
                <WhatsappShareButton
                    url={
                        url ? url : 'https://twinciti-frontend-dev.vercel.app/'
                    }
                    title={question}
                    separator=":: "
                >
                    <WhatsappIcon size={32} round />
                </WhatsappShareButton>
            </div>

            <div className={styles.spaceItem}>
                <LinkedinShareButton
                    url={
                        url ? url : 'https://twinciti-frontend-dev.vercel.app/'
                    }
                    title={question}
                >
                    <LinkedinIcon size={32} round />
                </LinkedinShareButton>
            </div>
            <div className={styles.spaceItem}>
                <RedditShareButton
                    url={
                        url ? url : 'https://twinciti-frontend-dev.vercel.app/'
                    }
                    title={question}
                >
                    <RedditIcon size={32} round />
                </RedditShareButton>

                <div>
                    <RedditShareCount
                        url={
                            url
                                ? url
                                : 'https://twinciti-frontend-dev.vercel.app/'
                        }
                    />
                </div>
            </div>

            <div className={styles.spaceItem}>
                <EmailShareButton
                    url={
                        url ? url : 'https://twinciti-frontend-dev.vercel.app/'
                    }
                    subject={question}
                    body={answer}
                >
                    <EmailIcon size={32} round />
                </EmailShareButton>
            </div>
        </div>
    );
}

export default ShareSocialPlatforms;
