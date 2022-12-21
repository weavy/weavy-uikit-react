import Icon from '../ui/Icon';
import Button from '../ui/Button';
import React from 'react';

type Props = {
    embed: EmbedType,
    onRemove?: Function,
    onSwap?: Function | null
}

const Embed = ({ embed, onRemove, onSwap }: Props) => {

    const giphy = embed.type === "photo" && embed.provider_name.toLocaleLowerCase() === "giphy";
    const caption = !embed.html && !giphy;

    return (
        <div className='wy-embed'>
            <div className='wy-embed-actions'>
                {onSwap &&
                    <Button.UI title='Switch' onClick={onSwap}>
                        <Icon.UI name="swap-horizontal" />
                    </Button.UI>
                }

                {!onSwap &&
                    <Button.UI className='wy-embed-cycle'></Button.UI>
                }

                {onRemove &&
                    <Button.UI title='Remove' onClick={() => onRemove(embed.id)}>
                        <Icon.UI name="close-circle" />
                    </Button.UI>
                }

            </div >

            {embed.type === "audio" &&
                <div className='wy-embed-audio'></div>
            }
            {embed.type === "video" && embed.html &&
                <div className='wy-embed-video'>
                    <div dangerouslySetInnerHTML={{ __html: embed.html }}></div>
                </div>
            }
            {embed.type === "rich" &&
                <div className='wy-embed-rich'></div>
            }
            {embed.type === "photo" && embed.thumbnail_url &&
                <div className={'wy-embed-photo' + ((embed.thumbnail_width || 0) < 250 ? 'wy-embed-photo-sm' : '')}>
                    <a href={embed.original_url} target="_blank">
                        <img src={embed.thumbnail_url} width={embed.thumbnail_width} height={embed.thumbnail_height} alt='' />
                    </a>
                </div>
            }
            {embed.type !== "audio" && embed.type !== "video" && embed.type !== "rich" && embed.type !== "photo" && embed.thumbnail_url &&
                <div className={'wy-embed-photo' + ((embed.thumbnail_width || 0) < 250 ? 'wy-embed-photo-sm' : '')}>
                    <a href={embed.original_url} target="_blank">
                        <img src={embed.thumbnail_url} width={embed.thumbnail_width} height={embed.thumbnail_height} alt='' />
                    </a>
                </div>
            }

            {caption &&
                <div className='wy-embed-caption'>
                    <a className='wy-embed-link' href={embed.original_url} target='_blank'>{embed.host}</a>
                    {embed.title &&
                        <div className='wy-embed-title'>{embed.title}</div>
                    }
                    {embed.description &&
                        <div className='wy-embed-description'>{embed.description}</div>
                    }
                </div>
            }

        </div >
    )

}

export default Embed;