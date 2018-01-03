class CreateViewSequences < ActiveRecord::Migration[5.1]
  def change
    create_table :view_sequences do |t|
      t.integer :record_id
      t.float :latitude
      t.float :longitude
      t.float :heading
      t.float :pitch

      t.timestamps
    end
  end
end
