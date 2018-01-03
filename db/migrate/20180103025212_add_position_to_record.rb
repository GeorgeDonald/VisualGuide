class AddPositionToRecord < ActiveRecord::Migration[5.1]
  def change
    add_column :records, :latitude, :float
    add_column :records, :longitude, :float
    add_column :records, :heading, :float
    add_column :records, :pitch, :float
  end
end
