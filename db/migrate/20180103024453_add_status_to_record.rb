class AddStatusToRecord < ActiveRecord::Migration[5.1]
  def change
    add_column :records, :status, :integer
  end
end
