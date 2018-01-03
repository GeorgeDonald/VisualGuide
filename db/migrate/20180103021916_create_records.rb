class CreateRecords < ActiveRecord::Migration[5.1]
  def change
    create_table :records do |t|
      t.integer :user_id
      t.string :name
      t.text :description
      t.string :file_name

      t.timestamps
    end
  end
end
