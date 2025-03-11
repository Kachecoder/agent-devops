// components/SocialPostGenerator.tsx
import { useState } from 'react';
import { TwitterApi } from 'twitter-api-v2';

export default function SocialPostGenerator() {
  const [post, setPost] = useState('');

  const schedulePost = async () => {
    const client = new TwitterApi({
      appKey: process.env.NEXT_PUBLIC_TWITTER_KEY!,
      appSecret: process.env.NEXT_PUBLIC_TWITTER_SECRET!,
    });
    
    await client.v2.tweet(post);
    alert('Posted to Twitter!');
  };

  return (
    <div>
      <textarea onChange={(e) => setPost(e.target.value)} />
      <button onClick={schedulePost}>Post to Social</button>
    </div>
  );
}