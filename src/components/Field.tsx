import React from 'react';
import { useChallengeStore } from '../stores/useChallengeStore';
import { Challenge } from './Challenge';
import { ChallengeGenerator } from '../services/ChallengeGenerator';
import { Key } from '../services/MusicGenerator';

export function Field() {
  const { challenges } = useChallengeStore();

  const handleSpawnClick = () => {
    ChallengeGenerator.createScaleChallenge(Key.CMajor);
  };

  return (
    <div className="field-container">
      <button className="spawn-button" onClick={handleSpawnClick}>
        Spawn Challenge
      </button>
      <div className="field">
        {challenges.map(challenge => (
          <Challenge key={challenge.id} {...challenge} />
        ))}
      </div>
    </div>
  );
}
