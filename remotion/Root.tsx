import React from 'react';
import { Composition } from 'remotion';
import { YokaiKanjiComposition } from './Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="YokaiKanjiDemo"
        component={YokaiKanjiComposition}
        durationInFrames={2250}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
