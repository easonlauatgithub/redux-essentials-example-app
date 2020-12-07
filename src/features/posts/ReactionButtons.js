import React from 'react'
import { useDispatch } from 'react-redux'
import { reactionAdded } from './postsSlice'

const reactionEmoji = {
    thumbsUp: '👍',
    hooray: '🎉',
    heart: '❤️',
    rocket: '🚀',
    eyes: '👀'
}

export const ReactionButtons = ({ post }) => {
    const dispatch = useDispatch()
    const arrReactionEmoji = Object.entries(reactionEmoji);
    const reactionButtons = arrReactionEmoji.map(([name, emoji]) => {

        let numOfEmoji = 0;
        if( typeof(post.reactions) != "undefined" ){
            if ( !isNaN(post.reactions[name]) ){
                numOfEmoji = post.reactions[name];
            }
        }

        return (
            <button
            key={name}
            type="button"
            className="muted-button reaction-button"
            onClick={() => dispatch(reactionAdded({ postId: post.id, reaction: name }))}>
                {emoji} { numOfEmoji }
            </button>
        )
    })
    return <div>{reactionButtons}</div>
}