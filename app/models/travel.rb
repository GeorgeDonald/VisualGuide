class Travel < ApplicationRecord
  validates :name, :start_latitude, :start_longitude, :end_latitude, :end_longitude, presence: true
  validates_numericality_of :start_latitude, :end_latitude, in: -90.0..90.0
  validates_numericality_of :start_longitude, :end_longitude, in: -180.0..180.0
end
