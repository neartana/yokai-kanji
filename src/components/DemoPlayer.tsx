import { Player } from '@remotion/player';
import { YokaiKanjiComposition } from '../../remotion/Composition';

export default function DemoPlayer() {
  return (
    <Player
      component={YokaiKanjiComposition}
      durationInFrames={2250}
      fps={30}
      compositionWidth={1920}
      compositionHeight={1080}
      style={{ width: '100%', aspectRatio: '16 / 9' }}
      controls
    />
  );
}
