class CreateCurrentPositions < ActiveRecord::Migration[5.1]
  def change
    create_table :current_positions do |t|
      t.integer :user_id
      t.float :latitude
      t.float :longitude
      t.float :heading
      t.float :pitch

      t.timestamps
    end
  end
end
