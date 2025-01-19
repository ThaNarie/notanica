import { useChallengeStore } from '../stores/useChallengeStore';
import { ChallengeDisplay } from './ChallengeDisplay';
import { ChallengeGenerator } from '../services/ChallengeGenerator';
import { Key } from '../services/MusicGenerator';

export function Field() {
  const { challenges } = useChallengeStore();

  const handleSpawnClick = () => {
    ChallengeGenerator.createScaleChallenge(Key.CMajor);
  };

  return (
    <div className="flex-1 h-screen p-5 pl-0 pb-[210px] flex flex-col relative">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          &nbsp;
          {/* <h2 className="text-white text-lg">Settings</h2> */}
          <button
            className="px-5 py-2.5 bg-[#4a4a4a] outline outline-[#666] rounded text-white text-sm cursor-pointer hover:bg-[#5a5a5a] active:bg-[#3a3a3a] transition-all duration-200"
            onClick={handleSpawnClick}
          >
            Spawn
          </button>
        </div>
      </div>
      <div className="flex-1 bg-[#222] rounded-lg border border-[#333] overflow-y-auto">
        {challenges.map((challenge) => (
          <ChallengeDisplay key={challenge.id} {...challenge} />
        ))}
      </div>
    </div>
  );
}
