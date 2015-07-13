class GamesController < ApplicationController

  def index
    display_rankings
  end

  def create
    @game = Game.create(score_params)
    display_rankings
    respond_to do |format|
      format.html { redirect_to :back }
      format.js
    end
  end

  private

  def display_rankings
    @beginners = Game.where(level:'Beginner').order(score: :asc).limit(10)
    @intermediates = Game.where(level:'Intermediate').order(score: :asc).limit(10)
    @experts = Game.where(level:'Expert').order(score: :asc).limit(10)
  end

  def score_params
    params.require(:game).permit(:name, :score, :level)
  end

end
