class CreateTravels < ActiveRecord::Migration[5.1]
  def change
    create_table :travels do |t|
      t.integer :user_id
      t.string :name
      t.string :from_name
      t.float :from_lagitude
      t.float :from_longitude
      t.string :to_name
      t.float :to_lagitude
      t.float :to_longitude

      t.timestamps
    end
  end
end
