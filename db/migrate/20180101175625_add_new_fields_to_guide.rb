class AddNewFieldsToGuide < ActiveRecord::Migration[5.1]
  def change
    add_column :guides, :latitude, :float
    add_column :guides, :longitude, :float
    add_column :guides, :heading, :float
    add_column :guides, :pitch, :float
  end
end
