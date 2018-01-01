class CreateGuides < ActiveRecord::Migration[5.1]
  def change
    create_table :guides do |t|
      t.integer :user_id
      t.string :title
      t.text :description
      t.integer :status

      t.timestamps
    end
  end
end
