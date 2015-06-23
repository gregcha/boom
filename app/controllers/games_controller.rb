class GamesController < ApplicationController
  # def create
    # @game = Game.new(score_params)
    # @game.save
    # redirect_to root_path(level_params)
  # end

  def play
    @beginners = Game.where(level:'Beginner').order(score: :asc).limit(10)
    @intermediates = Game.where(level:'Intermediate').order(score: :asc).limit(10)
    @experts = Game.where(level:'Expert').order(score: :asc).limit(10)
  end

  private

  def score_params
    params.require(:game).permit(:name, :score, :level)
  end

  def level_params
    params.require(:game).permit(:level)
  end
end
