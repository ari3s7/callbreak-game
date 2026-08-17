import React, { useEffect, useState } from 'react';
import { GameState, getValidMoves, isValidMove } from '@callbreak/shared';
import { CallSelector } from '../components/game/CallSelector.js';
import { HUDBar } from '../components/game/HUDBar.js';
import { MatchResultsModal } from '../components/game/MatchResultsModal.js';
import { PlayerSeat } from '../components/game/PlayerSeat.js';
import { RoundSummaryModal } from '../components/game/RoundSummaryModal.js';
import { TrickArea } from '../components/game/TrickArea.js';
import { PlayingCard } from '../components/card/PlayingCard.js';

interface GamePageProps {
  gameState: GameState;
  humanPlayerId: string;
  currentTurnName: string;
  turnSecondsLeft: number;
  onSubmitCall: (call: number) => void;
  onPlayCard: (cardId: string) => void;
  onNextRound: () => void;
  onPlayAgain: () => void;
  onReturnHome: () => void;
}

export const GamePage: React.FC<GamePageProps> = ({
  gameState,
  humanPlayerId,
  currentTurnName,
  turnSecondsLeft,
  onSubmitCall,
  onPlayCard,
  onNextRound,
  onPlayAgain,
  onReturnHome,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);

  const humanPlayer = gameState.players.find((p) => p.id === humanPlayerId) || gameState.players[0];
  const isHumanTurn = gameState.players[gameState.currentTurnSeat]?.id === humanPlayer.id;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px) and (orientation: portrait)');

    const updateOrientation = () => {
      setIsMobilePortrait(mediaQuery.matches);
    };

    updateOrientation();
    mediaQuery.addEventListener('change', updateOrientation);
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      mediaQuery.removeEventListener('change', updateOrientation);
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  // Seat positioning: 0=South(Human), 1=West, 2=North, 3=East
  const pSouth = humanPlayer;
  const pWest = gameState.players[(humanPlayer.seat + 1) % 4];
  const pNorth = gameState.players[(humanPlayer.seat + 2) % 4];
  const pEast = gameState.players[(humanPlayer.seat + 3) % 4];

  // Calculate valid moves for human player
  const validMoves =
    isHumanTurn && gameState.phase === 'playing'
      ? getValidMoves(
          humanPlayer.cards,
          gameState.currentTrick.leadSuit,
          gameState.currentTrick.cards
        )
      : [];

  const handleCardClick = (cardId: string) => {
    if (!isHumanTurn || gameState.phase !== 'playing') return;

    const valid = isValidMove(
      cardId,
      humanPlayer.cards,
      gameState.currentTrick.leadSuit,
      gameState.currentTrick.cards
    );

    if (!valid) {
      if (gameState.currentTrick.leadSuit) {
        setErrorMessage(
          `Invalid card! You must follow suit (${gameState.currentTrick.leadSuit.toUpperCase()}) or play a Spade.`
        );
      } else {
        setErrorMessage('Invalid card play!');
      }
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setErrorMessage(null);
    onPlayCard(cardId);
  };

  const showRoundSummary =
    gameState.phase === 'round_end' ||
    (gameState.trickHistory.length === 13 && gameState.phase !== 'game_over');

  return (
    <div className="h-[calc(100dvh-40px)] sm:h-[calc(100dvh-56px)] max-h-[100dvh] bg-[#0B0E13] tech-grid-bg flex flex-col justify-between overflow-hidden relative select-none">
      {isMobilePortrait && (
        <div className="fixed inset-0 z-50 bg-[#0B0E13]/96 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xs w-full text-center border border-[#222C38] rounded-xl bg-[#11151C] p-5 shadow-2xl">
            <div className="mx-auto w-12 h-12 rounded-full border border-[#00D5FF]/40 flex items-center justify-center text-[#00D5FF] text-xl mb-3 animate-pulse">
              ↻
            </div>
            <div className="text-[10px] font-mono tracking-[0.25em] text-[#00D5FF] uppercase mb-1">
              Rotate Device
            </div>
            <h2 className="text-lg font-bold font-display text-[#F1F5F9] mb-1.5">
              Switch to Landscape
            </h2>
            <p className="text-xs text-[#A5AFBD] leading-relaxed mb-4">
              For the best card table experience, please rotate your phone horizontally.
            </p>
            <button
              onClick={() => setIsMobilePortrait(false)}
              className="px-4 py-1.5 rounded-lg bg-[#161C25] border border-[#222C38] text-[11px] font-mono text-[#00D5FF] hover:border-[#00D5FF] transition-all"
            >
              Continue in Portrait
            </button>
          </div>
        </div>
      )}

      {/* Top Status HUD */}
      <HUDBar
        currentRound={gameState.currentRound}
        maxRounds={gameState.maxRounds}
        currentTrickNumber={gameState.currentTrick.trickNumber}
        isHumanTurn={isHumanTurn}
        currentTurnName={currentTurnName}
        turnSecondsLeft={turnSecondsLeft}
        phase={gameState.phase}
      />

      {/* Error Toast Notification */}
      {errorMessage && (
        <div className="absolute top-10 sm:top-12 left-1/2 transform -translate-x-1/2 z-40 bg-[#FF3B4E]/90 border border-[#FF3B4E] text-[#F1F5F9] px-2.5 py-1 rounded text-[10px] sm:text-xs font-mono shadow-lg">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Main Tactical Game Table */}
      <div className="flex-1 flex flex-col items-center justify-between p-1 sm:p-2 relative max-w-6xl mx-auto w-full overflow-hidden min-h-0">
        {/* Top Seat: North */}
        <div className="z-10 mt-0 sm:mt-0.5 flex-shrink-0">
          <PlayerSeat
            player={pNorth}
            isCurrentTurn={gameState.players[gameState.currentTurnSeat]?.id === pNorth.id}
            position="top"
            phase={gameState.phase}
          />
        </div>

        {/* Center Board */}
        <div className="w-full flex items-center justify-center gap-1 xs:gap-2 sm:gap-4 md:gap-6 my-auto px-1 sm:px-2 min-h-0 flex-1">
          {/* Left Seat: West */}
          <div className="z-10 flex-shrink-0">
            <PlayerSeat
              player={pWest}
              isCurrentTurn={gameState.players[gameState.currentTurnSeat]?.id === pWest.id}
              position="left"
              phase={gameState.phase}
            />
          </div>

          {/* Center Area: Trick Table during playing OR CallSelector during bidding */}
          <div className="z-20 flex-shrink-0 flex items-center justify-center min-h-[130px] xs:min-h-[150px] sm:min-h-[200px]">
            {gameState.phase === 'bidding' && humanPlayer.call === null ? (
              <CallSelector onSelectCall={onSubmitCall} />
            ) : (
              <TrickArea
                cards={gameState.currentTrick.cards}
                players={gameState.players}
                leadSuit={gameState.currentTrick.leadSuit}
                winnerId={gameState.currentTrick.winnerId}
                humanPlayerSeat={humanPlayer.seat}
              />
            )}
          </div>

          {/* Right Seat: East */}
          <div className="z-10 flex-shrink-0">
            <PlayerSeat
              player={pEast}
              isCurrentTurn={gameState.players[gameState.currentTurnSeat]?.id === pEast.id}
              position="right"
              phase={gameState.phase}
            />
          </div>
        </div>

        {/* Bottom Seat & Human Cards Hand */}
        <div className="w-full flex flex-col items-center z-30 pb-0.5 sm:pb-1 flex-shrink-0">
          {/* Bottom Seat Info */}
          <div className="mb-0.5 sm:mb-1">
            <PlayerSeat
              player={pSouth}
              isCurrentTurn={isHumanTurn}
              position="bottom"
              phase={gameState.phase}
            />
          </div>

          {/* Cards Hand Layout - Elevated and fully visible */}
          <div className="w-full flex justify-center overflow-x-visible pb-0.5">
            <div className="flex justify-center -space-x-3.5 xs:-space-x-4 sm:-space-x-5 md:-space-x-6 lg:-space-x-7 max-w-full px-1 py-0.5 sm:py-1 items-end min-h-[64px] xs:min-h-[72px] sm:min-h-[92px] md:min-h-[110px]">
              {humanPlayer.cards.map((card) => {
                const isPlayableCard =
                  isHumanTurn &&
                  gameState.phase === 'playing' &&
                  validMoves.some((c) => c.id === card.id);

                return (
                  <PlayingCard
                    key={card.id}
                    card={card}
                    isSelected={selectedCardId === card.id}
                    isPlayable={isPlayableCard}
                    onClick={() => handleCardClick(card.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Round Summary Modal */}
      {showRoundSummary && gameState.roundResults.length > 0 && (
        <RoundSummaryModal
          roundResult={gameState.roundResults[gameState.roundResults.length - 1]}
          players={gameState.players}
          onNextRound={onNextRound}
        />
      )}

      {/* Match Results Modal */}
      {gameState.phase === 'game_over' && (
        <MatchResultsModal
          players={gameState.players}
          winnerId={gameState.winnerId}
          onPlayAgain={onPlayAgain}
          onReturnHome={onReturnHome}
        />
      )}
    </div>
  );
};
