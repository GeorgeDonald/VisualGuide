class Guide < ApplicationRecord
  validates :title, :latitude, :longitude, :heading, :pitch, presence: true
  validates_numericality_of :latitude, :pitch, in: -90.0..90.0
  validates_numericality_of :longitude, in: -180.0..180.0
  validates_numericality_of :heading, in: 0.0..360.0

  belongs_to :user
  has_many :followers
  has_many :messages
end
