class CreateTravels < ActiveRecord::Migration[5.1]
  def change
    create_table :travels do |t|
      t.integer :user_id
      t.string :name
      t.text :introduction
      t.string :start_name
      t.float :start_latitude
      t.float :start_longitude
      t.string :end_name
      t.float :end_latitude
      t.float :end_longitude

      t.timestamps
    end
  end
end
