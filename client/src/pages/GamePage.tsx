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

  const humanPlayer = gameState.players.find((p) => p.id === humanPlayerId) || gameState.players[0];
  const isHumanTurn = gameState.players[gameState.currentTurnSeat]?.id === humanPlayer.id;

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
      {/* Top Status HUD */}
      <HUDBar
        currentRound={gameState.currentRound}
        maxRounds={gameState.maxRounds}
        currentTrickNumber={gameState.currentTrick.trickNumber}
        isHumanTurn={isHumanTurn}
        currentTurnName={currentTurnName}
        turnSecondsLeft={turnSecondsLeft}
        phase={gameState.phase}
        leadSuit={gameState.currentTrick.leadSuit}
      />

      {/* Error Toast Notification */}
      {errorMessage && (
        <div className="absolute top-10 sm:top-12 left-1/2 transform -translate-x-1/2 z-40 bg-[#FF3B4E]/90 border border-[#FF3B4E] text-[#F1F5F9] px-2.5 py-1 rounded text-[10px] sm:text-xs font-mono shadow-lg">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Main Tactical Game Table */}
      <div className="flex-1 flex flex-col items-center justify-between p-2 sm:p-4 relative max-w-6xl mx-auto w-full overflow-hidden min-h-0">
        {/* Top Seat: North */}
        <div className="z-10 mt-1 sm:mt-2 flex-shrink-0">
          <PlayerSeat
            player={pNorth}
            isCurrentTurn={gameState.players[gameState.currentTurnSeat]?.id === pNorth.id}
            position="top"
            phase={gameState.phase}
          />
        </div>

        {/* Center Board - Spanned evenly across the table */}
        <div className="w-full flex items-center justify-between sm:justify-around px-2 sm:px-6 md:px-12 my-auto min-h-0 flex-1">
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
          <div className="z-20 flex-shrink-0 flex items-center justify-center min-h-[180px] xs:min-h-[210px] sm:min-h-[250px]">
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
        <div className="w-full flex flex-col items-center z-30 pb-1 sm:pb-2 flex-shrink-0">
          {/* Bottom Seat Info */}
          <div className="mb-1 sm:mb-1.5">
            <PlayerSeat
              player={pSouth}
              isCurrentTurn={isHumanTurn}
              position="bottom"
              phase={gameState.phase}
            />
          </div>

          {/* Cards Hand Layout - Elevated, fully visible, filling the bottom span */}
          <div className="w-full flex justify-center overflow-x-visible pb-1">
            <div className="flex justify-center -space-x-4 xs:-space-x-5 sm:-space-x-6 md:-space-x-7 max-w-full px-2 py-1 items-end min-h-[82px] xs:min-h-[94px] sm:min-h-[110px] md:min-h-[125px]">
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
