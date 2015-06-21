class GamesController < ApplicationController
  def new
    @game = Game.new
  end

  def create
    @game = Game.new(score_params)
    @game.save
    redirect_to root_path
  end

  def play
    @beginners = Game.where(level:'Beginner').order(score: :asc).limit(10)
    @intermediates = Game.where(level:'Intermediate').order(score: :asc).limit(10)
    @experts = Game.where(level:'Expert').order(score: :asc).limit(10)
    session[:games_count] ||= 0
    session[:games_count] += 1
  end

  def score_params
    params.require(:game).permit(:name, :score, :level)
  end

end
