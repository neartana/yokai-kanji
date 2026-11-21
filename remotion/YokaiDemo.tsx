import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const dark = '#020617';
const card = '#0f172a';
const amber = '#fbbf24';
const paper = '#f1f5f9';
const muted = '#94a3b8';

function useFade(start: number, length: number): number {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + length], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function Intro() {
  const opacity = useFade(0, 30);
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps, config: { damping: 100 } });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark,
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div style={{ textAlign: 'center', transform: `scale(${scale})` }}>
        <div style={{ fontSize: 120 }}>🏮</div>
        <div style={{ color: paper, fontSize: 110, fontWeight: 800, fontFamily: 'system-ui, sans-serif' }}>
          Yokai Kanji
        </div>
        <div style={{ color: amber, fontSize: 44, marginTop: 24, fontFamily: 'system-ui, sans-serif' }}>
          Learn N5 kanji with yokai
        </div>
        <div style={{ color: muted, fontSize: 32, marginTop: 16, fontFamily: 'system-ui, sans-serif' }}>
          Answer. Collect ofuda. Unlock yokai.
        </div>
      </div>
    </AbsoluteFill>
  );
}

function QuizScene() {
  const opacity = useFade(600, 30);
  const frame = useCurrentFrame();
  const reveal = frame > 900;
  const choices = ['sun, day', 'moon, month', 'fire', 'water'];
  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark,
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div style={{ width: 1200, textAlign: 'center' }}>
        <div style={{ color: amber, fontSize: 36, letterSpacing: 4, fontFamily: 'system-ui, sans-serif' }}>
          SAMPLE QUIZ
        </div>
        <div style={{ color: paper, fontSize: 220, fontWeight: 800, lineHeight: 1.1 }}>日</div>
        <div style={{ color: muted, fontSize: 36, marginBottom: 32, fontFamily: 'system-ui, sans-serif' }}>
          Pick the correct meaning
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {choices.map((choice, index) => {
            const isCorrect = choice === 'sun, day';
            const active = reveal && isCorrect;
            return (
              <div
                key={choice}
                style={{
                  backgroundColor: active ? '#fbbf24' : card,
                  color: active ? '#020617' : paper,
                  border: active ? '4px solid #fbbf24' : '2px solid #334155',
                  borderRadius: 16,
                  padding: 28,
                  fontSize: 36,
                  fontFamily: 'system-ui, sans-serif',
                  opacity: reveal || !isCorrect ? 1 : 0.45,
                }}
              >
                {String.fromCharCode(65 + index)}. {choice}
              </div>
            );
          })}
        </div>
        {reveal && (
          <div style={{ color: amber, fontSize: 36, marginTop: 28, fontFamily: 'system-ui, sans-serif' }}>
            Correct. The yokai retreats. Plus 10 XP.
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

function CollectionScene() {
  const opacity = useFade(1500, 30);
  const yokai = [
    { name: 'Kappa', kanji: '水', story: 'A river spirit who loves cucumbers.' },
    { name: 'Tengu', kanji: '山', story: 'A mountain guardian with strong winds.' },
    { name: 'Kitsune', kanji: '生', story: 'A clever fox spirit who can change shape.' },
  ];
  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark,
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div style={{ width: 1500, textAlign: 'center' }}>
        <div style={{ color: amber, fontSize: 36, letterSpacing: 4, fontFamily: 'system-ui, sans-serif' }}>
          YOKAI COLLECTION
        </div>
        <div style={{ color: paper, fontSize: 72, fontWeight: 800, marginTop: 16, fontFamily: 'system-ui, sans-serif' }}>
          Unlock a new yokai every 10 correct answers
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginTop: 48 }}>
          {yokai.map((item) => (
            <div key={item.name} style={{ backgroundColor: card, border: '2px solid #f59e0b', borderRadius: 20, padding: 32 }}>
              <div style={{ fontSize: 110 }}>{item.kanji}</div>
              <div style={{ color: amber, fontSize: 40, fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>{item.name}</div>
              <div style={{ color: muted, fontSize: 28, marginTop: 12, fontFamily: 'system-ui, sans-serif' }}>{item.story}</div>
            </div>
          ))}
        </div>
        <div style={{ color: paper, fontSize: 36, marginTop: 48, fontFamily: 'system-ui, sans-serif' }}>
          50 N5 kanji. Short sessions. Dark lantern theme.
        </div>
      </div>
    </AbsoluteFill>
  );
}

function Closing() {
  const opacity = useFade(2100, 30);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark,
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 100 }}>🏮</div>
        <div style={{ color: paper, fontSize: 84, fontWeight: 800, fontFamily: 'system-ui, sans-serif' }}>Yokai Kanji</div>
        <div style={{ color: amber, fontSize: 40, marginTop: 20, fontFamily: 'system-ui, sans-serif' }}>
          Built with Kiro for Kiroween 2026
        </div>
      </div>
    </AbsoluteFill>
  );
}

export const YokaiDemo: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 600) {
    return <Intro />;
  }
  if (frame < 1500) {
    return <QuizScene />;
  }
  if (frame < 2100) {
    return <CollectionScene />;
  }
  return <Closing />;
};
