class AddNewFieldsToTravel < ActiveRecord::Migration[5.1]
  def change
    add_column :travels, :start_heading, :float
    add_column :travels, :start_pitch, :float
    add_column :travels, :end_heading, :float
    add_column :travels, :end_pitch, :float
  end
end
