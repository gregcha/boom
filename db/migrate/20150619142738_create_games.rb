class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :name
      t.string :score
      t.string :level

      t.timestamps null: false
    end
  end
end
