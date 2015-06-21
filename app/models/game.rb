class Game < ActiveRecord::Base
  validates :name, presence: true
  validates :score, presence:true
  validates :level, presence:true
end

